"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppTemplate = sendWhatsAppTemplate;
async function sendWhatsAppTemplate(env, templateName, variables) {
    const version = env.WHATSAPP_GRAPH_VERSION || "v23.0";
    const endpoint = `https://graph.facebook.com/${version}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: env.WHATSAPP_ALERT_RECIPIENT,
            type: "template",
            template: {
                name: templateName,
                language: { code: env.WHATSAPP_TEMPLATE_LANGUAGE },
                components: [{ type: "body", parameters: variables.map((text) => ({ type: "text", text })) }],
            },
        }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.messages?.[0]?.id)
        throw new Error(`WhatsApp send failed: ${data.error?.code || response.status} ${data.error?.message || ""}`.trim());
    return data.messages[0].id;
}
