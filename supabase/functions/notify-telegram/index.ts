// Edge function: sends Telegram notifications via direct Bot API call.
// Supports DB trigger payloads (booking, contact_message, chat_lead) and
// direct website form submissions (website_form).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Source = "booking" | "contact_message" | "chat_lead" | "website_form";

interface Payload {
  source: Source;
  record?: Record<string, unknown>;
  // website_form fields
  name?: string;
  phone?: string;
  contact?: string;
  message?: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const safe = (v: unknown, fallback = "—") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s ? escapeHtml(s) : fallback;
};

const formatDate = () => {
  const d = new Date();
  return d.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatMessage = (p: Payload): string => {
  if (p.source === "website_form") {
    return [
      "🆕 <b>Новая заявка с сайта нутрициолога</b>",
      "",
      `<b>Имя:</b> ${safe(p.name)}`,
      `<b>Телефон:</b> ${safe(p.phone ?? p.contact)}`,
      `<b>Сообщение:</b> ${safe(p.message)}`,
      `<b>Дата:</b> ${escapeHtml(formatDate())}`,
    ].join("\n");
  }

  const r = (p.record ?? {}) as Record<string, unknown>;

  if (p.source === "booking") {
    return [
      "🆕 <b>Новая заявка на консультацию</b>",
      "",
      `<b>Имя:</b> ${safe(r.name)}`,
      `<b>Контакт:</b> ${safe(r.contact)}`,
      `<b>Формат:</b> ${safe(r.format)}`,
      `<b>Запрос:</b> ${safe(r.request)}`,
      `<b>Дата:</b> ${escapeHtml(formatDate())}`,
    ].join("\n");
  }
  if (p.source === "contact_message") {
    return [
      "✉️ <b>Новое сообщение из контактов</b>",
      "",
      `<b>Имя:</b> ${safe(r.name)}`,
      `<b>Контакт:</b> ${safe(r.contact)}`,
      `<b>Сообщение:</b> ${safe(r.message)}`,
      `<b>Дата:</b> ${escapeHtml(formatDate())}`,
    ].join("\n");
  }
  return [
    "💬 <b>Новый вопрос из чат-виджета</b>",
    "",
    `<b>Имя:</b> ${safe(r.name)}`,
    `<b>Контакт:</b> ${safe(r.contact)}`,
    `<b>Вопрос:</b> ${safe(r.message)}`,
    `<b>Дата:</b> ${escapeHtml(formatDate())}`,
  ].join("\n");
};

const validate = (p: Payload): string | null => {
  if (!p?.source) return "missing source";
  const allowed: Source[] = [
    "booking",
    "contact_message",
    "chat_lead",
    "website_form",
  ];
  if (!allowed.includes(p.source)) return "invalid source";

  if (p.source === "website_form") {
    const name = (p.name ?? "").trim();
    const phone = (p.phone ?? p.contact ?? "").trim();
    const message = (p.message ?? "").trim();
    if (name.length < 2 || name.length > 200) return "invalid name";
    if (phone.length < 3 || phone.length > 200) return "invalid phone";
    if (message.length > 4000) return "message too long";
  } else {
    if (!p.record || typeof p.record !== "object") return "missing record";
  }
  return null;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const ADMIN_TELEGRAM_CHAT_ID = Deno.env.get("ADMIN_TELEGRAM_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN)
      throw new Error("TELEGRAM_BOT_TOKEN is not configured");
    if (!ADMIN_TELEGRAM_CHAT_ID)
      throw new Error("ADMIN_TELEGRAM_CHAT_ID is not configured");

    const payload = (await req.json()) as Payload;
    const validationError = validate(payload);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const text = formatMessage(payload);

    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error("Telegram API error", response.status, data);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Telegram API [${response.status}]: ${data?.description ?? JSON.stringify(data)}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-telegram error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
