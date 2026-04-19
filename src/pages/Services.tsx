import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Check, Sparkles, ChefHat } from "lucide-react";

const oneTime = [
  "Подробный разбор анкеты и текущей ситуации",
  "Обсуждение запроса и реалистичных целей",
  "Рекомендации по рациону и режиму",
  "Ориентиры по бытовым привычкам и образу жизни",
  "Краткое письменное резюме встречи",
  "Ответы на вопросы в течение оговорённого времени после консультации",
];

const ongoing = [
  "Серия консультаций с регулярными встречами",
  "Постепенная корректировка рациона и режима",
  "Поддержка между встречами в согласованном формате",
  "Учёт ваших ощущений, ритма и обратной связи",
  "Совместная работа с лечащим врачом — по необходимости",
  "Письменные рекомендации по итогам каждого этапа",
];

const Services = () => {
  return (
    <>
      <PageHero
        eyebrow="Услуги"
        title="Два понятных формата работы"
        description="Выберите тот, что подходит вашей задаче. Если сомневаетесь — напишите, подскажу."
      />

      <Section className="!pt-4">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          {/* РАЗОВАЯ */}
          <div className="card-soft flex flex-col">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="eyebrow">Формат 01</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl">Разовая консультация</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Точечный разбор одной задачи. Подходит, когда нужно понять направление и получить
              опору для самостоятельной работы.
            </p>
            <ul className="mt-7 space-y-3">
              {oneTime.map((x) => (
                <li key={x} className="flex items-start gap-3 text-[15px] text-foreground/90">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                <Link to="/booking">Записаться на консультацию</Link>
              </Button>
            </div>
          </div>

          {/* СОПРОВОЖДЕНИЕ */}
          <div className="card-soft flex flex-col bg-primary-soft/40 border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="eyebrow">Формат 02</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl">Сопровождение</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Системная работа на нескольких встречах. Подходит, когда задача требует постепенной
              перестройки и поддержки на пути.
            </p>
            <ul className="mt-7 space-y-3">
              {ongoing.map((x) => (
                <li key={x} className="flex items-start gap-3 text-[15px] text-foreground/90">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                <Link to="/booking">Обсудить сопровождение</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ДОПОЛНИТЕЛЬНО — РЕЦЕПТЫ */}
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

      {/* ЮРИДИЧЕСКОЕ */}
      <Section>
        <div className="container-narrow">
          <div className="card-soft border-primary/20">
            <h3 className="font-serif text-xl">Важно понимать</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Услуги нутрициолога не заменяют медицинскую помощь. Я работаю с состояниями здоровья и
              образом жизни — заболевания лечит врач. Сопровождение строится в связке с лечащим
              специалистом и после консервативного лечения.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Services;
