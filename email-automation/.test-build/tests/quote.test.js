"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const quote_1 = require("../src/quote");
const ai_1 = require("../src/ai");
const zoho_1 = require("../src/zoho");
const telegram_bot_1 = require("../src/telegram-bot");
const base = { quotationAttached: true, terms: [], notes: [] };
(0, node_test_1.default)("prices a single line with Total, as in Quotation No. 95", () => {
    const block = (0, quote_1.buildPriceBlock)({
        ...base,
        items: [{ description: "Full System Blinds (approx. 1.2 m × 1.5 m each)", quantity: 5, unit: "Nos", unitPrice: 600 }],
        terms: [{ label: "Delivery", value: "Al Khor" }, { label: "Payment Terms", value: "60 Days PDC" }, { label: "Quotation Validity", value: "30 days" }],
    });
    strict_1.default.equal(block.text, [
        "Summary:",
        "- Full System Blinds (approx. 1.2 m × 1.5 m each): 5 Nos × QR 600 = QR 3,000.00",
        "- Total: QR 3,000.00",
        "",
        "Delivery: Al Khor",
        "Payment Terms: 60 Days PDC",
        "Quotation Validity: 30 days",
    ].join("\n"));
});
(0, node_test_1.default)("adds up several lines with decimals exactly (Quotations 94 and 85)", () => {
    const ceiling = (0, quote_1.buildPriceBlock)({ ...base, items: [
            { description: "Supply & Installation of Metal Ceiling", quantity: 40, unit: "sqm", unitPrice: 120 },
            { description: "Removal of Existing Ceiling Tiles", quantity: 40, unit: "sqm", unitPrice: 20 },
        ] });
    strict_1.default.match(ceiling.text, /40 sqm × QR 120 = QR 4,800\.00/);
    strict_1.default.match(ceiling.text, /40 sqm × QR 20 = QR 800\.00/);
    strict_1.default.match(ceiling.text, /- Total: QR 5,600\.00/);
    const majlis = (0, quote_1.buildPriceBlock)({ ...base, items: [
            { description: "Jalsa seat", quantity: 13.26, unit: "SQM", unitPrice: 450 },
            { description: "One person seat (2 pcs) + two person seat (2 pcs)", quantity: 4, unit: "pcs", unitPrice: 950 },
        ] });
    strict_1.default.match(majlis.text, /13\.26 SQM × QR 450 = QR 5,967\.00/);
    strict_1.default.match(majlis.text, /- Total: QR 9,767\.00/);
    strict_1.default.equal(majlis.total, 9767);
});
(0, node_test_1.default)("flags a staff total that disagrees with the calculation", () => {
    const block = (0, quote_1.buildPriceBlock)({ ...base, items: [{ description: "Carpet", quantity: 300, unit: "m²", unitPrice: 65 }], statedTotal: 19000 });
    strict_1.default.match(block.text, /- Total: QR 19,500\.00/);
    strict_1.default.deepEqual(block.totalMismatch, { stated: 19000, calculated: 19500 });
    strict_1.default.equal((0, quote_1.buildPriceBlock)({ ...base, items: [{ description: "Carpet", quantity: 300, unit: "m²", unitPrice: 65 }], statedTotal: 19500 }).totalMismatch, undefined);
});
(0, node_test_1.default)("handles lump sums, rate-only and unpriced lines without inventing totals", () => {
    const block = (0, quote_1.buildPriceBlock)({ ...base, items: [
            { description: "Carpet rolls as per BOQ", amount: 25830 },
            { description: "Carpet tiles", unitPrice: 65, unit: "sqm" },
            { description: "Underlay", quantity: 10, unit: "rolls" },
        ], statedTotal: 25830 });
    strict_1.default.match(block.text, /- Carpet rolls as per BOQ: QR 25,830\.00/);
    strict_1.default.match(block.text, /- Carpet tiles: QR 65 per sqm/);
    strict_1.default.match(block.text, /- Underlay \(10 rolls\): \[price\]/);
    strict_1.default.match(block.text, /- Total: QR 25,830\.00/);
    strict_1.default.equal((0, quote_1.buildPriceBlock)({ ...base, items: [{ description: "Underlay" }] }).text, "Summary:\n- Underlay: [price]");
});
(0, node_test_1.default)("normalizes model output and drops junk", () => {
    const value = (0, quote_1.normalizeInstructions)({ items: [{ description: "Carpet", quantity: "2", unitPrice: "1,200" }, { description: "", unitPrice: 5 }, { description: "Bad", quantity: -1 }], terms: [{ label: "Delivery", value: "" }], notes: ["", "Offer sample"], quotationAttached: "yes" });
    strict_1.default.deepEqual(value.items, [{ description: "Carpet", quantity: 2, unit: undefined, unitPrice: 1200, amount: undefined }, { description: "Bad", quantity: undefined, unit: undefined, unitPrice: undefined, amount: undefined }]);
    strict_1.default.deepEqual(value.terms, []);
    strict_1.default.deepEqual(value.notes, ["Offer sample"]);
    strict_1.default.equal(value.quotationAttached, false);
});
(0, node_test_1.default)("places the price block at the token, or after the opening if the model dropped it", () => {
    const block = "Summary:\n- Total: QR 1.00";
    const withToken = (0, quote_1.assembleEmail)(`Dear Antony,\n\nThank you.\n\n${quote_1.PRICE_BLOCK_TOKEN}\n\nRegards line.\n\nBest regards,`, block, "Al Arabia Carpets");
    strict_1.default.equal(withToken, `Dear Antony,\n\nThank you.\n\n${block}\n\nRegards line.\n\nBest regards,\nAl Arabia Carpets`);
    const without = (0, quote_1.assembleEmail)("Subject: Quote\nDear Antony,\n\nThank you.\n\nPlease find our offer.\n\nClosing.", block, "");
    strict_1.default.equal(without, `Dear Antony,\n\nThank you.\n\nPlease find our offer.\n\n${block}\n\nClosing.\n\nBest regards,`);
    strict_1.default.ok(!(0, quote_1.assembleEmail)(`A\n\n${quote_1.PRICE_BLOCK_TOKEN}\n\n${quote_1.PRICE_BLOCK_TOKEN}\n\nBest regards,`, block, "").includes(quote_1.PRICE_BLOCK_TOKEN));
});
(0, node_test_1.default)("builds escaped HTML with the original quoted, and a Re: subject", () => {
    const html = (0, quote_1.emailHtml)("Dear A,\n\nPrice <b>QR 5</b>", { sender: "Antony <a@b.com>", date: "Mon", body: "Need carpet & curtains" });
    strict_1.default.match(html, /<p>Dear A,<\/p><p>Price &lt;b&gt;QR 5&lt;\/b&gt;<\/p>/);
    strict_1.default.match(html, /Antony &lt;a@b\.com&gt; wrote:/);
    strict_1.default.match(html, /Need carpet &amp; curtains/);
    strict_1.default.equal((0, quote_1.replySubject)("HCSPAOO1: Carpet"), "Re: HCSPAOO1: Carpet");
    strict_1.default.equal((0, quote_1.replySubject)("RE: Quote"), "RE: Quote");
});
(0, node_test_1.default)("accepts only staff text replies with a number, in the alert chat", () => {
    const update = (message) => ({ update_id: 9, message: { message_id: 50, chat: { id: -5549025071 }, from: { id: 1 }, text: "carpet 1200 per pc", reply_to_message: { message_id: 7, from: { is_bot: true } }, ...message } });
    strict_1.default.deepEqual((0, telegram_bot_1.priceReplyFrom)(update({}), "-5549025071"), { updateId: 9, messageId: "50", replyToId: "7", replyToBot: true, text: "carpet 1200 per pc" });
    strict_1.default.equal((0, telegram_bot_1.priceReplyFrom)(update({ chat: { id: 123 } }), "-5549025071"), null);
    strict_1.default.equal((0, telegram_bot_1.priceReplyFrom)(update({ text: "ok thanks" }), "-5549025071"), null);
    strict_1.default.equal((0, telegram_bot_1.priceReplyFrom)(update({ reply_to_message: undefined }), "-5549025071"), null);
    strict_1.default.equal((0, telegram_bot_1.priceReplyFrom)(update({ from: { id: 2, is_bot: true } }), "-5549025071"), null);
    strict_1.default.equal((0, telegram_bot_1.priceReplyFrom)({ update_id: 1 }, "-5549025071"), null);
});
(0, node_test_1.default)("keeps one sign-off even when the model writes its own name or signature", () => {
    const signature = "Al Arabia Carpets\n+974 5551 2858";
    strict_1.default.equal((0, quote_1.assembleEmail)("Dear A,\n\nThanks.\n\nBest regards,\nAl Arabia Carpets", "", signature), `Dear A,\n\nThanks.\n\nBest regards,\n${signature}`);
    strict_1.default.equal((0, quote_1.assembleEmail)("Dear A,\n\nThanks.\n\nKind regards,\nJohn\nSales Team", "", signature), `Dear A,\n\nThanks.\n\nKind regards,\n${signature}`);
    strict_1.default.equal((0, quote_1.assembleEmail)("Dear A,\n\nThanks & Regards,", "", ""), "Dear A,\n\nThanks & Regards,");
    strict_1.default.equal((0, quote_1.assembleEmail)("Dear A,\n\nThanks.", "", ""), "Dear A,\n\nThanks.\n\nBest regards,");
});
(0, node_test_1.default)("builds unfolded, de-duplicated References and In-Reply-To", () => {
    strict_1.default.equal((0, quote_1.buildRefHeader)("<a@x>\r\n\t<b@x>", "<c@x>"), "<a@x> <b@x> <c@x>");
    strict_1.default.equal((0, quote_1.buildRefHeader)("<a@x> <c@x>", "<c@x>"), "<a@x> <c@x>");
    strict_1.default.equal((0, quote_1.buildRefHeader)(undefined, "<c@x>"), "<c@x>");
    strict_1.default.equal((0, quote_1.buildRefHeader)(undefined, undefined), undefined);
});
(0, node_test_1.default)("formats the quoted-original date in Qatar time", () => {
    strict_1.default.equal((0, quote_1.formatQuoteDate)("2026-10-24T13:00:00.000Z"), "Sat, 24 Oct 2026 at 16:00");
    strict_1.default.equal((0, quote_1.formatQuoteDate)("not a date"), "not a date");
});
(0, node_test_1.default)("drafts are sent from an address the Zoho account owns", () => {
    const account = { primaryEmailAddress: "sajat@example.com", sendMailDetails: [{ fromAddress: "Info@AlArabiaCarpets.com" }], emailAddress: [{ mailId: "sajat@example.com" }] };
    strict_1.default.equal((0, zoho_1.pickFromAddress)(account, "info@alarabiacarpets.com"), "info@alarabiacarpets.com");
    strict_1.default.equal((0, zoho_1.pickFromAddress)({ primaryEmailAddress: "sajat@example.com" }, "info@alarabiacarpets.com"), "sajat@example.com");
    strict_1.default.equal((0, zoho_1.pickFromAddress)(undefined, "info@alarabiacarpets.com"), "");
});
(0, node_test_1.default)("treats signature banners and logos as decorative, pasted photos as content", () => {
    const inline = (name, mimeType, size) => ({ name, mimeType, bytes: new ArrayBuffer(size), inline: true });
    strict_1.default.equal((0, ai_1.isDecorativeInline)(inline("image001.png", "image/png", 60000)), true, "60KB PNG banner");
    strict_1.default.equal((0, ai_1.isDecorativeInline)(inline("company-logo.jpg", "image/jpeg", 90000)), true, "named logo");
    strict_1.default.equal((0, ai_1.isDecorativeInline)(inline("image002.jpg", "image/jpeg", 30000)), true, "small jpeg");
    strict_1.default.equal((0, ai_1.isDecorativeInline)(inline("image003.jpg", "image/jpeg", 250000)), false, "pasted photo");
    strict_1.default.equal((0, ai_1.isDecorativeInline)(inline("screenshot.png", "image/png", 400000)), false, "large screenshot");
    strict_1.default.equal((0, ai_1.isDecorativeInline)({ ...inline("ref.jpg", "image/jpeg", 1000), inline: false }), false, "real attachment");
});
