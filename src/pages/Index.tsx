import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import { ArrowRight, Check, X, ShieldCheck, Stethoscope } from "lucide-react";
import heroImage from "@/assets/hero-herbs.jpg";

const topics = [
  "Питание при особенностях образа жизни и нагрузках",
  "Поддержка после консервативного лечения, в связке с врачом",
  "Работа с пищевыми привычками и режимом",
  "Сопровождение в подборе бытовых и пищевых решений",
  "Состояния, связанные с самочувствием и энергией",
  "Поддержка в период восстановления и адаптации",
];

const formats = [
  {
    title: "Разовая консультация",
    text: "Точечный разбор запроса: рацион, режим, бытовые рекомендации и дальнейшие шаги.",
  },
  {
    title: "Сопровождение",
    text: "Системная работа в формате нескольких встреч с корректировками, обратной связью и поддержкой.",
  },
];

const notWorking = [
  "Не ставлю диагнозы и не отменяю назначения врачей",
  "Не работаю с заболеваниями — это компетенция врача",
  "Не назначаю лекарственные препараты",
  "Не обещаю медицинских результатов",
];

const steps = [
  { n: "01", title: "Заявка", text: "Оставляете заявку через удобный мессенджер." },
  { n: "02", title: "Анкета", text: "Заполняете короткую анкету — это помогает подготовиться." },
  { n: "03", title: "Согласование", text: "Согласуем формат, дату и время встречи." },
  { n: "04", title: "Встреча", text: "Проводим консультацию. Вы получаете рекомендации в письменном виде." },
];

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-wide pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 animate-fade-up">
              <div className="eyebrow mb-6">Консультационное сопровождение</div>
              <h1 className="max-w-2xl">
                Питание и образ жизни — спокойно, по делу и в связке с вашим врачом
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Помогаю выстроить устойчивый рацион и режим дня после консервативного лечения.
                Не заменяю медицинскую помощь — работаю рядом с врачами, а не вместо них.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/booking">
                    Записаться <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="quiet" size="xl">
                  <Link to="/services">Посмотреть услуги</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Этичный подход
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  Работа в связке с врачами
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-card">
                <img
                  src={heroImage}
                  alt="Свежие травы и керамическая чаша на льняной салфетке"
                  width={1600}
                  height={1200}
                  className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ТЕМЫ */}
      <Section tone="muted" id="topics">
        <div className="container-wide">
          <div className="grid gap-10 md:gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow mb-5">С чем работаю</div>
              <h2>С какими темами я работаю</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Точные темы и формулировки уточняем на консультации — каждая ситуация рассматривается
                индивидуально и в рамках компетенций нутрициолога.
              </p>
            </div>
            <ul className="md:col-span-8 grid gap-3 sm:grid-cols-2">
              {topics.map((t) => (
                <li
                  key={t}
                  className="card-soft flex gap-3 items-start text-[15px] text-foreground/90"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ФОРМАТЫ */}
      <Section>
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Форматы услуг</div>
            <h2>Два формата работы</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Выберите тот, что подходит вашей задаче — точечный разбор или системное сопровождение.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {formats.map((f) => (
              <div key={f.title} className="card-soft">
                <h3 className="font-serif text-2xl">{f.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.text}</p>
                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-deep"
                >
                  Подробнее <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* С ЧЕМ НЕ РАБОТАЮ */}
      <Section tone="soft">
        <div className="container-wide grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow mb-5">Границы</div>
            <h2>С чем я не работаю</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Чёткое понимание границ — часть профессионального подхода. Это бережно и для вас,
              и для совместной работы с врачом.
            </p>
          </div>
          <ul className="md:col-span-7 space-y-3">
            {notWorking.map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-xl bg-background/70 px-5 py-4 border border-border/60"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep" />
                <span className="text-[15px] text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* КАК ПРОХОДИТ ЗАПИСЬ */}
      <Section>
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Запись</div>
            <h2>Как проходит запись</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Простой и понятный путь от заявки до встречи — без лишней переписки.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="card-soft">
                <div className="font-serif text-2xl text-primary">{s.n}</div>
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* СКОЛЬКО ЖДАТЬ */}
      <Section tone="muted">
        <div className="container-wide grid gap-10 md:grid-cols-12 items-center">
          <div className="md:col-span-7">
            <div className="eyebrow mb-5">Сроки</div>
            <h2>Сколько ждать после заявки</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Отвечаю в течение 1–2 рабочих дней. Время до ближайшей свободной встречи зависит от
              текущей загрузки — сообщу его в ответе на заявку.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="card-soft text-center">
              <div className="font-serif text-5xl text-primary">1–2</div>
              <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                рабочих дня на ответ
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ЮРИДИЧЕСКИЙ БЛОК */}
      <Section>
        <div className="container-wide">
          <div className="card-soft border-primary/20 bg-primary-soft/30">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="shrink-0">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl">Этический и юридический ориентир</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Я не заменяю врача. Работаю с состояниями здоровья и образом жизни в рамках
                  компетенций нутрициолога. Лечением заболеваний занимаются врачи. Консультационное
                  сопровождение строится в связке с лечащим специалистом и после консервативного лечения.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {[
                    "Не ставлю диагнозы и не назначаю лечения",
                    "Не отменяю и не корректирую назначения врачей",
                    "Все рекомендации — в формате консультационного сопровождения",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2 text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="soft" className="!pb-24 md:!pb-32">
        <div className="container-narrow text-center">
          <h2>Готовы записаться?</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Оставьте заявку — обсудим запрос и подберём удобный формат.
          </p>
          <div className="mt-8">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">
                Записаться на консультацию <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Index;
