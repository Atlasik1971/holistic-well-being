import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1";

const Reviews = () => {
  const photos = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  ];
  const animatedTestimonials: TestimonialItem[] = reviews.map((r, idx) => ({
    text: r.text,
    image: photos[idx % photos.length],
    name: r.clientName,
    role: r.format,
  }));

  const firstColumn = animatedTestimonials;
  const secondColumn = [...animatedTestimonials.slice(1), animatedTestimonials[0]];
  const thirdColumn = [...animatedTestimonials.slice(2), ...animatedTestimonials.slice(0, 2)];

  return (
    <>
      <PageHero
        eyebrow="Отзывы"
        title="Что говорят клиенты"
        description="Впечатления о формате работы и изменениях в привычках питания."
      />

      <Section className="!pt-4">
        <div className="container-wide">
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] max-h-[640px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={18} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={20} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={16} />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-wide">
          <div className="eyebrow mb-5">Все отзывы</div>
          <p className="mb-6 text-sm text-muted-foreground">
            Отзывы размещены в демонстрационных целях для финального проекта. Реальные отзывы
            клиентов публикуются только с их согласия.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="card-soft">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-4 text-[15px] text-foreground/85 leading-relaxed">
                  «{r.text}»
                </p>
                <div className="mt-5 pt-5 border-t border-border/60">
                  <div className="font-medium text-sm">{r.clientName}</div>
                  <div className="text-xs text-muted-foreground">{r.format}</div>
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
