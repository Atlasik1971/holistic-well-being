import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Loader2, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

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
    const demoPayload = {
      name: parsed.data.name,
      contact: parsed.data.contact,
      message: parsed.data.message,
    };
    void demoPayload;
    setSubmitting(false);
    e.currentTarget.reset();
    setErrors({});
    setSent(true);
    toast.success("Спасибо! Ваша заявка отправлена. Я свяжусь с вами в течение 1–2 рабочих дней.");
  };

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Связаться со мной"
        description="Для связи заполните форму — я отвечу в течение 1–2 рабочих дней."
      />

      <Section className="!pt-4">
        <div className="container-narrow">
          <div className="card-soft border-primary/20 bg-primary-soft/30">
            Для связи заполните форму — я отвечу в течение 1–2 рабочих дней.
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-narrow">
          <div className="eyebrow mb-4">Написать сообщение</div>
          {sent ? (
            <div className="card-soft text-center py-12">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Check className="accent-icon" />
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
