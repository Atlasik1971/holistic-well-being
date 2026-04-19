import { useState, useRef, useEffect, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, Loader2, ArrowRight, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  { label: "Услуги", prompt: "Расскажи о форматах услуг" },
  { label: "С чем работает специалист", prompt: "С какими темами работает специалист?" },
  { label: "Как проходит запись", prompt: "Как проходит запись на консультацию?" },
  { label: "Контакты", prompt: "Как со мной связаться?" },
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Здравствуйте! Я помогу разобраться в услугах и подскажу, как записаться. Выберите тему ниже или задайте вопрос.\n\n_Чат не заменяет консультацию врача._",
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  contact: z.string().trim().min(3, "Укажите контакт").max(120),
});

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, showContactForm]);

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsStreaming(true);

    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Слишком много запросов. Подождите немного и попробуйте снова.");
        } else if (resp.status === 402) {
          toast.error("Сервис временно недоступен. Напишите в мессенджер на странице «Контакты».");
        } else {
          toast.error("Не удалось получить ответ. Попробуйте ещё раз.");
        }
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
        return;
      }
      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let streamDone = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last !== WELCOME) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nlIdx);
          textBuffer = textBuffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error(err);
        toast.error("Ошибка соединения. Попробуйте ещё раз.");
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = contactSchema.safeParse({
      name: String(fd.get("name") || ""),
      contact: String(fd.get("contact") || ""),
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;
    const { error } = await supabase.from("chat_leads").insert({
      name: result.data.name,
      contact: result.data.contact,
      message: lastUserMessage,
    });
    if (error) {
      toast.error("Не удалось отправить. Попробуйте ещё раз.");
      return;
    }
    setContactSent(true);
    toast.success("Спасибо! Я свяжусь с вами в течение 1–2 рабочих дней.");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Спасибо, **${result.data.name}**! Заявка получена. Свяжусь с вами в течение 1–2 рабочих дней по контакту \`${result.data.contact}\`. Если хотите подготовиться — посмотрите страницу «Запись» с короткой анкетой.`,
      },
    ]);
  };

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        aria-label={open ? "Закрыть чат" : "Открыть чат"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-50 bottom-5 right-5 md:bottom-6 md:right-6",
          "inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-card",
          "transition-all duration-300 hover:bg-primary-deep hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Окно чата */}
      {open && (
        <div
          role="dialog"
          aria-label="Чат-помощник"
          className={cn(
            "fixed z-50 bg-card border border-border shadow-card overflow-hidden flex flex-col",
            "animate-fade-up",
            // Mobile: bottom sheet
            "inset-x-0 bottom-0 top-[10vh] rounded-t-2xl",
            // Desktop: floating panel
            "md:inset-auto md:bottom-24 md:right-6 md:top-auto md:w-[400px] md:h-[640px] md:max-h-[80vh] md:rounded-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-primary-soft/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-base leading-tight">Чат-помощник</div>
                <div className="text-xs text-muted-foreground">Ответы на частые вопросы</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-background/60 text-foreground/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-background">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose-chat">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="m-0 [&:not(:first-child)]:mt-2">{children}</p>,
                          ul: ({ children }) => <ul className="m-0 mt-2 pl-4 list-disc space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="m-0 mt-2 pl-4 list-decimal space-y-1">{children}</ol>,
                          a: ({ href, children }) => (
                            <a href={href} className="text-primary underline underline-offset-2">{children}</a>
                          ),
                          strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
                          em: ({ children }) => <em className="text-muted-foreground not-italic text-[13.5px]">{children}</em>,
                          code: ({ children }) => (
                            <code className="px-1 py-0.5 rounded bg-background/80 text-[13px]">{children}</code>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            ))}

            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Quick prompts — только в начале */}
            {messages.length === 1 && !isStreaming && (
              <div className="pt-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5 px-1">
                  Быстрые темы
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => send(q.prompt)}
                      className="text-left text-sm px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary-soft/40 transition-colors"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA + форма контакта */}
            {(messages.length > 1 || showContactForm) && (
              <div className="pt-2 space-y-3">
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">
                    Записаться сейчас
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      to="/booking"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-background hover:border-primary/40 hover:bg-primary-soft/40 transition-colors text-xs"
                    >
                      <Send className="h-4 w-4 text-primary" />
                      Telegram
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-background hover:border-primary/40 hover:bg-primary-soft/40 transition-colors text-xs"
                    >
                      <MessageSquare className="h-4 w-4 text-primary" />
                      WhatsApp
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-background hover:border-primary/40 hover:bg-primary-soft/40 transition-colors text-xs"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      Max
                    </Link>
                  </div>
                  <Link
                    to="/booking"
                    onClick={() => setOpen(false)}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs text-primary hover:text-primary-deep"
                  >
                    Перейти к форме записи <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {!contactSent ? (
                  showContactForm ? (
                    <form
                      onSubmit={onContactSubmit}
                      className="rounded-xl border border-border bg-card p-3 space-y-2.5"
                    >
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        Оставить контакт
                      </div>
                      <Input name="name" placeholder="Как к вам обращаться" maxLength={80} required />
                      <Input
                        name="contact"
                        placeholder="Telegram / WhatsApp / телефон / email"
                        maxLength={120}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" variant="hero" size="sm" className="flex-1">
                          Отправить
                        </Button>
                        <Button
                          type="button"
                          variant="quiet"
                          size="sm"
                          onClick={() => setShowContactForm(false)}
                        >
                          Отмена
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Нажимая «Отправить», вы соглашаетесь с{" "}
                        <Link to="/privacy" className="underline" onClick={() => setOpen(false)}>
                          политикой конфиденциальности
                        </Link>
                        .
                      </p>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full text-left text-sm px-4 py-3 rounded-xl border border-dashed border-primary/40 bg-primary-soft/20 text-foreground/85 hover:bg-primary-soft/40 transition-colors"
                    >
                      Оставить имя и контакт прямо здесь →
                    </button>
                  )
                ) : null}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="border-t border-border bg-card p-3 flex gap-2 items-end"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Напишите вопрос…"
              className="min-h-[44px] max-h-32 resize-none text-sm"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              disabled={isStreaming || !input.trim()}
              aria-label="Отправить"
            >
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>

          <div className="px-4 py-2 text-[11px] text-muted-foreground text-center bg-card border-t border-border/60">
            Чат не заменяет консультацию врача
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
