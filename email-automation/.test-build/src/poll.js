"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectNewMessages = selectNewMessages;
exports.nextCursor = nextCursor;
exports.zohoJobId = zohoJobId;
exports.pollInbox = pollInbox;
const constants_1 = require("./constants");
const notify_1 = require("./notify");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
const zoho_1 = require("./zoho");
/**
 * Messages received after `cursorMs - POLL_OVERLAP_MS`, oldest first. The overlap catches mail Zoho
 * indexes late; D1's UNIQUE message_key turns the re-seen ones into no-ops.
 */
function selectNewMessages(messages, cursorMs) {
    const since = cursorMs - constants_1.POLL_OVERLAP_MS;
    const seen = new Set();
    const candidates = [];
    for (const message of messages) {
        const messageId = String(message.messageId || "");
        const receivedTime = Number(message.receivedTime || 0);
        if (!messageId || !receivedTime || receivedTime <= since || seen.has(messageId))
            continue;
        seen.add(messageId);
        candidates.push({
            messageId,
            receivedTime,
            fromAddress: (0, utils_1.normalizeEmail)(String(message.fromAddress || "")),
            subject: String(message.subject || "(no subject)"),
        });
    }
    return candidates.sort((a, b) => a.receivedTime - b.receivedTime);
}
/** Highest receivedTime seen, never moving backwards. */
function nextCursor(messages, cursorMs) {
    return messages.reduce((max, message) => Math.max(max, Number(message.receivedTime || 0)), cursorMs);
}
function zohoJobId(messageId) {
    return `zoho-${messageId.replace(/[^a-zA-Z0-9]/g, "")}`;
}
async function pollInbox(env) {
    const cursor = await (0, storage_1.getPollCursor)(env.DB);
    if (cursor === null) {
        // First run: start from now instead of alerting on the whole existing Inbox.
        await (0, storage_1.setPollCursor)(env.DB, Date.now());
        return 0;
    }
    const messages = await (0, zoho_1.listInboxSince)(env, cursor - constants_1.POLL_OVERLAP_MS);
    if (!(0, notify_1.alertChannel)(env)) {
        // Zoho works but alerts can't be sent yet: skip mail instead of queueing jobs that would fail,
        // and keep the cursor moving so going live doesn't alert on a backlog.
        const skipped = selectNewMessages(messages, cursor).length;
        console.log(`Zoho poll ok (${messages.length} listed); no alert channel configured, skipped ${skipped} new messages`);
        await (0, storage_1.setPollCursor)(env.DB, nextCursor(messages, cursor));
        return 0;
    }
    let queued = 0;
    for (const candidate of selectNewMessages(messages, cursor)) {
        const jobId = zohoJobId(candidate.messageId);
        const receivedAt = new Date(candidate.receivedTime).toISOString();
        const inserted = await (0, storage_1.createJob)(env.DB, {
            jobId,
            messageKey: `zoho:${candidate.messageId}`,
            zohoMessageId: candidate.messageId,
            senderEmail: candidate.fromAddress || "unknown",
            subject: candidate.subject,
            receivedAt,
        });
        if (!inserted)
            continue;
        await enqueue(env, { jobId, zohoMessageId: candidate.messageId, receivedAt });
        queued += 1;
    }
    // Re-send jobs whose earlier queue send failed after the D1 insert.
    for (const stale of await (0, storage_1.getStaleReceivedJobs)(env.DB)) {
        await enqueue(env, { jobId: stale.job_id, zohoMessageId: stale.zoho_message_id, receivedAt: stale.received_at });
    }
    await (0, storage_1.setPollCursor)(env.DB, nextCursor(messages, cursor));
    return queued;
}
async function enqueue(env, job) {
    await env.EMAIL_QUEUE.send(job);
    await (0, storage_1.markStep)(env.DB, job.jobId, "queued");
}
