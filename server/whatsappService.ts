interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
}

interface SendDocumentOptions {
  to: string;
  documentUrl: string;
  filename: string;
  caption?: string;
}

interface SendTextOptions {
  to: string;
  message: string;
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{ wa_id: string }>;
  messages: Array<{ id: string }>;
}

const API_BASE = "https://graph.facebook.com";

function getConfig(): WhatsAppConfig {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp credentials not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables.");
  }
  
  return {
    phoneNumberId,
    accessToken,
    apiVersion: "v21.0",
  };
}

function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/[\s\-\(\)]/g, "");
  
  if (!formatted.startsWith("+") && !formatted.startsWith("91")) {
    formatted = "91" + formatted;
  }
  
  if (formatted.startsWith("+")) {
    formatted = formatted.slice(1);
  }
  
  return formatted;
}

export async function sendWhatsAppDocument(options: SendDocumentOptions): Promise<WhatsAppResponse> {
  const config = getConfig();
  const formattedPhone = formatPhoneNumber(options.to);
  
  const url = `${API_BASE}/${config.apiVersion}/${config.phoneNumberId}/messages`;
  
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formattedPhone,
    type: "document",
    document: {
      link: options.documentUrl,
      caption: options.caption || "Your invoice from Expelight",
      filename: options.filename,
    },
  };
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("WhatsApp API Error:", errorData);
    throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
  }
  
  return response.json();
}

export async function sendWhatsAppText(options: SendTextOptions): Promise<WhatsAppResponse> {
  const config = getConfig();
  const formattedPhone = formatPhoneNumber(options.to);
  
  const url = `${API_BASE}/${config.apiVersion}/${config.phoneNumberId}/messages`;
  
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formattedPhone,
    type: "text",
    text: {
      preview_url: false,
      body: options.message,
    },
  };
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("WhatsApp API Error:", errorData);
    throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
  }
  
  return response.json();
}

export function isWhatsAppConfigured(): boolean {
  return !!(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);
}
