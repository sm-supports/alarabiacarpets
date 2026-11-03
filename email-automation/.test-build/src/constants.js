"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_ATTACHMENT_TYPES = exports.DEFAULT_RETENTION_DAYS = exports.DEFAULT_AI_MODEL = exports.POLL_CRON = exports.MAX_QUEUE_ATTEMPTS = exports.STALE_RECEIVED_MINUTES = exports.POLL_MAX_PAGES = exports.POLL_PAGE_SIZE = exports.POLL_OVERLAP_MS = exports.TELEGRAM_MAX_FORWARDED = exports.TELEGRAM_MAX_DOCUMENT_BYTES = exports.TELEGRAM_MAX_PHOTO_BYTES = exports.INLINE_IMAGE_MIN_BYTES = exports.MAX_TOTAL_CONTEXT_CHARS = exports.MAX_ATTACHMENT_CONTEXT_CHARS = exports.MAX_BODY_CHARS = exports.MAX_ATTACHMENT_BYTES_FOR_AI = void 0;
exports.MAX_ATTACHMENT_BYTES_FOR_AI = 8 * 1024 * 1024;
// Llama 3.3 70B fp8-fast has a 24k-token window; keep the prompt well under it
// (Arabic text tokenizes at roughly 2 chars/token).
exports.MAX_BODY_CHARS = 10000;
exports.MAX_ATTACHMENT_CONTEXT_CHARS = 6000;
exports.MAX_TOTAL_CONTEXT_CHARS = 16000;
// Inline (pasted-in-body) images smaller than this are treated as signature logos/banners, not reference photos.
exports.INLINE_IMAGE_MIN_BYTES = 40 * 1024;
// Telegram Bot API upload limits: photos 10 MB, documents 50 MB; at most 10 items per media group.
exports.TELEGRAM_MAX_PHOTO_BYTES = 10 * 1024 * 1024;
exports.TELEGRAM_MAX_DOCUMENT_BYTES = 50 * 1024 * 1024;
exports.TELEGRAM_MAX_FORWARDED = 10;
exports.POLL_OVERLAP_MS = 10 * 60 * 1000;
exports.POLL_PAGE_SIZE = 50;
exports.POLL_MAX_PAGES = 4;
exports.STALE_RECEIVED_MINUTES = 10;
// Keep in sync with max_retries in wrangler.toml so the final attempt is handled here, not silently in the DLQ.
exports.MAX_QUEUE_ATTEMPTS = 5;
exports.POLL_CRON = "*/2 * * * *";
exports.DEFAULT_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
exports.DEFAULT_RETENTION_DAYS = 30;
exports.SUPPORTED_ATTACHMENT_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "image/bmp",
    "text/html",
    "text/csv",
    "application/xml",
    "application/vnd.ms-excel",
    "application/vnd.ms-excel.sheet.macroenabled.12",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.apple.numbers",
]);
