import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import aboutImage from "@/assets/about-desk.jpg";
import { Compass, HeartHandshake, BookOpen, Sprout } from "lucide-react";

const principles = [
  {
    icon: Compass,
    title: "Этика и границы",
    text: "Чётко обозначаю зону компетенций. Если запрос — медицинский, направляю к врачу.",
  },
  {
    icon: HeartHandshake,
    title: "В связке с врачом",
    text: "Сопровождение строится после консервативного лечения и согласовывается с лечащим специалистом.",
  },
  {
    icon: BookOpen,
    title: "Доказательный подход",
    text: "Опираюсь на современные источники и рекомендации, без модных диет и обещаний.",
  },
  {
    icon: Sprout,
    title: "Бережно и устойчиво",
    text: "Решения, которые встраиваются в жизнь — без давления, ярлыков и крайностей.",
  },
];

const About = () => {
  return (
    <>
      <PageHero
        eyebrow="Обо мне"
        title="Спокойный, экспертный взгляд на питание и образ жизни"
        description="Работаю как нутрициолог в формате консультационного сопровождения — рядом с врачами, после консервативного лечения. Помогаю настроить рацион и режим так, чтобы они были устойчивы в реальной жизни."
      />

      <section className="container-wide">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img
                src={aboutImage}
                alt="Открытый блокнот, ручка и чашка травяного напитка"
                width={1400}
                height={1200}
                loading="lazy"
                className="w-full h-auto object-cover aspect-[4/5]"
              />
            </div>
          </div>
          <div className="lg:col-span-7 prose-soft">
            <div className="eyebrow mb-5">Подход</div>
            <h2 className="mb-6">Не вместо врача, а рядом</h2>
            <p>
              Я работаю в зоне образа жизни и пищевых привычек. Не ставлю диагнозы и не назначаю лечение —
              этим занимаются врачи. Моя задача — помочь выстроить рацион и режим так, чтобы они
              поддерживали назначения, а не противоречили им.
            </p>
            <p>
              Каждое сопровождение начинается с подробной анкеты и обсуждения запроса. Я не обещаю
              быстрых решений и не работаю в логике «строгих диет». Уважаю ваш контекст — занятость,
              предпочтения, бюджет и привычки семьи.
            </p>
            <p>
              По необходимости даю рекомендации по рецептам в минимальном объёме — ровно столько,
              сколько нужно, чтобы вы могли спокойно собрать день.
            </p>
          </div>
        </div>
      </section>

      <Section tone="muted" className="mt-16 md:mt-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Принципы</div>
            <h2>Принципы работы</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-soft">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed text-[15px]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Опыт</div>
            <h2>Опыт и практика</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Раздел готов к наполнению — добавьте сюда годы практики, форматы работы, направления и
              ключевые цифры. Текст останется в этом блоке без изменения структуры.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { k: "—", v: "Лет практики" },
              { k: "—", v: "Форматов работы" },
              { k: "—", v: "Сопровождений" },
            ].map((s) => (
              <div key={s.v} className="card-soft text-center">
                <div className="font-serif text-4xl text-primary">{s.k}</div>
                <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="container-narrow text-center">
          <h2>Готовы обсудить запрос?</h2>
          <p className="mt-5 text-muted-foreground">Запишитесь — отвечу в течение 1–2 рабочих дней.</p>
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

export default About;
