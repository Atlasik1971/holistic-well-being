import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { toast } from "sonner";
import { z } from "zod";
import { MessageCircle, Send, Phone, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Channel = "telegram" | "whatsapp" | "max";

const channels: { id: Channel; label: string; icon: typeof Send; hint: string }[] = [
  { id: "telegram", label: "Telegram", icon: Send, hint: "Удобно, быстро" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, hint: "Привычный мессенджер" },
  { id: "max", label: "Max", icon: Phone, hint: "Российский мессенджер" },
];

const formSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80, "Слишком длинно"),
  contact: z.string().trim().min(3, "Укажите контакт").max(120, "Слишком длинно"),
  channel: z.enum(["telegram", "whatsapp", "max"], { required_error: "Выберите способ связи" }),
  format: z.enum(["one-time", "ongoing", "not-sure"], { required_error: "Выберите формат" }),
  request: z.string().trim().min(10, "Опишите запрос подробнее").max(2000, "Слишком длинно"),
  withDoctor: z.boolean(),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие" }) }),
});

const FORMAT_LABEL: Record<string, string> = {
  "one-time": "Разовая",
  "ongoing": "Сопровождение",
  "not-sure": "Не уверен(а)",
};

const Booking = () => {
  const [channel, setChannel] = useState<Channel | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      contact: String(fd.get("contact") || ""),
      channel: channel as Channel,
      format: String(fd.get("format") || ""),
      request: String(fd.get("request") || ""),
      withDoctor: fd.get("withDoctor") === "on",
      consent: fd.get("consent") === "on",
    };
    const result = formSchema.safeParse(raw);
    if (!result.success) {
      const fieldErr: Record<string, string> = {};
      result.error.issues.forEach((iss) => {
        fieldErr[String(iss.path[0])] = iss.message;
      });
      setErrors(fieldErr);
      toast.error("Пожалуйста, проверьте форму");
      return;
    }
    setErrors({});
    setSubmitting(true);
    const formatLabel = FORMAT_LABEL[result.data.format] ?? result.data.format;
    const channelLabel = channels.find((c) => c.id === result.data.channel)?.label ?? result.data.channel;
    const { error } = await supabase.from("bookings").insert({
      name: result.data.name,
      contact: `${channelLabel}: ${result.data.contact}`,
      format: formatLabel + (result.data.withDoctor ? " · в связке с врачом" : ""),
      request: result.data.request,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }
    setSubmitted(true);
    toast.success("Заявка отправлена. Я свяжусь с вами в течение 1–2 рабочих дней.");
  };

  return (
    <>
      <PageHero
        eyebrow="Запись"
        title="Запись на консультацию"
        description="Выберите удобный мессенджер и заполните анкету — это поможет мне подготовиться к встрече и ответить точнее."
      />

      <Section className="!pt-2">
        <div className="container-wide grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4 space-y-5">
            <div className="card-soft">
              <div className="eyebrow mb-3">Что дальше</div>
              <ol className="space-y-3 text-sm text-foreground/85">
                <li className="flex gap-3">
                  <span className="font-serif text-primary">1.</span>
                  Выбираете мессенджер и заполняете анкету ниже
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-primary">2.</span>
                  Я отвечаю в течение 1–2 рабочих дней
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-primary">3.</span>
                  Согласуем формат, дату и время
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-primary">4.</span>
                  Проводим встречу
                </li>
              </ol>
            </div>
            <div className="card-soft bg-primary-soft/30 border-primary/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Работаю в формате консультационного сопровождения, не заменяя врача. Подробнее —
                в <Link to="/privacy" className="text-primary hover:underline">политике конфиденциальности</Link>.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8">
            {submitted ? (
              <div className="card-soft text-center py-16">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-6 font-serif text-2xl">Спасибо, заявка получена</h2>
                <p className="mt-3 max-w-md mx-auto text-muted-foreground">
                  Я свяжусь с вами в выбранном мессенджере в течение 1–2 рабочих дней.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="card-soft space-y-8" noValidate>
                {/* Канал */}
                <div>
                  <Label className="text-base font-medium">Удобный мессенджер</Label>
                  <p className="mt-1 text-sm text-muted-foreground">Выберите один</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {channels.map(({ id, label, icon: Icon, hint }) => (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setChannel(id)}
                        className={`text-left rounded-xl border p-4 transition-all ${
                          channel === id
                            ? "border-primary bg-primary-soft/40 shadow-soft"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${channel === id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="mt-3 font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
                      </button>
                    ))}
                  </div>
                  {errors.channel && (
                    <p className="mt-2 text-sm text-destructive">{errors.channel}</p>
                  )}
                </div>

                {/* Анкета */}
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Как к вам обращаться</Label>
                      <Input id="name" name="name" maxLength={80} required className="mt-2" />
                      {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contact">Контакт в выбранном мессенджере</Label>
                      <Input
                        id="contact"
                        name="contact"
                        placeholder="@username или телефон"
                        maxLength={120}
                        required
                        className="mt-2"
                      />
                      {errors.contact && <p className="mt-1.5 text-sm text-destructive">{errors.contact}</p>}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Формат</Label>
                    <RadioGroup name="format" defaultValue="not-sure" className="mt-3 grid gap-2 sm:grid-cols-3">
                      {[
                        { v: "one-time", l: "Разовая" },
                        { v: "ongoing", l: "Сопровождение" },
                        { v: "not-sure", l: "Не уверен(а)" },
                      ].map((o) => (
                        <label
                          key={o.v}
                          className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 cursor-pointer hover:border-primary/40 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary-soft/40"
                        >
                          <RadioGroupItem value={o.v} id={`f-${o.v}`} />
                          <span className="text-sm">{o.l}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="request">Кратко о запросе</Label>
                    <Textarea
                      id="request"
                      name="request"
                      rows={5}
                      maxLength={2000}
                      required
                      placeholder="Что хотелось бы обсудить, есть ли назначения врача, что уже пробовали"
                      className="mt-2 resize-y"
                    />
                    {errors.request && <p className="mt-1.5 text-sm text-destructive">{errors.request}</p>}
                  </div>

                  <label className="flex items-start gap-3 rounded-xl bg-secondary/40 px-4 py-3 cursor-pointer">
                    <Checkbox name="withDoctor" id="withDoctor" className="mt-0.5" />
                    <span className="text-sm text-foreground/85">
                      Я работаю в связке с врачом и готов(а) обсудить совместный формат
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <Checkbox name="consent" id="consent" className="mt-0.5" required />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Согласен(на) с обработкой персональных данных и условиями{" "}
                      <Link to="/privacy" className="text-primary hover:underline">политики конфиденциальности</Link>
                    </span>
                  </label>
                  {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Отправить заявку"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Booking;
