import { useState, useEffect, FormEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

const phoneRegex = /^[0-9+\-\s()]{5,30}$/;

const formSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя (минимум 2 символа)").max(80, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(5, "Укажите телефон")
    .max(30, "Телефон слишком длинный")
    .regex(phoneRegex, "Телефон может содержать только цифры, +, -, (), пробелы"),
  question: z
    .string()
    .trim()
    .min(5, "Опишите вопрос подробнее (минимум 5 символов)")
    .max(1000, "Вопрос слишком длинный (максимум 1000 символов)"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо согласие на обработку персональных данных" }),
  }),
});

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Полный сброс state виджета (поля, согласие, submitting).
  // Никакая история / черновики / success не сохраняются.
  const resetState = useCallback(() => {
    setName("");
    setPhone("");
    setQuestion("");
    setConsent(false);
    setSubmitting(false);
  }, []);

  // Любое закрытие чата — с очисткой state.
  const closeChat = useCallback(() => {
    setOpen(false);
    resetState();
  }, [resetState]);

  // Тоггл FAB: открытие — чисто, закрытие — со сбросом.
  const toggleChat = () => {
    if (open) {
      closeChat();
    } else {
      resetState();
      setOpen(true);
    }
  };

  // Закрытие по Escape — со сбросом.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  const canSubmit =
    !submitting &&
    name.trim().length >= 2 &&
    phone.trim().length >= 5 &&
    question.trim().length >= 5 &&
    consent;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse({ name, phone, question, consent });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    setSubmitting(true);

    const demoPayload = {
      name: result.data.name,
      phone: result.data.phone,
      message: result.data.question,
    };
    void demoPayload;

    toast.success("Спасибо за сообщение! Я получила ваш запрос и свяжусь с вами в ближайшее время.");
    // Автозакрытие чата с полным сбросом state.
    closeChat();
  };

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        aria-label={open ? "Закрыть чат" : "Открыть чат"}
        onClick={toggleChat}
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
          aria-label="Форма обратной связи"
          className={cn(
            "fixed z-50 bg-card border border-border shadow-card overflow-hidden flex flex-col",
            "animate-fade-up",
            "inset-x-0 bottom-0 top-[10vh] rounded-t-2xl",
            "md:inset-auto md:bottom-24 md:right-6 md:top-auto md:w-[400px] md:h-[640px] md:max-h-[80vh] md:rounded-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-primary-soft/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="inline-flex items-center justify-center shrink-0">
                <MessageCircle className="accent-icon" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-base leading-tight">Чат-помощник</div>
                <div className="text-xs text-muted-foreground">Оставьте вопрос — я отвечу</div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Закрыть чат"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70",
                "soft-button-highlight",
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Контент */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-background">
            {/* Приветствие */}
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-[14.5px] leading-relaxed bg-secondary text-foreground">
                <p className="m-0">
                  Здравствуйте! Расскажите, чем я могу помочь — оставьте контакт и опишите свой
                  вопрос, я отвечу в течение 1–2 рабочих дней.
                </p>
                <p className="m-0 mt-2 text-muted-foreground text-[13px]">
                  Чат не заменяет консультацию врача.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-3 space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="chat-name" className="text-xs font-medium text-foreground/80">
                  Имя
                </label>
                <Input
                  id="chat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  maxLength={80}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="chat-phone" className="text-xs font-medium text-foreground/80">
                  Телефон
                </label>
                <Input
                  id="chat-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={30}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="chat-question" className="text-xs font-medium text-foreground/80">
                  Ваш вопрос
                </label>
                <Textarea
                  id="chat-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Опишите вопрос, ответа на который вы не нашли на сайте"
                  maxLength={1000}
                  rows={4}
                  className="resize-none text-sm"
                  required
                />
                <div className="text-[11px] text-muted-foreground text-right">
                  {question.length}/1000
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                  aria-label="Согласие на обработку персональных данных"
                />
                <span className="text-[12px] text-muted-foreground leading-relaxed">
                  Согласен(на) на обработку персональных данных согласно{" "}
                  <Link
                    to="/privacy"
                    className="underline text-primary"
                    onClick={closeChat}
                  >
                    политике конфиденциальности
                  </Link>
                  .
                </span>
              </label>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={!canSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Отправка…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Отправить
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="px-4 py-2 text-[11px] text-muted-foreground text-center bg-card border-t border-border/60">
            Чат не заменяет консультацию врача
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
