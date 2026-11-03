"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const poll_1 = require("./poll");
const processor_1 = require("./processor");
const storage_1 = require("./storage");
const telegram_bot_1 = require("./telegram-bot");
function retryDelay(attempts) {
    return Math.min(900, 60 * 2 ** (attempts - 1));
}
async function handleEmailMessage(env, message, job) {
    const attempts = message.attempts || 1;
    try {
        const result = await (0, processor_1.processEmailJob)(env, job);
        if (result === "busy")
            message.retry({ delaySeconds: 120 });
        else
            message.ack();
    }
    catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.error("Email automation job failed:", job.jobId, `attempt ${attempts}`, detail);
        await (0, storage_1.releaseJob)(env.DB, job.jobId, detail).catch((dbError) => console.error("releaseJob failed:", job.jobId, dbError));
        if (attempts < constants_1.MAX_QUEUE_ATTEMPTS) {
            message.retry({ delaySeconds: retryDelay(attempts) });
            return;
        }
        await (0, processor_1.sendFailureAlert)(env, job.jobId).catch((alertError) => console.error("Failure alert failed:", job.jobId, alertError));
        await (0, storage_1.markStep)(env.DB, job.jobId, "failed").catch((dbError) => console.error("markStep failed:", job.jobId, dbError));
        message.ack();
    }
}
async function handleDraftMessage(env, message, job) {
    const attempts = message.attempts || 1;
    try {
        const result = await (0, telegram_bot_1.processDraftJob)(env, job);
        if (result === "busy")
            message.retry({ delaySeconds: 120 });
        else
            message.ack();
    }
    catch (error) {
        console.error("Draft job failed:", job.updateId, `attempt ${attempts}`, error);
        // Staff-facing problems and missing Zoho permission won't fix themselves; tell staff right away.
        const permanent = error instanceof telegram_bot_1.StaffFacingError || /scope/i.test(String(error));
        if (!permanent && attempts < 3) {
            // Release the lease so the retry can claim it.
            await (0, storage_1.markDraftRequest)(env.DB, job.updateId, "retry", { last_error: String(error) }).catch((dbError) => console.error("markDraftRequest failed:", job.updateId, dbError));
            message.retry({ delaySeconds: retryDelay(attempts) });
            return;
        }
        await (0, telegram_bot_1.reportDraftFailure)(env, job, error).catch((reportError) => console.error("Draft failure report failed:", job.updateId, reportError));
        message.ack();
    }
}
exports.default = {
    async scheduled(event, env, _ctx) {
        if (event.cron === constants_1.POLL_CRON) {
            await (0, telegram_bot_1.ensureTelegramWebhook)(env).catch((error) => console.error("Telegram webhook registration failed:", error));
            const queued = await (0, poll_1.pollInbox)(env);
            if (queued)
                console.log(`Email automation queued ${queued} new Zoho messages`);
            return;
        }
        const deleted = await (0, storage_1.cleanupExpired)(env);
        console.log(`Email automation cleanup deleted ${deleted} stored objects`);
    },
    async queue(batch, env) {
        for (const message of batch.messages) {
            const job = message.body;
            if (job.kind === "draft")
                await handleDraftMessage(env, message, job);
            else
                await handleEmailMessage(env, message, job);
        }
    },
    async fetch(request, env, ctx) {
        const { pathname } = new URL(request.url);
        if (request.method === "POST" && pathname === telegram_bot_1.TELEGRAM_WEBHOOK_PATH)
            return (0, telegram_bot_1.handleTelegramWebhook)(request, env, ctx);
        if (request.method === "GET" && pathname === "/health") {
            return Response.json({ ok: true, service: "alarabiacarpets-email-automation" });
        }
        return new Response("Not found", { status: 404 });
    },
};
