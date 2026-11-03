"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTerminalState = isTerminalState;
exports.createJob = createJob;
exports.saveAttachment = saveAttachment;
exports.hasAttachmentRows = hasAttachmentRows;
exports.markStep = markStep;
exports.setFields = setFields;
exports.getJob = getJob;
exports.claimJob = claimJob;
exports.releaseJob = releaseJob;
exports.getStaleReceivedJobs = getStaleReceivedJobs;
exports.getState = getState;
exports.setState = setState;
exports.getPollCursor = getPollCursor;
exports.setPollCursor = setPollCursor;
exports.getAttachmentKeys = getAttachmentKeys;
exports.cleanupExpired = cleanupExpired;
exports.findJobByAlertId = findJobByAlertId;
exports.createDraftRequest = createDraftRequest;
exports.getDraftRequest = getDraftRequest;
exports.claimDraftRequest = claimDraftRequest;
exports.linkTelegramMessages = linkTelegramMessages;
exports.findJobByTelegramMessage = findJobByTelegramMessage;
exports.markDraftRequest = markDraftRequest;
const constants_1 = require("./constants");
const TERMINAL_STATES = ["sent", "spam", "failed"];
function isTerminalState(state) {
    return TERMINAL_STATES.includes(String(state));
}
/** Returns true when a new row was inserted (false = already known). */
async function createJob(db, data) {
    const result = await db.prepare(`
    INSERT OR IGNORE INTO email_jobs
      (job_id, message_key, zoho_message_id, sender_email, subject, received_at, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'received', datetime('now'), datetime('now'))
  `).bind(data.jobId, data.messageKey, data.zohoMessageId, data.senderEmail, data.subject, data.receivedAt).run();
    return Number(result.meta?.changes || 0) > 0;
}
async function saveAttachment(db, jobId, attachment) {
    await db.prepare(`
    INSERT OR IGNORE INTO attachments (job_id, storage_key, filename, mime_type, size_bytes, supported, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(jobId, attachment.key || null, attachment.filename, attachment.mimeType, attachment.size, attachment.supported ? 1 : 0).run();
}
async function hasAttachmentRows(db, jobId) {
    return Boolean(await db.prepare("SELECT 1 AS found FROM attachments WHERE job_id = ? LIMIT 1").bind(jobId).first());
}
async function markStep(db, jobId, state, extra = {}) {
    const fields = ["state = ?", "lease_until = NULL", "updated_at = datetime('now')"];
    const values = [state];
    for (const [key, value] of Object.entries(extra)) {
        if (!/^[a-z_]+$/.test(key))
            continue;
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(jobId);
    await db.prepare(`UPDATE email_jobs SET ${fields.join(", ")} WHERE job_id = ?`).bind(...values).run();
}
/** Updates columns without touching state or the lease. */
async function setFields(db, jobId, extra) {
    const fields = ["updated_at = datetime('now')"];
    const values = [];
    for (const [key, value] of Object.entries(extra)) {
        if (!/^[a-z_]+$/.test(key))
            continue;
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(jobId);
    await db.prepare(`UPDATE email_jobs SET ${fields.join(", ")} WHERE job_id = ?`).bind(...values).run();
}
async function getJob(db, jobId) {
    return db.prepare("SELECT * FROM email_jobs WHERE job_id = ? LIMIT 1").bind(jobId).first();
}
async function claimJob(db, jobId) {
    const result = await db.prepare(`
    UPDATE email_jobs
    SET state = 'processing', lease_until = datetime('now', '+10 minutes'), updated_at = datetime('now')
    WHERE job_id = ?
      AND state NOT IN ('sent', 'spam', 'failed')
      AND (state <> 'processing' OR lease_until IS NULL OR lease_until < datetime('now'))
  `).bind(jobId).run();
    return Number(result.meta?.changes || 0) > 0;
}
/** Drops the lease after a failed attempt so the queue retry can claim the job again. */
async function releaseJob(db, jobId, error) {
    await db.prepare(`
    UPDATE email_jobs
    SET state = 'retry', lease_until = NULL, attempts = attempts + 1, last_error = ?, updated_at = datetime('now')
    WHERE job_id = ? AND state NOT IN ('sent', 'spam', 'failed')
  `).bind(error.slice(0, 1000), jobId).run();
}
/** Jobs inserted by the poller whose queue send never happened (state still 'received'). */
async function getStaleReceivedJobs(db) {
    const result = await db.prepare(`
    SELECT job_id, zoho_message_id, received_at FROM email_jobs
    WHERE state = 'received' AND created_at < datetime('now', ?) LIMIT 20
  `).bind(`-${constants_1.STALE_RECEIVED_MINUTES} minutes`).all();
    return result.results;
}
async function getState(db, key) {
    const row = await db.prepare("SELECT value FROM poll_state WHERE key = ?").bind(key).first();
    return row ? row.value : null;
}
async function setState(db, key, value) {
    await db.prepare(`
    INSERT INTO poll_state (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).bind(key, value).run();
}
async function getPollCursor(db) {
    const value = await getState(db, "inbox_cursor_ms");
    return value === null ? null : Number(value);
}
async function setPollCursor(db, cursorMs) {
    await setState(db, "inbox_cursor_ms", String(cursorMs));
}
async function getAttachmentKeys(db, jobId) {
    const result = await db.prepare("SELECT storage_key FROM attachments WHERE job_id = ? AND storage_key IS NOT NULL").bind(jobId).all();
    return result.results.map((row) => row.storage_key).filter(Boolean);
}
async function cleanupExpired(env) {
    const days = Number(env.RETENTION_DAYS || constants_1.DEFAULT_RETENTION_DAYS);
    const jobs = await env.DB.prepare("SELECT job_id, raw_email_key FROM email_jobs WHERE created_at < datetime('now', ?) AND raw_email_key IS NOT NULL LIMIT 100").bind(`-${days} days`).all();
    let deleted = 0;
    for (const job of jobs.results) {
        const keys = [job.raw_email_key, ...(await getAttachmentKeys(env.DB, job.job_id))];
        await env.RAW_EMAILS.delete(keys);
        await env.DB.prepare("UPDATE email_jobs SET raw_email_key = NULL, updated_at = datetime('now') WHERE job_id = ?").bind(job.job_id).run();
        await env.DB.prepare("UPDATE attachments SET storage_key = NULL, storage_deleted_at = datetime('now') WHERE job_id = ?").bind(job.job_id).run();
        deleted += keys.length;
    }
    return deleted;
}
async function findJobByAlertId(db, alertId) {
    return db.prepare("SELECT * FROM email_jobs WHERE alert_message_id = ? LIMIT 1").bind(alertId).first();
}
/** Returns true when this Telegram update was not seen before (Telegram may deliver an update twice). */
async function createDraftRequest(db, data) {
    const result = await db.prepare(`
    INSERT OR IGNORE INTO draft_requests (update_id, job_id, staff_message, telegram_message_id, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'queued', datetime('now'), datetime('now'))
  `).bind(data.updateId, data.jobId, data.staffMessage, data.telegramMessageId).run();
    return Number(result.meta?.changes || 0) > 0;
}
async function getDraftRequest(db, updateId) {
    return db.prepare("SELECT * FROM draft_requests WHERE update_id = ? LIMIT 1").bind(updateId).first();
}
/** Lease a draft request so concurrent or redelivered queue messages can't each save a Zoho draft. */
async function claimDraftRequest(db, updateId) {
    const result = await db.prepare(`
    UPDATE draft_requests SET state = 'processing', updated_at = datetime('now')
    WHERE update_id = ?
      AND (state IN ('queued', 'retry') OR (state = 'processing' AND updated_at < datetime('now', '-10 minutes')))
  `).bind(updateId).run();
    return Number(result.meta?.changes || 0) > 0;
}
/** Records every Telegram message that belongs to a job (alert, forwarded files, bot replies). */
async function linkTelegramMessages(db, jobId, messageIds) {
    for (const messageId of messageIds) {
        await db.prepare("INSERT OR IGNORE INTO telegram_messages (message_id, job_id) VALUES (?, ?)").bind(messageId, jobId).run();
    }
}
/** The job a replied-to Telegram message belongs to; falls back to alert IDs from before the mapping table. */
async function findJobByTelegramMessage(db, messageId) {
    const linked = await db.prepare(`
    SELECT email_jobs.* FROM telegram_messages JOIN email_jobs ON email_jobs.job_id = telegram_messages.job_id
    WHERE telegram_messages.message_id = ? LIMIT 1
  `).bind(messageId).first();
    return linked || findJobByAlertId(db, `telegram:${messageId}`);
}
async function markDraftRequest(db, updateId, state, extra = {}) {
    await db.prepare(`
    UPDATE draft_requests SET state = ?, zoho_draft_id = COALESCE(?, zoho_draft_id), last_error = ?, updated_at = datetime('now')
    WHERE update_id = ?
  `).bind(state, extra.zoho_draft_id || null, extra.last_error ? extra.last_error.slice(0, 1000) : null, updateId).run();
}
