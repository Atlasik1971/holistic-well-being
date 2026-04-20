// Sends a notification to the admin's Telegram chat when a new
// booking / contact message / chat lead is created.
// Invoked by Postgres triggers via pg_net.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

type Payload = {
  type: "booking" | "contact_message" | "chat_lead";
  record: Record<string, unknown>;
};

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMessage({ type, record }: Payload): string {
  const r = record as Record<string, string | null | undefined>;
  if (type === "booking") {
    return [
      "🗓 <b>Новая заявка на консультацию</b>",
      `<b>Имя:</b> ${escapeHtml(r.name)}`,
      `<b>Контакт:</b> ${escapeHtml(r.contact)}`,
      r.format ? `<b>Формат:</b> ${escapeHtml(r.format)}` : "",
      r.request ? `\n<b>Запрос:</b>\n${escapeHtml(r.request)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  if (type === "contact_message") {
    return [
      "✉️ <b>Новое сообщение с сайта</b>",
      `<b>Имя:</b> ${escapeHtml(r.name)}`,
      `<b>Контакт:</b> ${escapeHtml(r.contact)}`,
      `\n<b>Сообщение:</b>\n${escapeHtml(r.message)}`,
    ].join("\n");
  }
  // chat_lead
  return [
    "💬 <b>Новый контакт из чата</b>",
    `<b>Имя:</b> ${escapeHtml(r.name)}`,
    `<b>Контакт:</b> ${escapeHtml(r.contact)}`,
    r.message ? `\n<b>Сообщение:</b>\n${escapeHtml(r.message)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const ADMIN_CHAT_ID = Deno.env.get("ADMIN_TELEGRAM_CHAT_ID");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");
    if (!ADMIN_CHAT_ID) throw new Error("ADMIN_TELEGRAM_CHAT_ID is not configured");

    const body = (await req.json()) as Payload;
    if (!body?.type || !body?.record) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = formatMessage(body);

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Telegram error", response.status, data);
      throw new Error(
        `Telegram API failed [${response.status}]: ${JSON.stringify(data)}`,
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("notify-telegram error:", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
