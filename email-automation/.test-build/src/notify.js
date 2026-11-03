"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertChannel = alertChannel;
exports.selectForwardableAttachments = selectForwardableAttachments;
exports.sendLeadAlert = sendLeadAlert;
exports.attachmentCountsText = attachmentCountsText;
exports.sendFallbackAlert = sendFallbackAlert;
const ai_1 = require("./ai");
const constants_1 = require("./constants");
const storage_1 = require("./storage");
const format_1 = require("./format");
const telegram_1 = require("./telegram");
const whatsapp_1 = require("./whatsapp");
/** Telegram wins when configured; WhatsApp needs every template secret. Null = alerts are off. */
function alertChannel(env) {
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID)
        return "telegram";
    if (env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ALERT_RECIPIENT && env.WHATSAPP_TEMPLATE_NAME)
        return "whatsapp";
    return null;
}
const TELEGRAM_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.ms-excel.sheet.macroenabled.12",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.apple.numbers",
    "text/csv",
]);
/**
 * Reference photos (incl. images pasted into the body, minus signature logos) and customer files
 * worth forwarding under the alert. Photos Telegram cannot take as a photo go as documents.
 */
function selectForwardableAttachments(files) {
    const photos = [];
    const documents = [];
    for (const file of files) {
        const size = file.bytes.byteLength;
        if (!size || (0, ai_1.isDecorativeInline)(file))
            continue;
        if (TELEGRAM_PHOTO_TYPES.has(file.mimeType) && size <= constants_1.TELEGRAM_MAX_PHOTO_BYTES) {
            if (photos.length < constants_1.TELEGRAM_MAX_FORWARDED)
                photos.push(file);
        }
        else if ((DOCUMENT_TYPES.has(file.mimeType) || file.mimeType.startsWith("image/")) && size <= constants_1.TELEGRAM_MAX_DOCUMENT_BYTES) {
            if (documents.length < constants_1.TELEGRAM_MAX_FORWARDED)
                documents.push(file);
        }
    }
    return { photos, documents };
}
/** Returns "<channel>:<message id>". Attachments are best-effort so a failed upload never re-sends the text alert. */
async function sendLeadAlert(env, jobId, lead, subject, attachments) {
    const channel = alertChannel(env);
    if (channel === "telegram") {
        const counts = { photos: attachments.photos.length, documents: attachments.documents.length };
        const messageId = await (0, telegram_1.sendTelegramMessage)(env, (0, format_1.buildTelegramAlert)(lead, subject, counts));
        const forwardedIds = await forwardAttachments(env, attachments, messageId);
        // Best-effort like the uploads: staff can still reply to the alert itself if this fails.
        await (0, storage_1.linkTelegramMessages)(env.DB, jobId, [messageId, ...forwardedIds]).catch((error) => console.error("linkTelegramMessages failed:", jobId, error));
        return `telegram:${messageId}`;
    }
    if (channel === "whatsapp") {
        const id = await (0, whatsapp_1.sendWhatsAppTemplate)(env, env.WHATSAPP_TEMPLATE_NAME || "", (0, format_1.buildWhatsAppVariables)(lead, `Subject: ${subject}`, attachmentCountsText(attachments)));
        return `whatsapp:${id}`;
    }
    throw new Error("No alert channel configured");
}
/** Best-effort uploads threaded under the alert; returns the message IDs that were sent. */
async function forwardAttachments(env, attachments, replyTo) {
    const sent = [];
    const sendDocument = async (file) => {
        try {
            sent.push(...await (0, telegram_1.sendTelegramDocument)(env, file, replyTo));
        }
        catch (error) {
            console.error("Telegram document send failed:", file.name, error);
        }
    };
    try {
        sent.push(...await (0, telegram_1.sendTelegramPhotos)(env, attachments.photos, replyTo));
    }
    catch (error) {
        // An album fails as a whole (e.g. one oversized image), so retry each photo as a plain file.
        console.error("Telegram photo send failed, sending as documents:", error);
        for (const photo of attachments.photos)
            await sendDocument(photo);
    }
    for (const document of attachments.documents)
        await sendDocument(document);
    return sent;
}
function attachmentCountsText(attachments) {
    const { photos, documents } = attachments;
    if (!photos.length && !documents.length)
        return "Attachment nai";
    return [photos.length && `Chobi: ${photos.length} ta`, documents.length && `File: ${documents.length} ta`].filter(Boolean).join(", ");
}
async function sendFallbackAlert(env, sender, subject) {
    const channel = alertChannel(env);
    if (channel === "telegram") {
        await (0, telegram_1.sendTelegramMessage)(env, (0, format_1.buildTelegramFallback)(sender, subject));
    }
    else if (channel === "whatsapp" && env.WHATSAPP_FALLBACK_TEMPLATE_NAME) {
        await (0, whatsapp_1.sendWhatsAppTemplate)(env, env.WHATSAPP_FALLBACK_TEMPLATE_NAME, (0, format_1.buildFallbackVariables)(sender, subject));
    }
    else {
        console.error("No fallback alert channel configured");
    }
}
