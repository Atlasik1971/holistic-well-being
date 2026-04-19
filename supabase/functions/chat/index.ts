import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `Ты — вежливый, спокойный и краткий ассистент сайта частного нутрициолога.

ТВОЯ РОЛЬ:
- Отвечать на частые вопросы о специалисте, услугах и записи.
- Помогать выбрать формат и понятно объяснять, как записаться.
- Тон: экспертный, спокойный, тёплый, без давления и без эмодзи.
- Отвечай кратко (2–5 предложений). По возможности — структурировано (короткие списки).
- Отвечай только на русском языке.

ЧТО ТЫ ЗНАЕШЬ О СПЕЦИАЛИСТЕ:
- Это нутрициолог. Работает в формате консультационного сопровождения.
- Работа строится в связке с врачами и после консервативного лечения.
- Не заменяет медицинскую помощь.

ФОРМАТЫ УСЛУГ:
1) Разовая консультация — точечный разбор запроса: рацион, режим, бытовые рекомендации, краткое письменное резюме встречи.
2) Сопровождение — серия консультаций с регулярными встречами, корректировкой рациона и режима, поддержкой между встречами.
По необходимости — рекомендации по рецептам в минимальном объёме (входит в оба формата).

С КАКИМИ ТЕМАМИ РАБОТАЕТ:
- Питание при особенностях образа жизни и нагрузках.
- Поддержка после консервативного лечения, в связке с врачом.
- Работа с пищевыми привычками и режимом.
- Сопровождение в подборе бытовых и пищевых решений.
- Состояния, связанные с самочувствием и энергией.
- Поддержка в период восстановления и адаптации.

С ЧЕМ НЕ РАБОТАЕТ:
- Не ставит диагнозы и не отменяет назначения врачей.
- Не работает с заболеваниями — это компетенция врача.
- Не назначает лекарственные препараты.
- Не обещает медицинских результатов.

КАК ПРОХОДИТ ЗАПИСЬ:
1. Заявка через удобный мессенджер (Telegram, WhatsApp, Max) или через форму на странице «Запись».
2. Заполнение короткой анкеты — помогает подготовиться.
3. Согласование формата, даты и времени.
4. Встреча. Письменные рекомендации по итогам.
Время ответа на заявку: 1–2 рабочих дня.

КОНТАКТЫ:
- Все способы связи на странице «Контакты» (/contacts).
- Запись на консультацию — на странице «Запись» (/booking).
- Telegram, WhatsApp, Max — выбираются в форме записи.

ЖЁСТКИЕ ОГРАНИЧЕНИЯ (нельзя нарушать):
- Никогда не ставь диагнозы и не делай предположений о заболеваниях.
- Никогда не назначай и не отменяй лечение, препараты, добавки и дозировки.
- Никогда не давай медицинских обещаний и гарантий результата.
- Не интерпретируй анализы и симптомы.
- Если вопрос медицинский — мягко напомни, что чат не заменяет врача и что специалист работает с состояниями здоровья и образом жизни в рамках компетенций нутрициолога. Предложи обратиться к врачу и/или записаться на консультацию для обсуждения формата сопровождения.
- Если вопрос вне зоны темы (политика, юмор, не по делу) — вежливо верни разговор к теме сайта.

ЕСЛИ ПОЛЬЗОВАТЕЛЬ ХОЧЕТ ЗАПИСАТЬСЯ:
- Предложи перейти на /booking, кратко перечисли мессенджеры (Telegram, WhatsApp, Max).
- Можно предложить оставить имя и контакт прямо в чате — соответствующая форма доступна в интерфейсе чата (упомяни её одной фразой).

ФОРМАТ ОТВЕТОВ:
- Используй простой markdown (короткие списки, **жирное** для акцентов).
- Никогда не выдумывай факты о специалисте (цены, конкретные дипломы, годы опыта). Если не знаешь — скажи, что эту информацию уточнят при ответе на заявку.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Базовая валидация и ограничение контекста
    const trimmed = messages
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length <= 4000,
      )
      .slice(-20)
      .map((m: any) => ({ role: m.role, content: m.content }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте через минуту." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Закончились кредиты AI. Пополните баланс в настройках." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Ошибка AI-шлюза" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
