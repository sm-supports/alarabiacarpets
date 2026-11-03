"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramApi = telegramApi;
exports.sendTelegramMessage = sendTelegramMessage;
exports.sendTelegramPhotos = sendTelegramPhotos;
exports.sendTelegramDocument = sendTelegramDocument;
async function callTelegram(env, method, body) {
    const init = typeof body === "string"
        ? { method: "POST", headers: { "Content-Type": "application/json" }, body }
        : { method: "POST", body };
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, init);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok)
        throw new Error(`Telegram ${method} failed: ${data.description || response.status}`);
    return data;
}
async function telegramApi(env, method, payload) {
    await callTelegram(env, method, JSON.stringify(payload));
}
async function sendTelegramMessage(env, text, replyTo) {
    // Plain text (no parse_mode) so customer-supplied characters never break formatting.
    const payload = { chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true };
    if (replyTo)
        payload.reply_parameters = { message_id: Number(replyTo), allow_sending_without_reply: true };
    const [messageId] = messageIds(await callTelegram(env, "sendMessage", JSON.stringify(payload)));
    if (!messageId)
        throw new Error("Telegram sendMessage returned no message_id");
    return messageId;
}
function baseForm(env, replyTo) {
    const form = new FormData();
    form.append("chat_id", String(env.TELEGRAM_CHAT_ID));
    form.append("reply_parameters", JSON.stringify({ message_id: Number(replyTo), allow_sending_without_reply: true }));
    return form;
}
function messageIds(data) {
    const results = Array.isArray(data.result) ? data.result : [data.result];
    return results.map((result) => result?.message_id).filter((id) => Boolean(id)).map(String);
}
function blobOf(file) {
    return new Blob([file.bytes], { type: file.mimeType });
}
/** One photo → sendPhoto; 2–10 → a single album via sendMediaGroup. Threaded under the alert message. Returns message IDs. */
async function sendTelegramPhotos(env, photos, replyTo) {
    if (!photos.length)
        return [];
    const form = baseForm(env, replyTo);
    if (photos.length === 1) {
        form.append("photo", blobOf(photos[0]), photos[0].name);
        return messageIds(await callTelegram(env, "sendPhoto", form));
    }
    form.append("media", JSON.stringify(photos.map((_, index) => ({ type: "photo", media: `attach://file${index}` }))));
    photos.forEach((photo, index) => form.append(`file${index}`, blobOf(photo), photo.name));
    return messageIds(await callTelegram(env, "sendMediaGroup", form));
}
async function sendTelegramDocument(env, file, replyTo) {
    const form = baseForm(env, replyTo);
    form.append("document", blobOf(file), file.name);
    return messageIds(await callTelegram(env, "sendDocument", form));
}
