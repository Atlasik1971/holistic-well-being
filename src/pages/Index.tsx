import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import { ArrowRight, Check, ShieldCheck, Sparkles, HeartHandshake, Leaf, Volume2, VolumeX } from "lucide-react";
import heroImage from "@/assets/hero-herbs.jpg";
import TextType from "@/components/TextType";

const topics = [
  "Энергия и стабильное самочувствие в течение дня",
  "Питание под ваш ритм жизни и нагрузки",
  "Работа с пищевыми привычками без давления",
  "Поддержка веса и комфортных отношений с едой",
  "Режим сна, восстановления и опор в рутине",
  "Сезонная адаптация и спокойный переход к новому рациону",
];

const formats = [
  {
    title: "Разовая консультация",
    text: "Точечный разбор запроса: рацион, режим, бытовые рекомендации и дальнейшие шаги.",
  },
  {
    title: "Сопровождение",
    text: "Системная работа на несколько встреч: разбираем рацион и режим, корректируем по ходу, держим контакт между сессиями.",
  },
];

const steps = [
  { n: "01", title: "Заявка", text: "Оставляете заявку через удобный мессенджер." },
  { n: "02", title: "Анкета", text: "Заполняете короткую анкету — это помогает подготовиться." },
  { n: "03", title: "Согласование", text: "Согласуем формат, дату и время встречи." },
  { n: "04", title: "Встреча", text: "Проводим консультацию. Вы получаете рекомендации в письменном виде." },
];

const whoFits = [
  "Если питание стало хаотичным",
  "Если хочется больше энергии",
  "Если не подходят жёсткие диеты",
  "Если нужна структура",
];

const outcomes = [
  "Разбор текущего рациона и режима",
  "Рекомендации по питанию и привычкам",
  "Первые шаги для самостоятельной работы",
  "Понимание подходящего формата работы",
  "Письменные рекомендации после встречи",
];

const Index = () => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoSrc = `${import.meta.env.BASE_URL}VID_20260116_191915_153.mp4`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-wide pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 animate-fade-up">
              <div className="eyebrow mb-6">Клинический нутрициолог</div>
              <TextType
                as="h1"
                className="max-w-2xl"
                text={["Питание, в котором вам спокойно — каждый день"]}
                typingSpeed={95}
                initialDelay={250}
                pauseDuration={2500}
                deletingSpeed={40}
                variableSpeedEnabled
                variableSpeedMin={85}
                variableSpeedMax={130}
                showCursor
                hideCursorWhileTyping
                cursorCharacter="|"
                cursorBlinkDuration={0.7}
                loop={false}
              />
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Помогаю выстроить рацион и режим под вашу жизнь, тело и задачи. Без жёстких диет
                и универсальных схем — только понятная система, которая работает в долгую.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/booking">
                    Записаться на консультацию <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="accent-icon" />
                  Персональный подход
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="accent-icon" />
                  Бережное сопровождение
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="accent-icon" />
                  Реалистичный результат
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-card">
                {videoFailed ? (
                  <img
                    src={heroImage}
                    alt="Свежие травы и керамическая чаша на льняной салфетке"
                    width={1600}
                    height={1200}
                    className="w-full h-auto object-cover aspect-video"
                  />
                ) : (
                  <>
                    <video
                      className="w-full h-auto object-cover aspect-video"
                      src={heroVideoSrc}
                      poster={heroImage}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      controls
                      preload="metadata"
                      onError={() => setVideoFailed(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsMuted((prev) => !prev)}
                      aria-label={isMuted ? "Включить звук" : "Выключить звук"}
                      className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-soft backdrop-blur hover:bg-background"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </>
                )}
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
              <h2>С какими запросами ко мне приходят</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Точные темы и формулировки уточняем на консультации — каждая ситуация
                рассматривается индивидуально, с учётом вашего ритма и контекста.
              </p>
            </div>
            <ul className="md:col-span-8 grid gap-3 sm:grid-cols-2">
              {topics.map((t) => (
                <li
                  key={t}
                  className="card-soft flex gap-3 items-start text-[15px] text-foreground/90"
                >
                  <span className="icon-dot" aria-hidden="true" />
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

      {/* КАК ПРОХОДИТ ЗАПИСЬ */}
      <Section tone="soft">
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
                <div className="flex items-start gap-4">
                  <span className="accent-icon inline-flex items-center justify-center text-sm font-semibold">
                    {s.n}
                  </span>
                  <h3 className="text-lg">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5">Кому подойдёт консультация</div>
            <p className="text-muted-foreground leading-relaxed">
              Консультация подойдёт тем, кто хочет наладить питание без жёстких диет, разобраться в
              привычках, режиме дня и самочувствии, а также получить понятный план действий, который
              можно встроить в обычную жизнь.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whoFits.map((item) => (
              <div key={item} className="card-soft">
                <div className="flex items-start gap-4">
                  <span className="icon-dot" aria-hidden="true" />
                  <h3 className="text-base">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="container-wide">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Результат консультации</div>
            <h2>Что вы получите после консультации</h2>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {outcomes.map((item) => (
              <li key={item} className="card-soft flex gap-3 items-start text-[15px] text-foreground/90">
                <Check className="accent-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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

      {/* ОТВЕТСТВЕННЫЙ ПОДХОД */}
      <Section>
        <div className="container-wide">
          <div className="card-soft border-primary/20 bg-primary-soft/30">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="shrink-0">
                <ShieldCheck className="accent-icon" />
              </div>
              <div>
                <h3 className="font-serif text-xl">Ответственный подход</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Я работаю в зоне питания и образа жизни — это компетенция нутрициолога.
                  Диагностикой и лечением заболеваний занимается врач. Если у вас есть
                  медицинский диагноз, рекомендации согласуются с лечащим специалистом и не
                  отменяют его назначений.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {[
                    "Не ставлю диагнозы и не назначаю лечение",
                    "Не отменяю назначения врача",
                    "Работаю как часть вашей общей заботы о здоровье",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2 text-foreground/85">
                      <span className="icon-dot" aria-hidden="true" />
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
          <h2>Начнём с разговора</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Расскажите о запросе — подберём формат, который подойдёт именно вам.
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
