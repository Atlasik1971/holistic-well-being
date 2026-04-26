import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Seo from "@/components/seo/Seo";
import InitialsAvatar from "@/components/reviews/InitialsAvatar";
import { Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1";

const Reviews = () => {
  const animatedTestimonials: TestimonialItem[] = reviews.map((r) => ({
    text: r.text,
    name: r.clientName,
    role: r.format,
  }));

  const firstColumn = animatedTestimonials;
  const secondColumn = [...animatedTestimonials.slice(1), animatedTestimonials[0]];
  const thirdColumn = [...animatedTestimonials.slice(2), ...animatedTestimonials.slice(0, 2)];

  return (
    <>
      <Seo
        title="Отзывы"
        description="Что клиенты говорят о работе с нутрициологом: впечатления о формате, изменениях в питании и привычках."
      />
      <PageHero
        eyebrow="Отзывы"
        title="Что говорят клиенты"
        description="Впечатления о формате работы и изменениях в привычках питания. Все отзывы публикуются с согласия клиентов."
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="card-soft">
                <Quote className="accent-icon" />
                <p className="mt-4 text-[15px] text-foreground/85 leading-relaxed">
                  «{r.text}»
                </p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-3">
                  <InitialsAvatar name={r.clientName} size={36} />
                  <div>
                    <div className="font-medium text-sm">{r.clientName}</div>
                    <div className="text-xs text-muted-foreground">{r.format}</div>
                  </div>
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
