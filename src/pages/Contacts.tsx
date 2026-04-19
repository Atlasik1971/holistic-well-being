import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Send, MessageCircle, Phone, Mail, Clock, MapPin } from "lucide-react";

const channels = [
  {
    icon: Send,
    label: "Telegram",
    value: "@username",
    href: "https://t.me/",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+7 (000) 000-00-00",
    href: "https://wa.me/",
  },
  {
    icon: Phone,
    label: "Max",
    value: "@username",
    href: "#",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
];

const Contacts = () => {
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
