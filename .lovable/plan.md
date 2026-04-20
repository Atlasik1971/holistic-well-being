

## Что чиню в чат-виджете

Логика отправки уже корректная: форма пишет в `chat_leads`, сервер дублирует в Telegram. Токен на клиент не утекает — он живёт только в Edge Function. Дизайн модалки, скролл, footer и высота уже настроены правильно. Поэтому правки минимальные и без изменений UI.

## Что меняю

### 1. `src/components/chat/ChatWidget.tsx` — мелкие правки логики
- После успеха **очищать поля формы сразу** (а не только при клике «Отправить ещё один вопрос»), чтобы при повторном открытии форма была чистой.
- Добавить лёгкий fallback: если `supabase.from(...).insert(...)` упал — попробовать вызвать edge-функцию `notify-telegram` напрямую (`supabase.functions.invoke`) с `source: "website_form"`, чтобы заявка не пропала. Это не меняет дизайн — только надёжность.
- Никаких изменений в верстке, классах, высоте окна, скроллах, заголовке и подвале.

### 2. `supabase/functions/notify-telegram/index.ts` — поддержка `TELEGRAM_CHAT_ID`
Сейчас функция читает только `ADMIN_TELEGRAM_CHAT_ID`. Добавлю чтение в порядке:
```ts
const chatId = Deno.env.get("TELEGRAM_CHAT_ID") ?? Deno.env.get("ADMIN_TELEGRAM_CHAT_ID");
```
Так старый секрет продолжит работать, и новое имя из ТЗ тоже.

`TELEGRAM_BOT_TOKEN` уже используется как просили.

### 3. Что НЕ трогаю
- Дизайн модалки, высоту 640px / `max-h-[80vh]`, `flex flex-col`, `overflow-y-auto` контента, sticky-подвал «Чат не заменяет консультацию врача» — всё остаётся.
- Триггер БД `notify_telegram_on_insert` уже настроен на `chat_leads` и сам дёргает edge-функцию — менять не нужно.
- Админка `/admin/chat-leads` уже отображает заявки из `chat_leads` — менять не нужно.
- Клиент НЕ получает токен — он живёт в секретах Edge Function.

## Поток данных (после правок)

```text
Browser (ChatWidget)
   │  insert into chat_leads (RLS: anyone can insert)
   ▼
Supabase DB ── trigger ──► notify-telegram (Edge Function)
                                   │  fetch Telegram Bot API
                                   ▼
                        Telegram-группа админа
```

Если БД-вставка упала, клиент дополнительно зовёт `notify-telegram` напрямую с `source: "website_form"` — заявка всё равно дойдёт в Telegram.

## Файлы, которые покажу после применения
- `src/components/chat/ChatWidget.tsx`
- `supabase/functions/notify-telegram/index.ts`

## Что нужно от вас
Если хотите использовать имя секрета `TELEGRAM_CHAT_ID` (а не текущий `ADMIN_TELEGRAM_CHAT_ID`) — добавлю запрос секрета после одобрения. Если оставляем текущий — ничего делать не нужно, всё уже работает.

