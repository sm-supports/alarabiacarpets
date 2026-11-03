"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickSender = pickSender;
exports.loadParsedEmail = loadParsedEmail;
exports.processEmailJob = processEmailJob;
exports.sendFailureAlert = sendFailureAlert;
exports.loadRawEmail = loadRawEmail;
const postal_mime_1 = __importDefault(require("postal-mime"));
const ai_1 = require("./ai");
const notify_1 = require("./notify");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
const zoho_1 = require("./zoho");
/**
 * Website contact-form mail arrives from noreply@<own domain> with the customer in Reply-To,
 * so prefer Reply-To whenever From is our own domain.
 */
function pickSender(from, replyTo, ownDomain) {
    const fromEmail = (0, utils_1.extractEmailAddress)(from);
    const reply = replyTo?.find((entry) => (0, utils_1.extractEmailAddress)(entry));
    if (ownDomain && fromEmail.endsWith(`@${ownDomain.toLowerCase()}`) && reply) {
        return { email: (0, utils_1.extractEmailAddress)(reply), name: (0, utils_1.extractDisplayName)(reply) };
    }
    return { email: fromEmail, name: (0, utils_1.extractDisplayName)(from) };
}
/** Raw email → parsed message plus the customer and subject, shared by the alert and the quote-draft paths. */
async function loadParsedEmail(env, jobId, record, fallbackZohoMessageId = "") {
    const zohoMessageId = String(record.zoho_message_id || fallbackZohoMessageId);
    const raw = await loadRawEmail(env, jobId, zohoMessageId, record.raw_email_key);
    const parsed = await postal_mime_1.default.parse(raw, { attachmentEncoding: "arraybuffer" });
    const sender = pickSender(parsed.from, parsed.replyTo, env.OWN_DOMAIN);
    return {
        parsed,
        senderEmail: sender.email || String(record.sender_email || ""),
        senderName: sender.name,
        subject: parsed.subject || String(record.subject || "(no subject)"),
        bodyText: (0, ai_1.bodyForPrompt)(parsed.text || "", parsed.html),
    };
}
/** "busy" means another consumer holds the lease; the caller should retry later. */
async function processEmailJob(env, job) {
    const record = await (0, storage_1.getJob)(env.DB, job.jobId);
    if (!record)
        throw new Error(`Email job not found: ${job.jobId}`);
    if ((0, storage_1.isTerminalState)(record.state))
        return "done";
    if (!(await (0, storage_1.claimJob)(env.DB, job.jobId)))
        return "busy";
    const zohoMessageId = String(record.zoho_message_id || job.zohoMessageId);
    const { parsed, senderEmail, senderName, subject, bodyText } = await loadParsedEmail(env, job.jobId, record, job.zohoMessageId);
    const attachmentFiles = parsed.attachments.map((attachment, index) => ({
        name: (0, utils_1.sanitizeFilename)(attachment.filename, `attachment-${index + 1}`),
        mimeType: (attachment.mimeType || "application/octet-stream").toLowerCase(),
        bytes: toArrayBuffer((0, utils_1.contentToBytes)(attachment.content)),
        inline: attachment.related === true,
    }));
    if (!(await (0, storage_1.hasAttachmentRows)(env.DB, job.jobId))) {
        for (const file of attachmentFiles.filter((item) => !(0, ai_1.isDecorativeInline)(item))) {
            await (0, storage_1.saveAttachment)(env.DB, job.jobId, { filename: file.name, mimeType: file.mimeType, size: file.bytes.byteLength, supported: (0, utils_1.attachmentIsSupported)(file.mimeType) });
        }
    }
    const metadata = {
        jobId: job.jobId,
        senderEmail,
        senderName,
        subject,
        receivedAt: String(record.received_at || job.receivedAt),
        bodyText,
        attachmentNames: attachmentFiles.filter((file) => !(0, ai_1.isDecorativeInline)(file)).map((file) => file.name),
    };
    const attachmentResult = await (0, ai_1.convertAttachments)(env, attachmentFiles);
    const lead = await (0, ai_1.extractLead)(env, metadata, attachmentResult.context);
    await (0, storage_1.setFields)(env.DB, job.jobId, { is_spam: lead.isSpam ? 1 : 0, ai_confidence: lead.confidence, organization_type: lead.organizationType, lead_json: JSON.stringify(lead) });
    if (lead.isSpam) {
        await (0, storage_1.markStep)(env.DB, job.jobId, "spam", { spam_reason: lead.spamReason || "AI classified as spam" });
        return "done";
    }
    await (0, zoho_1.markZohoImportant)(env, zohoMessageId);
    await (0, storage_1.setFields)(env.DB, job.jobId, { flagged_important: 1 });
    const forwardable = (0, notify_1.selectForwardableAttachments)(attachmentFiles);
    const attachmentSummary = `${(0, notify_1.attachmentCountsText)(forwardable)}; AI read ${attachmentResult.processed}, unreadable ${attachmentResult.unsupported}`;
    const alertId = await (0, notify_1.sendLeadAlert)(env, job.jobId, lead, metadata.subject, forwardable);
    await (0, storage_1.markStep)(env.DB, job.jobId, "sent", { alert_message_id: alertId, attachment_summary: attachmentSummary });
    return "done";
}
/** Last-resort alert after all retries fail, so a lead is never silently lost. */
async function sendFailureAlert(env, jobId) {
    const record = await (0, storage_1.getJob)(env.DB, jobId);
    await (0, notify_1.sendFallbackAlert)(env, String(record?.sender_email || "unknown sender"), String(record?.subject || "(no subject)"));
}
async function loadRawEmail(env, jobId, zohoMessageId, storedKey) {
    if (storedKey) {
        const object = await env.RAW_EMAILS.get(String(storedKey));
        if (object)
            return object.arrayBuffer();
    }
    const source = await (0, zoho_1.getOriginalMessage)(env, zohoMessageId);
    const bytes = new TextEncoder().encode(source);
    const key = `emails/${new Date().toISOString().slice(0, 10)}/${jobId}/message.eml`;
    await env.RAW_EMAILS.put(key, bytes, { httpMetadata: { contentType: "message/rfc822" } });
    await (0, storage_1.setFields)(env.DB, jobId, { raw_email_key: key });
    return toArrayBuffer(bytes);
}
function toArrayBuffer(bytes) {
    return bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
        ? bytes.buffer
        : bytes.slice().buffer;
}
