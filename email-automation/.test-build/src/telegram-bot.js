"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffFacingError = exports.TELEGRAM_WEBHOOK_PATH = void 0;
exports.priceReplyFrom = priceReplyFrom;
exports.handleTelegramWebhook = handleTelegramWebhook;
exports.processDraftJob = processDraftJob;
exports.reportDraftFailure = reportDraftFailure;
exports.ensureTelegramWebhook = ensureTelegramWebhook;
const processor_1 = require("./processor");
const quote_1 = require("./quote");
const storage_1 = require("./storage");
const telegram_1 = require("./telegram");
const zoho_1 = require("./zoho");
exports.TELEGRAM_WEBHOOK_PATH = "/telegram/webhook";
/** An error whose message is shown to staff as-is; retrying would not help. */
class StaffFacingError extends Error {
}
exports.StaffFacingError = StaffFacingError;
/** A staff text reply, in the alert chat, to another message, containing at least one number (a price). */
function priceReplyFrom(update, chatId) {
    const message = update.message;
    if (!message || !chatId || String(message.chat?.id) !== String(chatId))
        return null;
    if (message.from?.is_bot || !message.reply_to_message || !message.text || !/\d/.test(message.text))
        return null;
    return {
        updateId: update.update_id,
        messageId: String(message.message_id),
        replyToId: String(message.reply_to_message.message_id),
        replyToBot: message.reply_to_message.from?.is_bot === true,
        text: message.text.trim(),
    };
}
/** Webhook entry: authenticate, queue the work, answer Telegram immediately. */
async function handleTelegramWebhook(request, env, ctx) {
    const secret = await (0, storage_1.getState)(env.DB, "telegram_webhook_secret");
    if (!secret || request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== secret)
        return new Response("Unauthorized", { status: 401 });
    const update = await request.json().catch(() => null);
    if (update)
        ctx.waitUntil(routeUpdate(env, update).catch((error) => console.error("Telegram update failed:", error)));
    return new Response("ok");
}
async function routeUpdate(env, update) {
    const reply = priceReplyFrom(update, env.TELEGRAM_CHAT_ID);
    if (!reply)
        return;
    // Any bot message tied to the job counts: the alert, its forwarded photos/files, or an earlier bot reply.
    const job = await (0, storage_1.findJobByTelegramMessage)(env.DB, reply.replyToId);
    if (!job) {
        if (reply.replyToBot)
            await (0, telegram_1.sendTelegramMessage)(env, "Ei message-ta kono alert na. Draft banate alert message (ba tar chobi/file) er reply hisebe price pathan.", reply.messageId);
        return;
    }
    const jobId = String(job.job_id);
    const isNew = await (0, storage_1.createDraftRequest)(env.DB, { updateId: reply.updateId, jobId, staffMessage: reply.text, telegramMessageId: reply.messageId });
    if (!isNew)
        return;
    try {
        await env.EMAIL_QUEUE.send({ kind: "draft", updateId: reply.updateId, jobId, staffMessage: reply.text, telegramMessageId: reply.messageId });
    }
    catch (error) {
        // Telegram already got its 200 and won't redeliver, so tell staff instead of leaving the request stuck.
        await (0, storage_1.markDraftRequest)(env.DB, reply.updateId, "failed", { last_error: error instanceof Error ? error.message : String(error) });
        await (0, telegram_1.sendTelegramMessage)(env, "❌ Draft request nite parini (technical problem). Abar reply diye try korun.", reply.messageId);
        throw error;
    }
    const ackId = await (0, telegram_1.sendTelegramMessage)(env, "⏳ Draft toiri hocche...", reply.messageId);
    await (0, storage_1.linkTelegramMessages)(env.DB, jobId, [ackId]);
}
/**
 * Queue consumer step: build the English reply and save it as a Zoho draft, then confirm in Telegram.
 * "busy" means another delivery holds the lease; the caller should retry later.
 */
