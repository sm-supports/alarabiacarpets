"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_PARAM_CAPS = void 0;
exports.normalizeQuantity = normalizeQuantity;
exports.formatRequirement = formatRequirement;
exports.formatProducts = formatProducts;
exports.formatContact = formatContact;
exports.sanitizeTemplateParam = sanitizeTemplateParam;
exports.buildWhatsAppVariables = buildWhatsAppVariables;
exports.buildFallbackVariables = buildFallbackVariables;
exports.buildTelegramAlert = buildTelegramAlert;
exports.buildTelegramFallback = buildTelegramFallback;
const utils_1 = require("./utils");
const UNIT_ALIASES = [
    [/^(pcs?|pieces?|nos?\.?|units?|numbers?)$/i, "pc"],
    [/^(sq\.?\s*m(eters?|etres?)?|sqm|m2|m²|square\s+met(er|re)s?)$/i, "sqm"],
    [/^(sq\.?\s*f(ee)?t|sqft|ft2|ft²|square\s+f(ee|oo)t)$/i, "sqft"],
];
/** "2" + "PCS" → "2 pc", "255sqm" → "255 sqm"; other units are kept as written (lower-cased). */
function normalizeQuantity(quantity, unit) {
    let qty = (quantity || "").trim();
    let rawUnit = (unit || "").trim();
    const glued = qty.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-Z²][a-zA-Z². ]*)$/);
    if (glued && !rawUnit) {
        qty = glued[1];
        rawUnit = glued[2].trim();
    }
    const alias = UNIT_ALIASES.find(([pattern]) => pattern.test(rawUnit));
    const normalizedUnit = alias ? alias[1] : rawUnit.toLowerCase();
    return [qty, normalizedUnit].filter(Boolean).join(" ");
}
function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}
/** One-line form for the WhatsApp template, which cannot contain newlines. */
function formatProduct(product) {
    const details = [normalizeQuantity(product.quantity, product.unit), product.size, product.color].filter(Boolean).join(", ");
    return `${capitalize(product.product)}${details ? ` — ${details}` : ""}`;
}
const SPEC_LABELS = [
    ["size", "Size"],
    ["shape", "Shape"],
    ["thickness", "Thickness"],
    ["material", "Material"],
    ["color", "Color"],
    ["notes", "Note"],
];
/** Multi-line block for one requested item; only specs the customer actually gave are listed. */
function formatRequirement(product, index) {
    const lines = [`${index + 1}) ${capitalize(product.product)}`];
    const quantity = normalizeQuantity(product.quantity, product.unit);
    if (quantity)
        lines.push(`   • Quantity: ${quantity}`);
    for (const [key, label] of SPEC_LABELS) {
        const value = product[key];
        if (value)
            lines.push(`   • ${label}: ${value}`);
    }
    return lines;
}
function formatProducts(products) {
    if (!products.length)
        return "Product/quantity clear na";
    return products.slice(0, 12).map(formatProduct).join("; ");
}
function formatContact(alert) {
    return [alert.location, alert.phone].filter(Boolean).join(" / ") || "Paowa jayni";
}
/**
 * Meta rejects template parameters containing newlines, tabs or more than four consecutive spaces
 * (error 132018), and empty parameters.
 */
function sanitizeTemplateParam(value, max) {
    const cleaned = value.replace(/[\r\n\t]+/g, " ").replace(/ {4,}/g, "   ").trim();
    return (0, utils_1.truncate)(cleaned, max) || "-";
}
// Six caps sum to 870 chars, leaving room for the template's fixed text under Meta's 1024-char body limit.
exports.TEMPLATE_PARAM_CAPS = [120, 20, 250, 250, 130, 100];
function buildWhatsAppVariables(alert, zohoReference, attachmentSummary) {
    const sender = [alert.organizationName, alert.senderName, alert.senderEmail].filter(Boolean).join(" | ");
    const quote = alert.quotationRequested ? "Haan" : "Na/clear na";
    const values = [
        sender,
        alert.organizationType,
        alert.summaryBanglish || "Customer-er request review korte hobe.",
        formatProducts(alert.requestedProducts),
        `${formatContact(alert)} | Quotation: ${quote} | ${attachmentSummary}`,
        zohoReference,
    ];
    return values.map((value, index) => sanitizeTemplateParam(value, exports.TEMPLATE_PARAM_CAPS[index]));
}
/** Two variables for the fallback template sent when automatic processing gives up. */
function buildFallbackVariables(sender, subject) {
    return [sanitizeTemplateParam(sender, 160), sanitizeTemplateParam(subject, 200)];
}
const ORGANIZATION_LABELS = {
    company: "Company",
    business: "Business",
    mosque: "Mosque",
    institution: "Institution",
    individual: "Individual",
    unknown: "Unknown",
};
/** Plain-text Telegram alert with English labels and Banglish sentences; Telegram allows 4096 chars. */
function buildTelegramAlert(alert, subject, forwarded) {
    const from = [alert.senderName, alert.organizationName].filter(Boolean).join(" — ") || alert.senderEmail;
    const lines = ["🚨 Notun customer inquiry", "", `From: ${from}`, `Email: ${alert.senderEmail}`];
    if (alert.phone)
        lines.push(`Phone: ${alert.phone}`);
    if (alert.location)
        lines.push(`Location: ${alert.location}`);
    lines.push(`Type: ${ORGANIZATION_LABELS[alert.organizationType] || alert.organizationType}`, "", `Summary: ${alert.summaryBanglish}`, "");
    if (alert.requestedProducts.length) {
        lines.push("Requirements:");
        alert.requestedProducts.slice(0, 20).forEach((product, index) => lines.push(...formatRequirement(product, index)));
    }
    else {
        lines.push("Requirements: clear na, email-ta check korun");
    }
    if (alert.requestedServices?.length)
        lines.push(`Services: ${alert.requestedServices.join(", ")}`);
    lines.push("", `Quotation chaiche: ${alert.quotationRequested ? "Haan" : "Na/clear na"}`);
    if (alert.missingInformation.length)
        lines.push(`Missing info: ${alert.missingInformation.join(", ")}`);
    if (forwarded.photos)
        lines.push(`Reference chobi: ${forwarded.photos} ta (niche deya holo)`);
    if (forwarded.documents)
        lines.push(`File: ${forwarded.documents} ta (niche deya holo)`);
    lines.push(`Subject: ${subject}`, "Zoho Mail-e Important flag kora hoyeche.");
    return (0, utils_1.truncate)(lines.join("\n"), 3800);
}
function buildTelegramFallback(sender, subject) {
    return (0, utils_1.truncate)(`⚠️ Ekta email auto-process kora jayni.\nFrom: ${sender || "-"}\nSubject: ${subject || "-"}\nZoho-te check korun.`, 1000);
}
