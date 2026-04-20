// Edge function: receives DB trigger payload and sends Telegram notification
const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Source = "booking" | "contact_message" | "chat_lead";

interface Payload {
  source: Source;
  record: Record<string, unknown>;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatMessage = (p: Payload): string => {
  const r = p.record as Record<string, string | null>;
  const safe = (v: string | null | undefined, fallback = "—") =>
    v ? escapeHtml(String(v)) : fallback;

  if (p.source === "booking") {
    return [
      "🆕 <b>Новая заявка на консультацию</b>",
      "",
      `<b>Имя:</b> ${safe(r.name)}`,
      `<b>Контакт:</b> ${safe(r.contact)}`,
      `<b>Формат:</b> ${safe(r.format)}`,
      `<b>Запрос:</b> ${safe(r.request)}`,
    ].join("\n");
  }
  if (p.source === "contact_message") {
    return [
      "✉️ <b>Новое сообщение из контактов</b>",
      "",
      `<b>Имя:</b> ${safe(r.name)}`,
      `<b>Контакт:</b> ${safe(r.contact)}`,
      `<b>Сообщение:</b> ${safe(r.message)}`,
    ].join("\n");
  }
  return [
    "💬 <b>Новый вопрос из чат-виджета</b>",
    "",
    `<b>Имя:</b> ${safe(r.name)}`,
    `<b>Контакт:</b> ${safe(r.contact)}`,
    `<b>Вопрос:</b> ${safe(r.message)}`,
  ].join("\n");
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const ADMIN_TELEGRAM_CHAT_ID = Deno.env.get("ADMIN_TELEGRAM_CHAT_ID");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!TELEGRAM_API_KEY)
      throw new Error("TELEGRAM_API_KEY is not configured");
    if (!ADMIN_TELEGRAM_CHAT_ID)
      throw new Error("ADMIN_TELEGRAM_CHAT_ID is not configured");

    const payload = (await req.json()) as Payload;
    if (
      !payload?.source ||
      !["booking", "contact_message", "chat_lead"].includes(payload.source)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing source" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const text = formatMessage(payload);

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ADMIN_TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Telegram API error", response.status, data);
      throw new Error(
        `Telegram API call failed [${response.status}]: ${JSON.stringify(data)}`,
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
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
