import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Sparkles, ChefHat } from "lucide-react";
import { services } from "@/data/services";

const Services = () => {
  return (
    <>
      <PageHero
        eyebrow="Услуги"
        title="Понятные форматы работы"
        description="Выберите тот, что подходит вашей задаче. Если сомневаетесь — напишите, подскажу."
      />

      <Section className="!pt-4">
        <div className="container-wide">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((s, idx) => (
              <div
                key={s.id}
                className={`card-soft flex flex-col ${
                  idx % 2 === 1 ? "bg-primary-soft/40 border-primary/20" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="accent-icon" />
                  <span className="eyebrow">
                    Формат {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-4 font-serif text-3xl">{s.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {s.description}
                </p>
                <ul className="mt-7 space-y-3">
                  <li className="flex items-start gap-3 text-[15px] text-foreground/90">
                    <span className="icon-dot" aria-hidden="true" />
                    <span>Длительность: {s.duration}</span>
                  </li>
                  <li className="flex items-start gap-3 text-[15px] text-foreground/90">
                    <span className="icon-dot" aria-hidden="true" />
                    <span>Стоимость: {s.price ?? "Стоимость уточняется индивидуально"}</span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-border/60">
                  <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                    <Link to="/booking">Записаться</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-wide grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-1">
            <ChefHat className="accent-icon" />
          </div>
          <div className="md:col-span-7">
            <div className="eyebrow mb-3">Дополнительно</div>
            <h2 className="font-serif text-2xl md:text-3xl">
              Рекомендации по рецептам в минимальном объёме
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              По необходимости даю простые ориентиры по сборке блюд и идеи рецептов — ровно столько,
              сколько нужно, чтобы спокойно собрать день. Это не отдельная услуга, а часть работы
              в рамках выбранного формата.
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="card-soft bg-background">
              <div className="text-sm text-muted-foreground">Включено в:</div>
              <ul className="mt-3 space-y-1.5 text-foreground/90">
                <li className="flex items-start gap-4"><span className="icon-dot" aria-hidden="true" /> Разовую консультацию</li>
                <li className="flex items-start gap-4"><span className="icon-dot" aria-hidden="true" /> Сопровождение</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-narrow">
          <div className="card-soft border-primary/20">
            <h3 className="font-serif text-xl">Важно понимать</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Услуги нутрициолога касаются питания и образа жизни. Диагностику и лечение
              заболеваний проводит врач — если у вас есть диагноз, мы это учитываем при работе.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Services;
