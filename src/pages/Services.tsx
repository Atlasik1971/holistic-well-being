import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Check, Sparkles, ChefHat, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Service = {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("id, title, description, duration, price")
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Услуги"
        title="Понятные форматы работы"
        description="Выберите тот, что подходит вашей задаче. Если сомневаетесь — напишите, подскажу."
      />

      <Section className="!pt-4">
        <div className="container-wide">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="card-soft text-center py-12 text-muted-foreground">
              Услуги скоро появятся.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {services.map((s, idx) => (
                <div
                  key={s.id}
                  className={`card-soft flex flex-col ${
                    idx % 2 === 1 ? "bg-primary-soft/40 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="eyebrow">
                      Формат {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-3xl">{s.title}</h2>
                  {s.description && (
                    <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                      {s.description}
                    </p>
                  )}
                  {(s.duration || s.price) && (
                    <ul className="mt-7 space-y-3">
                      {s.duration && (
                        <li className="flex items-start gap-3 text-[15px] text-foreground/90">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <span>Длительность: {s.duration}</span>
                        </li>
                      )}
                      {s.price && (
                        <li className="flex items-start gap-3 text-[15px] text-foreground/90">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <span>Стоимость: {s.price}</span>
                        </li>
                      )}
                    </ul>
                  )}
                  <div className="mt-8 pt-6 border-t border-border/60">
                    <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                      <Link to="/booking">Записаться</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-wide grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-1">
            <ChefHat className="h-7 w-7 text-primary" />
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
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Разовую консультацию</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Сопровождение</li>
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
