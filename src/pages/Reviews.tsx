import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    name: "Имя клиента",
    role: "Формат: сопровождение",
    text: "Здесь будет ваш реальный отзыв. Раздел готов — карточки можно дополнять по мере появления откликов.",
  },
  {
    name: "Имя клиента",
    role: "Формат: разовая консультация",
    text: "Место под второй отзыв. Слайдер автоматически переключается между карточками.",
  },
  {
    name: "Имя клиента",
    role: "Формат: сопровождение",
    text: "Третий отзыв. Можно добавлять любое количество — структура сохраняется.",
  },
];

const Reviews = () => {
  const [i, setI] = useState(0);
  const total = reviews.length;
  const prev = () => setI((p) => (p - 1 + total) % total);
  const next = () => setI((p) => (p + 1) % total);

  return (
    <>
      <PageHero
        eyebrow="Отзывы"
        title="Что говорят клиенты"
        description="Раздел будет наполняться по мере появления отзывов."
      />

      {/* Slider */}
      <Section className="!pt-4">
        <div className="container-narrow">
          <div className="card-soft relative bg-primary-soft/30 border-primary/20 min-h-[260px] md:min-h-[280px]">
            <Quote className="absolute -top-3 left-6 md:left-8 h-8 w-8 text-primary bg-background rounded-full p-1.5 shadow-soft" />
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90 pt-2">
              «{reviews[i].text}»
            </p>
            <div className="mt-6 pt-6 border-t border-border/60">
              <div className="font-medium">{reviews[i].name}</div>
              <div className="text-sm text-muted-foreground">{reviews[i].role}</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Отзыв ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-8 bg-primary" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Предыдущий"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Следующий"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Все отзывы карточками */}
      <Section tone="muted">
        <div className="container-wide">
          <div className="eyebrow mb-5">Все отзывы</div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <div key={idx} className="card-soft">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-4 text-[15px] text-foreground/85 leading-relaxed">
                  «{r.text}»
                </p>
                <div className="mt-5 pt-5 border-t border-border/60">
                  <div className="font-medium text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="container-narrow text-center">
          <h2>Готовы попробовать?</h2>
          <p className="mt-4 text-muted-foreground">Запишитесь — обсудим ваш запрос.</p>
          <div className="mt-8">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">Записаться</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Reviews;
