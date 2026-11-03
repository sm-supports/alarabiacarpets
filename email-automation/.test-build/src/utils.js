"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEmail = normalizeEmail;
exports.normalizeText = normalizeText;
exports.truncate = truncate;
exports.stripHtml = stripHtml;
exports.attachmentIsSupported = attachmentIsSupported;
exports.sanitizeFilename = sanitizeFilename;
exports.contentToBytes = contentToBytes;
exports.extractEmailAddress = extractEmailAddress;
exports.extractDisplayName = extractDisplayName;
exports.boundContext = boundContext;
exports.parseModelJson = parseModelJson;
exports.looksEnglish = looksEnglish;
const constants_1 = require("./constants");
function normalizeEmail(value) {
    return value.trim().toLowerCase().replace(/^<|>$/g, "");
}
function normalizeText(value) {
    return typeof value === "string" ? value.replace(/\u0000/g, "").trim() : "";
}
function truncate(value, max) {
    if (value.length <= max)
        return value;
    return `${value.slice(0, Math.max(0, max - 24)).trim()} …[truncated]`;
}
function stripHtml(value) {
    return value
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}
function attachmentIsSupported(mimeType) {
    return constants_1.SUPPORTED_ATTACHMENT_TYPES.has(mimeType.toLowerCase());
}
function sanitizeFilename(filename, fallback) {
    const basename = (filename || fallback).split(/[\\/]/).pop() || fallback;
    const value = basename.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
    return value.slice(0, 160) || fallback;
}
function contentToBytes(content) {
    if (content instanceof Uint8Array)
        return content;
    if (content instanceof ArrayBuffer)
        return new Uint8Array(content);
    return new TextEncoder().encode(content);
}
function extractEmailAddress(address) {
    if (!address || typeof address !== "object")
        return "";
    const candidate = address;
    return typeof candidate.address === "string" ? normalizeEmail(candidate.address) : "";
}
function extractDisplayName(address) {
    if (!address || typeof address !== "object")
        return undefined;
    const candidate = address;
    const name = normalizeText(candidate.name);
    return name || undefined;
}
function boundContext(parts) {
    const joined = parts.filter(Boolean).join("\n\n");
    return truncate(joined, constants_1.MAX_TOTAL_CONTEXT_CHARS);
}
function parseModelJson(value) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    try {
        return JSON.parse(cleaned);
    }
    catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start)
            return JSON.parse(cleaned.slice(start, end + 1));
        throw new Error("Workers AI returned invalid JSON");
    }
}
const ENGLISH_FUNCTION_WORDS = new Set([
    "the", "is", "are", "was", "were", "wants", "want", "wanted", "with", "and", "for", "from", "would", "like",
    "please", "they", "their", "has", "have", "had", "needs", "requires", "requested", "requesting", "asking",
    "looking", "provide", "send", "best", "about", "also", "which", "who", "this", "that", "of", "to", "in", "on",
]);
const BANGLISH_MARKERS = new Set([
    "theke", "chacche", "chaiche", "chay", "lagbe", "korte", "korche", "kore", "hobe", "jonno", "er", "ar", "ache",
    "nei", "jante", "dite", "ta", "gula", "kono", "ekta", "dorkar", "chan", "pathiyeche", "bolche", "jodi", "ki",
]);
/** True when a supposedly Banglish sentence is mostly English (by function words), so it should be rewritten. */
function looksEnglish(text) {
    const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const english = words.filter((word) => ENGLISH_FUNCTION_WORDS.has(word)).length;
    const banglish = words.filter((word) => BANGLISH_MARKERS.has(word)).length;
    return english >= 3 && english > banglish;
}
