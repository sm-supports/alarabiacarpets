"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickAccountId = pickAccountId;
exports.accountAddresses = accountAddresses;
exports.pickFromAddress = pickFromAddress;
exports.pickInboxFolderId = pickInboxFolderId;
exports.listInboxSince = listInboxSince;
exports.getOriginalMessage = getOriginalMessage;
exports.markZohoImportant = markZohoImportant;
exports.zohoFromAddress = zohoFromAddress;
exports.saveZohoDraft = saveZohoDraft;
const constants_1 = require("./constants");
const storage_1 = require("./storage");
// Zoho rate-limits refresh-token exchanges, so reuse one access token per isolate until it nears expiry.
let cachedToken = null;
async function accessToken(env) {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60000)
        return cachedToken.value;
    const base = env.ZOHO_ACCOUNTS_BASE_URL || "https://accounts.zoho.com";
    const params = new URLSearchParams({
        refresh_token: env.ZOHO_REFRESH_TOKEN,
        grant_type: "refresh_token",
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
    });
    const response = await fetch(`${base}/oauth/v2/token?${params.toString()}`, { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.access_token)
        throw new Error(`Zoho token refresh failed: ${data.error || response.status}`);
    cachedToken = { value: data.access_token, expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000 };
    return data.access_token;
}
async function zohoFetch(env, path, init = {}) {
    const token = await accessToken(env);
    const base = env.ZOHO_API_BASE_URL || "https://mail.zoho.com";
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Zoho-oauthtoken ${token}`);
    headers.set("Accept", "application/json");
    const response = await fetch(`${base}${path}`, { ...init, headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401)
        cachedToken = null;
    if (!response.ok || data?.status?.code >= 400)
        throw new Error(`Zoho API failed: ${response.status} ${data?.status?.description || ""}`.trim());
    return data;
}
let cachedIds = null;
/** Prefers the mailbox for `preferredEmail` (e.g. info@alarabiacarpets.com), else the first account. */
function pickAccountId(accounts, preferredEmail) {
    const list = Array.isArray(accounts) ? accounts : [];
    const preferred = preferredEmail.toLowerCase();
    const match = list.find((account) => preferred && JSON.stringify(account).toLowerCase().includes(preferred)) || list[0];
    return match?.accountId ? String(match.accountId) : "";
}
/** Addresses an account may send from: its send-as addresses, mailbox addresses and primary address. */
function accountAddresses(account) {
    if (!account)
        return [];
    const list = (value, key) => Array.isArray(value) ? value.map((entry) => String(entry?.[key] || "")) : [];
    const all = [
        ...list(account.sendMailDetails, "fromAddress"),
        ...list(account.emailAddress, "mailId"),
        String(account.primaryEmailAddress || ""),
        String(account.mailboxAddress || ""),
    ].map((address) => address.trim().toLowerCase()).filter((address) => address.includes("@"));
    return all.filter((address, index) => all.indexOf(address) === index);
}
/** The preferred address when the account can send as it, else the account's primary address. */
function pickFromAddress(account, preferred) {
    const addresses = accountAddresses(account);
    if (preferred && addresses.includes(preferred.toLowerCase()))
        return preferred.toLowerCase();
    return String(account?.primaryEmailAddress || "").toLowerCase() || addresses[0] || "";
}
function pickInboxFolderId(folders) {
    const list = Array.isArray(folders) ? folders : [];
    const inbox = list.find((folder) => String(folder.folderType || "").toLowerCase() === "inbox")
        || list.find((folder) => String(folder.folderName || "").toLowerCase() === "inbox");
    return inbox?.folderId ? String(inbox.folderId) : "";
}
/** Uses the secrets when set; otherwise looks the IDs up once via the API and keeps them in D1. */
async function zohoIds(env) {
    if (env.ZOHO_ACCOUNT_ID && env.ZOHO_INBOX_FOLDER_ID)
        return { accountId: env.ZOHO_ACCOUNT_ID, inboxFolderId: env.ZOHO_INBOX_FOLDER_ID };
    if (cachedIds)
        return cachedIds;
    let accountId = env.ZOHO_ACCOUNT_ID || await (0, storage_1.getState)(env.DB, "zoho_account_id") || "";
    let inboxFolderId = env.ZOHO_INBOX_FOLDER_ID || await (0, storage_1.getState)(env.DB, "zoho_inbox_folder_id") || "";
    if (!accountId) {
        const accounts = await zohoFetch(env, "/api/accounts");
        accountId = pickAccountId(accounts?.data, env.OWN_DOMAIN ? `info@${env.OWN_DOMAIN}` : "");
        if (!accountId)
            throw new Error("Zoho account ID not found in /api/accounts");
        await (0, storage_1.setState)(env.DB, "zoho_account_id", accountId);
        console.log("Discovered Zoho account ID", accountId);
    }
    if (!inboxFolderId) {
        const folders = await zohoFetch(env, `/api/accounts/${accountId}/folders`);
        inboxFolderId = pickInboxFolderId(folders?.data);
        if (!inboxFolderId)
            throw new Error("Zoho Inbox folder not found");
        await (0, storage_1.setState)(env.DB, "zoho_inbox_folder_id", inboxFolderId);
        console.log("Discovered Zoho Inbox folder ID", inboxFolderId);
    }
    cachedIds = { accountId, inboxFolderId };
    return cachedIds;
}
/** Newest-first Inbox listing, paging back until a message older than `sinceMs` is seen. */
async function listInboxSince(env, sinceMs) {
    const { accountId, inboxFolderId } = await zohoIds(env);
    const all = [];
    for (let page = 0; page < constants_1.POLL_MAX_PAGES; page += 1) {
        const query = new URLSearchParams({
            folderId: inboxFolderId,
            start: String(page * constants_1.POLL_PAGE_SIZE + 1),
            limit: String(constants_1.POLL_PAGE_SIZE),
            sortBy: "date",
            sortorder: "false",
        });
        const data = await zohoFetch(env, `/api/accounts/${accountId}/messages/view?${query.toString()}`);
        const messages = Array.isArray(data?.data) ? data.data : [];
        all.push(...messages);
        const oldest = Number(messages[messages.length - 1]?.receivedTime || 0);
        if (messages.length < constants_1.POLL_PAGE_SIZE || oldest < sinceMs)
            break;
    }
    return all;
}
/** Raw RFC 822 source of a message. */
async function getOriginalMessage(env, messageId) {
    const { accountId } = await zohoIds(env);
    const data = await zohoFetch(env, `/api/accounts/${accountId}/messages/${encodeURIComponent(messageId)}/originalmessage`);
    const content = data?.data?.content;
    if (typeof content !== "string" || !content)
        throw new Error(`Zoho original message empty: ${messageId}`);
    return content;
}
async function markZohoImportant(env, messageId) {
    // messageId only: passing threadId would flag the whole conversation. Not folder-specific,
    // so it still works if staff moved the email out of the Inbox before the job ran.
    const body = { mode: "setFlag", messageId: [messageId], flagid: "important" };
    const { accountId } = await zohoIds(env);
    await zohoFetch(env, `/api/accounts/${accountId}/updatemessage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}
