import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Send, MessageCircle, Phone, Mail, Clock, MapPin, Loader2, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { isSupabaseEnabled, supabase } from "@/integrations/supabase/client";

const channels = [
  { icon: Send, label: "Telegram", value: "@username", href: "https://t.me/" },
  { icon: MessageCircle, label: "WhatsApp", value: "+7 (000) 000-00-00", href: "https://wa.me/" },
  { icon: Phone, label: "Max", value: "@username", href: "#" },
  { icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  contact: z.string().trim().min(3, "Укажите контакт").max(120),
  message: z.string().trim().min(5, "Сообщение слишком короткое").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие" }) }),
});

const Contacts = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: String(fd.get("name") || ""),
      contact: String(fd.get("contact") || ""),
      message: String(fd.get("message") || ""),
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        fe[String(iss.path[0])] = iss.message;
      });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = isSupabaseEnabled
      ? await supabase.from("contact_messages").insert({
          name: parsed.data.name,
          contact: parsed.data.contact,
          message: parsed.data.message,
        })
      : { error: null };
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить. Попробуйте ещё раз.");
      return;
    }
    setSent(true);
    toast.success(
      isSupabaseEnabled
        ? "Сообщение отправлено"
        : "Демо-режим: форма проверена локально, отправка в базу отключена.",
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Как со мной связаться"
        description="Любой удобный мессенджер. Отвечаю в течение 1–2 рабочих дней."
      />

      <Section className="!pt-4">
        <div className="container-wide grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {channels.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-soft group flex items-start gap-4 hover:border-primary/40"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </div>
                    <div className="mt-1 font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-4">
            <div className="card-soft">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg">Время ответа</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Отвечаю в течение 1–2 рабочих дней. По выходным и праздникам — в первый рабочий день.
              </p>
            </div>
            <div className="card-soft">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg">Формат встреч</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Консультации проходят онлайн. Очный формат — по согласованию.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-narrow">
          <div className="eyebrow mb-4">Написать сообщение</div>
          {sent ? (
            <div className="card-soft text-center py-12">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-serif text-xl">Сообщение получено</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Я отвечу вам в течение 1–2 рабочих дней.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card-soft space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="c-name">Имя</Label>
                  <Input id="c-name" name="name" maxLength={80} required className="mt-2" />
                  {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="c-contact">Контакт для ответа</Label>
                  <Input
                    id="c-contact"
                    name="contact"
                    placeholder="Telegram / телефон / email"
                    maxLength={120}
                    required
                    className="mt-2"
                  />
                  {errors.contact && <p className="mt-1.5 text-sm text-destructive">{errors.contact}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="c-message">Сообщение</Label>
                <Textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  maxLength={2000}
                  required
                  className="mt-2 resize-y"
                />
                {errors.message && <p className="mt-1.5 text-sm text-destructive">{errors.message}</p>}
              </div>
              <label className="flex items-start gap-3">
                <Checkbox name="consent" id="c-consent" className="mt-0.5" required />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Согласен(на) с обработкой персональных данных и условиями{" "}
                  <Link to="/privacy" className="text-primary hover:underline">политики конфиденциальности</Link>
                </span>
              </label>
              {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
              <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Отправить"}
              </Button>
            </form>
          )}
        </div>
      </Section>

      <Section tone="soft">
        <div className="container-narrow text-center">
          <h2>Готовы записаться?</h2>
          <p className="mt-4 text-muted-foreground">
            Заполните короткую анкету — это удобный способ сразу обсудить запрос по делу.
          </p>
          <div className="mt-8">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">Записаться на консультацию</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Contacts;
