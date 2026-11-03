"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const ai_1 = require("../src/ai");
const constants_1 = require("../src/constants");
const notify_1 = require("../src/notify");
const poll_1 = require("../src/poll");
const processor_1 = require("../src/processor");
const utils_1 = require("../src/utils");
const zoho_1 = require("../src/zoho");
(0, node_test_1.default)("reads Workers AI JSON-mode output whether it is an object, a string or OpenAI-style", () => {
    const lead = { isSpam: false, summaryBanglish: "Carpet quotation chaiche." };
    strict_1.default.deepEqual((0, utils_1.parseModelJson)((0, ai_1.modelOutput)({ response: lead, usage: { total_tokens: 10 } })), lead);
    strict_1.default.deepEqual((0, utils_1.parseModelJson)((0, ai_1.modelOutput)({ response: JSON.stringify(lead) })), lead);
    strict_1.default.deepEqual((0, utils_1.parseModelJson)((0, ai_1.modelOutput)({ choices: [{ message: { content: JSON.stringify(lead) } }] })), lead);
});
(0, node_test_1.default)("normalizes a sparse model result to safe defaults", () => {
    const lead = (0, ai_1.normalizeLead)({ organizationType: "spaceship", requestedProducts: [{ quantity: "5" }] }, "a@b.com");
    strict_1.default.equal(lead.isSpam, false);
    strict_1.default.equal(lead.organizationType, "unknown");
    strict_1.default.equal(lead.senderEmail, "a@b.com");
    strict_1.default.equal(lead.requestedProducts[0].product, "Unknown product");
    strict_1.default.equal(lead.confidence, 0);
});
function file(name, mimeType, size, inline = false) {
    return { name, mimeType, bytes: new ArrayBuffer(size), inline };
}
(0, node_test_1.default)("only sends supported, non-inline, reasonably sized attachments to toMarkdown", () => {
    const { eligible, skipped } = (0, ai_1.selectAttachmentsForAi)([
        file("quote.pdf", "application/pdf", 1000),
        file("logo.png", "image/png", 1000, true),
        file("archive.zip", "application/zip", 1000),
        file("huge.pdf", "application/pdf", 9 * 1024 * 1024),
        file("empty.pdf", "application/pdf", 0),
    ]);
    strict_1.default.deepEqual(eligible.map((item) => item.name), ["quote.pdf"]);
    strict_1.default.equal(skipped.length, 4);
    // A large image pasted into the body is a reference photo, so the AI should read it.
    strict_1.default.deepEqual((0, ai_1.selectAttachmentsForAi)([file("pasted.jpg", "image/jpeg", 200000, true)]).eligible.length, 1);
});
(0, node_test_1.default)("selects Inbox messages newer than the cursor minus overlap, oldest first, deduped", () => {
    const cursor = 1000000000000;
    const messages = [
        { messageId: "3", receivedTime: String(cursor + 5000), fromAddress: "C@x.com", subject: "c" },
        { messageId: "2", receivedTime: String(cursor - constants_1.POLL_OVERLAP_MS + 1), fromAddress: "b@x.com", subject: "b" },
        { messageId: "1", receivedTime: String(cursor - constants_1.POLL_OVERLAP_MS - 1), fromAddress: "a@x.com", subject: "a" },
        { messageId: "3", receivedTime: String(cursor + 5000), fromAddress: "c@x.com", subject: "c" },
        { messageId: "", receivedTime: String(cursor + 9000) },
    ];
    const selected = (0, poll_1.selectNewMessages)(messages, cursor);
    strict_1.default.deepEqual(selected.map((item) => item.messageId), ["2", "3"]);
    strict_1.default.equal(selected[1].fromAddress, "c@x.com");
    strict_1.default.equal((0, poll_1.nextCursor)(messages, cursor), cursor + 9000);
    strict_1.default.equal((0, poll_1.nextCursor)([], cursor), cursor);
});
(0, node_test_1.default)("builds a D1-safe job id from a Zoho message id", () => {
    strict_1.default.equal((0, poll_1.zohoJobId)("1709887058769100001"), "zoho-1709887058769100001");
});
(0, node_test_1.default)("uses Reply-To for website contact-form mail sent from our own domain", () => {
    const contactForm = (0, processor_1.pickSender)({ address: "noreply@alarabiacarpets.com", name: "Al Arabia Carpets" }, [{ address: "Customer@Example.com", name: "Customer" }], "alarabiacarpets.com");
    strict_1.default.deepEqual(contactForm, { email: "customer@example.com", name: "Customer" });
    const external = (0, processor_1.pickSender)({ address: "buyer@company.qa", name: "Buyer" }, [{ address: "other@company.qa" }], "alarabiacarpets.com");
    strict_1.default.equal(external.email, "buyer@company.qa");
});
(0, node_test_1.default)("picks the info@ Zoho account and the Inbox folder from API listings", () => {
    const accounts = [
        { accountId: "111", primaryEmailAddress: "sales@alarabiacarpets.com" },
        { accountId: "222", primaryEmailAddress: "Info@AlArabiaCarpets.com" },
    ];
    strict_1.default.equal((0, zoho_1.pickAccountId)(accounts, "info@alarabiacarpets.com"), "222");
    strict_1.default.equal((0, zoho_1.pickAccountId)([{ accountId: 333 }], "info@alarabiacarpets.com"), "333");
    strict_1.default.equal((0, zoho_1.pickAccountId)(undefined, "x"), "");
    const folders = [
        { folderId: "9", folderName: "Sent", folderType: "Sent" },
        { folderId: "7", folderName: "Inbox", folderType: "Inbox" },
    ];
    strict_1.default.equal((0, zoho_1.pickInboxFolderId)(folders), "7");
    strict_1.default.equal((0, zoho_1.pickInboxFolderId)([{ folderId: 5, folderName: "INBOX" }]), "5");
    strict_1.default.equal((0, zoho_1.pickInboxFolderId)([]), "");
});
(0, node_test_1.default)("picks Telegram first, WhatsApp only when fully configured, otherwise no channel", () => {
    const whatsapp = { WHATSAPP_ACCESS_TOKEN: "t", WHATSAPP_PHONE_NUMBER_ID: "p", WHATSAPP_ALERT_RECIPIENT: "974", WHATSAPP_TEMPLATE_NAME: "lead" };
    const telegram = { TELEGRAM_BOT_TOKEN: "b", TELEGRAM_CHAT_ID: "-100" };
    strict_1.default.equal((0, notify_1.alertChannel)(whatsapp), "whatsapp");
    strict_1.default.equal((0, notify_1.alertChannel)({ ...whatsapp, WHATSAPP_TEMPLATE_NAME: "" }), null);
    strict_1.default.equal((0, notify_1.alertChannel)({ ...whatsapp, ...telegram }), "telegram");
    strict_1.default.equal((0, notify_1.alertChannel)({ TELEGRAM_BOT_TOKEN: "b" }), null);
});
(0, node_test_1.default)("forwards reference photos and customer files but not logos", () => {
    const { photos, documents } = (0, notify_1.selectForwardableAttachments)([
        file("logo.png", "image/png", 4000, true),
        file("pasted.jpg", "image/jpeg", 200000, true),
        file("ref.png", "image/png", 300000),
        file("huge.jpg", "image/jpeg", 12 * 1024 * 1024),
        file("drawing.pdf", "application/pdf", 50000),
        file("boq.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 20000),
        file("scan.heic", "image/heic", 80000),
        file("setup.exe", "application/x-msdownload", 10000),
        file("empty.pdf", "application/pdf", 0),
    ]);
    strict_1.default.deepEqual(photos.map((item) => item.name), ["pasted.jpg", "ref.png"]);
    strict_1.default.deepEqual(documents.map((item) => item.name), ["huge.jpg", "drawing.pdf", "boq.xlsx", "scan.heic"]);
    const many = (0, notify_1.selectForwardableAttachments)(Array.from({ length: 14 }, (_, index) => file(`p${index}.jpg`, "image/jpeg", 20000)));
    strict_1.default.equal(many.photos.length, 10);
    strict_1.default.equal((0, notify_1.attachmentCountsText)({ photos, documents }), "Chobi: 2 ta, File: 4 ta");
    strict_1.default.equal((0, notify_1.attachmentCountsText)({ photos: [], documents: [] }), "Attachment nai");
});
(0, node_test_1.default)("normalizeLead keeps requirement specs and drops empty ones", () => {
    const lead = (0, ai_1.normalizeLead)({ requestedProducts: [{ product: "carpet", quantity: "2", size: "5m x 3m", color: " ", thickness: "12mm" }] }, "a@b.com");
    strict_1.default.deepEqual(lead.requestedProducts[0], { product: "carpet", quantity: "2", unit: undefined, size: "5m x 3m", shape: undefined, thickness: "12mm", material: undefined, color: undefined, notes: undefined });
});
