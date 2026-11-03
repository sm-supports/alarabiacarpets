"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const format_1 = require("../src/format");
const utils_1 = require("../src/utils");
const baseAlert = {
    isSpam: false,
    organizationType: "company",
    senderName: "Rahim",
    senderEmail: "rahim@example.com",
    organizationName: "ABC Trading",
    summaryBanglish: "Office-er jonno carpet quotation chaiche.",
    requestedProducts: [{ product: "Office carpet", quantity: "500", unit: "sqm" }],
    quotationRequested: true,
    missingInformation: [],
    confidence: 0.94,
};
(0, node_test_1.default)("formats product quantities for the WhatsApp template", () => {
    strict_1.default.equal((0, format_1.formatProducts)(baseAlert.requestedProducts), "Office carpet — 500 sqm");
});
(0, node_test_1.default)("builds six bounded WhatsApp template variables", () => {
    const variables = (0, format_1.buildWhatsAppVariables)(baseAlert, "Zoho 123", "1 processed, 0 unsupported/unreadable");
    strict_1.default.equal(variables.length, 6);
    strict_1.default.match(variables[0], /ABC Trading/);
    strict_1.default.match(variables[3], /500 sqm/);
    strict_1.default.match(variables[5], /Zoho 123/);
    variables.forEach((value, index) => strict_1.default.ok(value.length <= format_1.TEMPLATE_PARAM_CAPS[index]));
});
(0, node_test_1.default)("keeps the six variables under Meta's 1024-char body limit even for huge input", () => {
    const huge = "x".repeat(5000);
    const variables = (0, format_1.buildWhatsAppVariables)({
        ...baseAlert,
        organizationName: huge,
        summaryBanglish: huge,
        requestedProducts: Array.from({ length: 30 }, () => ({ product: huge, quantity: "9", unit: "sqm" })),
        location: huge,
    }, huge, huge);
    const total = variables.reduce((sum, value) => sum + value.length, 0);
    strict_1.default.ok(total <= 900, `total ${total}`);
});
(0, node_test_1.default)("sanitizes template params the way Meta requires", () => {
    strict_1.default.equal((0, format_1.sanitizeTemplateParam)("Line one\nLine\ttwo     spaced", 100), "Line one Line two   spaced");
    strict_1.default.equal((0, format_1.sanitizeTemplateParam)("   ", 100), "-");
    strict_1.default.ok(!/[\n\t]/.test((0, format_1.buildWhatsAppVariables)({ ...baseAlert, summaryBanglish: "a\n\nb" }, "ref", "att")[2]));
    strict_1.default.deepEqual((0, format_1.buildFallbackVariables)("", "Quote\nplease"), ["-", "Quote please"]);
});
(0, node_test_1.default)("parses fenced Workers AI JSON and strips unsafe filename characters", () => {
    strict_1.default.deepEqual((0, utils_1.parseModelJson)("```json\n{\"isSpam\":false}\n```"), { isSpam: false });
    strict_1.default.equal((0, utils_1.sanitizeFilename)("../../quote sheet (final).pdf", "attachment"), "quote-sheet-final-.pdf");
});
(0, node_test_1.default)("turns HTML email content into bounded readable text", () => {
    strict_1.default.equal((0, utils_1.stripHtml)("<p>Hello&nbsp;team</p><script>bad()</script><br>Quote please"), "Hello team\nQuote please");
});
const majestic = {
    isSpam: false,
    organizationType: "company",
    senderName: "Antony",
    senderEmail: "antony@majestiqatar.com",
    organizationName: "Majestic International W.L.L",
    summaryBanglish: "Majestic International theke Antony 2 ta carpet-er quotation chacche, best price jante chaiche.",
    requestedProducts: [{ product: "carpet", quantity: "2", unit: "PCS", size: "5m x 3m", shape: "Circular or oblong", thickness: "12mm", color: "Ivory/Beige", notes: "Commercial-grade construction" }],
    phone: "+974-44355413",
    quotationRequested: true,
    missingInformation: ["Delivery location"],
    confidence: 0.9,
};
(0, node_test_1.default)("lists each requirement spec on its own line with English labels", () => {
    const text = (0, format_1.buildTelegramAlert)(majestic, "HCSPAOO1: Carpet", { photos: 2, documents: 1 });
    const expected = [
        "From: Antony — Majestic International W.L.L",
        "Email: antony@majestiqatar.com",
        "Phone: +974-44355413",
        "Type: Company",
        "Requirements:\n1) Carpet\n   • Quantity: 2 pc\n   • Size: 5m x 3m\n   • Shape: Circular or oblong\n   • Thickness: 12mm\n   • Color: Ivory/Beige\n   • Note: Commercial-grade construction",
        "Quotation chaiche: Haan",
        "Missing info: Delivery location",
        "Reference chobi: 2 ta (niche deya holo)",
        "File: 1 ta (niche deya holo)",
        "Subject: HCSPAOO1: Carpet",
    ];
    for (const part of expected)
        strict_1.default.ok(text.includes(part), `missing: ${part}`);
    strict_1.default.ok(!text.includes("Location:"), "no Location line when unknown");
    strict_1.default.ok(!text.includes("undefined"));
});
(0, node_test_1.default)("omits empty spec lines and attachment lines, numbers multiple items", () => {
    const text = (0, format_1.buildTelegramAlert)({ ...majestic, phone: undefined, requestedProducts: [{ product: "Curtains", quantity: "20", unit: "windows" }, { product: "Majlis sofa", quantity: "1 set" }] }, "Quote", { photos: 0, documents: 0 });
    strict_1.default.ok(text.includes("1) Curtains\n   • Quantity: 20 windows\n2) Majlis sofa\n   • Quantity: 1 set"));
    strict_1.default.ok(!text.includes("Size:") && !text.includes("Phone:") && !text.includes("Reference chobi") && !text.includes("File:"));
    strict_1.default.match((0, format_1.buildTelegramAlert)({ ...majestic, requestedProducts: [] }, "s", { photos: 0, documents: 0 }), /Requirements: clear na/);
    strict_1.default.ok((0, format_1.buildTelegramAlert)({ ...majestic, summaryBanglish: "x".repeat(10000) }, "s", { photos: 0, documents: 0 }).length <= 3800);
    strict_1.default.match((0, format_1.buildTelegramFallback)("a@b.com", "Hi"), /Zoho-te check korun/);
});
(0, node_test_1.default)("normalizes quantities and units", () => {
    strict_1.default.equal((0, format_1.normalizeQuantity)("2", "PCS"), "2 pc");
    strict_1.default.equal((0, format_1.normalizeQuantity)("2 PCS"), "2 pc");
    strict_1.default.equal((0, format_1.normalizeQuantity)("255sqm"), "255 sqm");
    strict_1.default.equal((0, format_1.normalizeQuantity)("500", "sq m"), "500 sqm");
    strict_1.default.equal((0, format_1.normalizeQuantity)("40", "m²"), "40 sqm");
    strict_1.default.equal((0, format_1.normalizeQuantity)("20", "Windows"), "20 windows");
    strict_1.default.equal((0, format_1.normalizeQuantity)(undefined, undefined), "");
});
(0, node_test_1.default)("flags English summaries and accepts Banglish ones", () => {
    strict_1.default.equal((0, utils_1.looksEnglish)("Antony from Majestic International W.L.L wants carpet quotation with best price, item details: 2 PCS"), true);
    strict_1.default.equal((0, utils_1.looksEnglish)(majestic.summaryBanglish), false);
    strict_1.default.equal((0, utils_1.looksEnglish)("Ekjon customer tar villa-r living room-er jonno curtain chacche."), false);
});
