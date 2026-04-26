import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Seo from "@/components/seo/Seo";
import aboutImage from "@/assets/about-portrait.png";
import TiltedCard from "@/components/ui/TiltedCard";
import { Compass, HeartHandshake, BookOpen, Sprout, Dna, GraduationCap, Sparkles } from "lucide-react";

const principles = [
  {
    icon: Compass,
    title: "Этика и границы",
    text: "Чётко обозначаю зону компетенций нутрициолога и не выхожу за её рамки.",
  },
  {
    icon: HeartHandshake,
    title: "Системность",
    text: "Работаем не точечно, а через понятную последовательность шагов — от запроса к устойчивому результату.",
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
      <Seo
        title="Обо мне"
        description="Татьяна Мельникова — клинический нутрициолог. Спокойный, экспертный подход к питанию и образу жизни, без жёстких диет и универсальных схем."
      />
      <PageHero
        eyebrow="Обо мне"
        title="Спокойный, экспертный взгляд на питание и образ жизни"
        description="Клинический нутрициолог. Помогаю настроить питание и режим так, чтобы они были устойчивы в реальной жизни — без жёстких схем и обещаний."
      />

      <section className="container-wide">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0">
            <div className="rounded-3xl overflow-visible shadow-card p-1 sm:p-0">
              <TiltedCard
                imageSrc={aboutImage}
                altText="Татьяна Мельникова — клинический нутрициолог"
                captionText="Татьяна Мельникова"
                containerHeight="min(32rem, 80vw)"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip
                displayOverlayContent
                figureClassName="w-full"
                overlayContent={
                  <p className="tilted-card-demo-text">Клинический нутрициолог</p>
                }
              />
            </div>
          </div>
          <div className="lg:col-span-7 prose-soft">
            <div className="eyebrow mb-5">Подход</div>
            <h2 className="mb-6">Мой подход к работе</h2>
            <p>
              Я работаю в зоне образа жизни и пищевых привычек. Моя задача — помочь выстроить рацион
              и режим так, чтобы они поддерживали ваше самочувствие и встраивались в реальный
              распорядок дня.
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

      <Section className="mt-16 md:mt-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-5">Знакомство</div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                Меня зовут <span className="text-primary">Мельникова Татьяна</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Я — клинический нутрициолог с опытом, который складывался годами… а точнее, всей жизнью.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-serif text-2xl mb-6">Почему мне можно доверять?</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Dna,
                      title: "Генетика бросила мне вызов",
                      text: "Моя собственная история здоровья научила меня искать корни проблем, а не бороться с симптомами. Я знаю, каково это — искать ответы там, где их, кажется, нет.",
                      backTitle: "Что это даёт в работе",
                      backText:
                        "Глубокий разбор причин и бережный план изменений без давления и крайностей.",
                    },
                    {
                      icon: BookOpen,
                      title: "Жизнь как учебник",
                      text: "Через личные трудности, эксперименты и ошибки я поняла: питание — это не просто калории, а ключ к балансу тела и духа.",
                      backTitle: "Что это даёт в работе",
                      backText:
                        "Практичные рекомендации, которые реально встроить в вашу повседневность.",
                    },
                    {
                      icon: GraduationCap,
                      title: "Образование и аналитика",
                      text: "Дипломы (МАН Нутрициолог 2022, физмат ЕГПУ 2003 и множество курсов) дали базу, но именно умение анализировать сложные кейсы помогает находить решения там, где другие опускают руки.",
                      backTitle: "Что это даёт в работе",
                      backText:
                        "Структурный подход к сложным ситуациям и ясные шаги, понятные клиенту.",
                    },
                  ].map(({ icon: Icon, title, text, backTitle, backText }) => (
                    <div key={title} className="nutrition-flip-card max-w-none" tabIndex={0}>
                      <div className="nutrition-flip-card-inner">
                        <div className="nutrition-flip-card-front items-start text-left">
                          <div className="flex gap-4">
                            <div className="shrink-0">
                              <Icon className="accent-icon" />
                            </div>
                            <div>
                              <h4 className="nutrition-flip-card-title text-[1.2rem] font-medium">{title}</h4>
                              <p className="nutrition-flip-card-text mt-1.5">{text}</p>
                            </div>
                          </div>
                        </div>
                        <div className="nutrition-flip-card-back items-start text-left">
                          <p className="nutrition-flip-card-title text-[1.2rem]">{backTitle}</p>
                          <p className="nutrition-flip-card-text">{backText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="nutrition-flip-card max-w-none" tabIndex={0}>
              <div className="nutrition-flip-card-inner">
                <div className="nutrition-flip-card-front items-start text-left">
                  <div className="eyebrow mb-2">Моя миссия</div>
                  <p className="nutrition-flip-card-text">
                    Превращать ваши «не могу», «не получается» и «почему я?» в чёткие алгоритмы
                    действий. Я не верю в шаблоны — только в персонализированные стратегии,
                    основанные на науке, ваших особенностях и здравом смысле.
                  </p>
                </div>
                <div className="nutrition-flip-card-back items-start text-left">
                  <p className="nutrition-flip-card-title">Фокус сопровождения</p>
                  <p className="nutrition-flip-card-text">
                    Спокойный путь к устойчивым изменениям: меньше хаоса, больше ясности и опоры в
                    ежедневной рутине.
                  </p>
                </div>
              </div>
            </div>

            <div className="nutrition-flip-card max-w-none" tabIndex={0}>
              <div className="nutrition-flip-card-inner">
                <div className="nutrition-flip-card-front items-start text-left">
                  <div className="eyebrow mb-2">Если вы</div>
                  <ul className="space-y-3 text-muted-foreground leading-relaxed">
                    <li className="flex gap-3">
                      <span className="icon-dot" aria-hidden="true" />
                      <span>устали от диет-качелей и готовы к системному подходу,</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="icon-dot" aria-hidden="true" />
                      <span>имеете диагнозы, которые мешают жить,</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="icon-dot" aria-hidden="true" />
                      <span>хотите понять, как еда влияет на вашу энергию, гормоны или ДНК,</span>
                    </li>
                  </ul>
                </div>
                <div className="nutrition-flip-card-back items-start text-left">
                  <p className="nutrition-flip-card-title">В результате</p>
                  <p className="nutrition-flip-card-text">
                    Вы получите понятную стратегию питания и режима, которую можно поддерживать без
                    перегруза и жёстких ограничений.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto">
            <Sparkles className="accent-icon mx-auto mb-4" />
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground">
              Ваше здоровье — не головоломка. Это мозаика, и я знаю, как собрать её правильно.
            </p>
            <p className="mt-5 text-muted-foreground">
              Напишите мне или оставьте заявку — расскажите, с каким запросом вы идёте.
            </p>
            <div className="mt-7">
              <Button asChild variant="hero" size="lg">
                <Link to="/booking">Оставить заявку</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" className="mt-16 md:mt-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Принципы</div>
            <h2>Принципы работы</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-soft">
                <div className="flex items-start gap-4">
                  <Icon className="accent-icon" />
                  <div>
                    <h3 className="text-lg">{title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed text-[15px]">{text}</p>
                  </div>
                </div>
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
              Веду индивидуальные консультации и сопровождение по питанию и образу жизни. Работаю с
              привычками, режимом дня и адаптацией рекомендаций под ваш ритм, без жёстких схем и
              нереалистичных ограничений.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {/* TODO для клиента: уточните реальные цифры опыта (годы практики, кол-во клиентов). */}
            {[
              { k: "3+", v: "Года практики" },
              { k: "2", v: "Формата работы" },
              { k: "100+", v: "Консультаций и сопровождений" },
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