/** From-address for drafts, taken from the authenticated Zoho account (cached in D1) unless overridden. */
async function zohoFromAddress(env) {
    if (env.ZOHO_FROM_ADDRESS)
        return env.ZOHO_FROM_ADDRESS;
    const stored = await (0, storage_1.getState)(env.DB, "zoho_from_address");
    if (stored)
        return stored;
    const { accountId } = await zohoIds(env);
    const accounts = await zohoFetch(env, "/api/accounts");
    const list = Array.isArray(accounts?.data) ? accounts.data : [];
    const account = list.find((entry) => String(entry.accountId) === accountId);
    const preferred = env.OWN_DOMAIN ? `info@${env.OWN_DOMAIN}` : "";
    const address = pickFromAddress(account, preferred);
    if (!address)
        throw new Error("Zoho account has no sending address");
    if (preferred && address !== preferred)
        console.warn(`Zoho account ${accountId} cannot send as ${preferred}; drafts will be from ${address}`);
    await (0, storage_1.setState)(env.DB, "zoho_from_address", address);
    return address;
}
/** Saves (does not send) a reply draft, threaded under the original message via In-Reply-To/References. */
async function saveZohoDraft(env, draft) {
    const { accountId } = await zohoIds(env);
    const body = {
        mode: "draft",
        fromAddress: draft.from,
        toAddress: draft.to,
        subject: draft.subject,
        content: draft.html,
        mailFormat: "html",
    };
    if (draft.inReplyTo)
        body.inReplyTo = draft.inReplyTo;
    if (draft.refHeader)
        body.refHeader = draft.refHeader;
    const data = await zohoFetch(env, `/api/accounts/${accountId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return String(data?.data?.messageId || data?.data?.messageid || "saved");
}