async function processDraftJob(env, job) {
    const request = await (0, storage_1.getDraftRequest)(env.DB, job.updateId);
    if (!request || request.state === "saved" || request.state === "failed")
        return "done";
    if (!(await (0, storage_1.claimDraftRequest)(env.DB, job.updateId)))
        return "busy";
    const record = await (0, storage_1.getJob)(env.DB, job.jobId);
    if (!record)
        throw new StaffFacingError("Original email-ta database-e paowa jayni.");
    const { parsed, senderEmail: customerEmail, senderName, subject, bodyText } = await (0, processor_1.loadParsedEmail)(env, job.jobId, record);
    if (!customerEmail)
        throw new StaffFacingError("Customer-er email address paowa jayni.");
    const context = {
        customerName: senderName,
        customerEmail,
        subject,
        emailBody: bodyText,
        lead: parseLead(record.lead_json),
    };
    const instructions = await (0, quote_1.readStaffInstructions)(env, job.staffMessage, context);
    if (!instructions.items.length && !instructions.terms.length && !instructions.notes.length) {
        throw new StaffFacingError("Message theke price/terms bujhte parini. Udahoron: \"carpet 1200 per pc, delivery Doha, validity 30 days\"");
    }
    const priceBlock = (0, quote_1.buildPriceBlock)(instructions);
    const body = await (0, quote_1.writeQuoteEmail)(env, instructions, context);
    const text = (0, quote_1.assembleEmail)(body, priceBlock.text, (env.DRAFT_SIGNATURE || "Al Arabia Carpets").replace(/\\n/g, "\n"));
    const html = (0, quote_1.emailHtml)(text, { sender: [senderName, customerEmail].filter(Boolean).join(" "), date: (0, quote_1.formatQuoteDate)(parsed.date || String(record.received_at || "")), body: context.emailBody });
    const inReplyTo = (0, quote_1.buildRefHeader)(undefined, parsed.messageId);
    const draftId = await (0, zoho_1.saveZohoDraft)(env, {
        from: await (0, zoho_1.zohoFromAddress)(env),
        to: customerEmail,
        subject: (0, quote_1.replySubject)(subject || "Your enquiry"),
        html,
        inReplyTo,
        refHeader: (0, quote_1.buildRefHeader)(parsed.references, parsed.messageId),
    });
    // The draft exists now: nothing below may throw, or a queue retry would save a second draft.
    await (0, storage_1.markDraftRequest)(env.DB, job.updateId, "saved", { zoho_draft_id: draftId }).catch((error) => console.error("markDraftRequest failed after save:", job.updateId, error));
    const confirmation = [
        "✅ Draft save hoyeche: Zoho Mail → Drafts",
        `To: ${customerEmail}`,
        `Subject: ${(0, quote_1.replySubject)(subject || "Your enquiry")}`,
        "",
        priceBlock.text || "(Price block nai)",
    ];
    if (priceBlock.totalMismatch) {
        confirmation.push("", `⚠️ Apnar deya total ${(0, quote_1.formatMoney)(priceBlock.totalMismatch.stated)}, kintu hisab kore ${(0, quote_1.formatMoney)(priceBlock.totalMismatch.calculated)} hoy. Draft-e hisab-er total deya hoyeche, check korun.`);
    }
    if (text.includes("["))
        confirmation.push("", "✏️ Draft-e [ ] bracket-er jaygagulo fill korun.");
    if (instructions.quotationAttached)
        confirmation.push("📎 Send korar age quotation PDF attach korun.");
    confirmation.push("Check kore Zoho theke send korun.");
    try {
        const confirmationId = await (0, telegram_1.sendTelegramMessage)(env, confirmation.join("\n"), job.telegramMessageId);
        await (0, storage_1.linkTelegramMessages)(env.DB, job.jobId, [confirmationId]);
    }
    catch (error) {
        console.error("Draft confirmation failed:", job.updateId, error);
    }
    return "done";
}
async function reportDraftFailure(env, job, error) {
    const detail = error instanceof Error ? error.message : String(error);
    await (0, storage_1.markDraftRequest)(env.DB, job.updateId, "failed", { last_error: detail });
    const reason = error instanceof StaffFacingError
        ? detail
        : /scope/i.test(detail)
            ? "Zoho-te draft save korar permission nai. Zoho token abar generate korte hobe (ZohoMail.messages.CREATE scope soho)."
            : "Technical problem hoyeche, ekto pore abar reply diye try korun.";
    await (0, telegram_1.sendTelegramMessage)(env, `❌ Draft save kora jayni: ${reason}`, job.telegramMessageId);
}
function parseLead(value) {
    if (typeof value !== "string" || !value)
        return undefined;
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
/** Registers the webhook once per URL (cheap D1 check on every poll), with a random secret token. */
async function ensureTelegramWebhook(env) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.WORKER_URL)
        return;
    const url = `${env.WORKER_URL.replace(/\/$/, "")}${exports.TELEGRAM_WEBHOOK_PATH}`;
    if ((await (0, storage_1.getState)(env.DB, "telegram_webhook_url")) === url)
        return;
    let secret = await (0, storage_1.getState)(env.DB, "telegram_webhook_secret");
    if (!secret) {
        secret = crypto.randomUUID().replace(/-/g, "");
        await (0, storage_1.setState)(env.DB, "telegram_webhook_secret", secret);
    }
    await (0, telegram_1.telegramApi)(env, "setWebhook", { url, secret_token: secret, allowed_updates: ["message"] });
    await (0, storage_1.setState)(env.DB, "telegram_webhook_url", url);
    console.log("Telegram webhook registered", url);
}
