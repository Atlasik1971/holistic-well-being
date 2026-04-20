-- Enable pg_net for async HTTP calls from triggers
create extension if not exists pg_net with schema extensions;

-- Function called by triggers: posts row to notify-telegram edge function
create or replace function public.notify_telegram_on_insert()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_source text;
  v_url text := 'https://uecxdegibdupepxwfwtk.supabase.co/functions/v1/notify-telegram';
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlY3hkZWdpYmR1cGVweHdmd3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTk2MTksImV4cCI6MjA5MjE5NTYxOX0.6QfR7NSKvWIsUQZYoqDMZRX_Gi_Soj4yjjgeSOJu2EI';
begin
  if TG_TABLE_NAME = 'bookings' then
    v_source := 'booking';
  elsif TG_TABLE_NAME = 'contact_messages' then
    v_source := 'contact_message';
  elsif TG_TABLE_NAME = 'chat_leads' then
    v_source := 'chat_lead';
  else
    return NEW;
  end if;

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'source', v_source,
      'record', to_jsonb(NEW)
    )
  );

  return NEW;
end;
$$;

-- Triggers on the three tables
drop trigger if exists trg_notify_telegram_bookings on public.bookings;
create trigger trg_notify_telegram_bookings
after insert on public.bookings
for each row execute function public.notify_telegram_on_insert();

drop trigger if exists trg_notify_telegram_contact_messages on public.contact_messages;
create trigger trg_notify_telegram_contact_messages
after insert on public.contact_messages
for each row execute function public.notify_telegram_on_insert();

drop trigger if exists trg_notify_telegram_chat_leads on public.chat_leads;
create trigger trg_notify_telegram_chat_leads
after insert on public.chat_leads
for each row execute function public.notify_telegram_on_insert();