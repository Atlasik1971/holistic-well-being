DROP TRIGGER IF EXISTS trg_notify_telegram_bookings ON public.bookings;
DROP TRIGGER IF EXISTS trg_notify_telegram_contact_messages ON public.contact_messages;
DROP TRIGGER IF EXISTS trg_notify_telegram_chat_leads ON public.chat_leads;
DROP FUNCTION IF EXISTS public.notify_telegram_on_insert();