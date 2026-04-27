import { useState, type PointerEvent } from "react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Seo from "@/components/seo/Seo";
import { GraduationCap, Award, BookOpen, ScrollText, Sparkles, Stethoscope } from "lucide-react";

const documents = [
  {
    id: 1,
    title: "Диплом о профессиональной переподготовке",
    org: "Программа по нутрициологии",
    year: "2022",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Сертификат по работе с пищевыми привычками",
    org: "Курс по поведенческим стратегиям",
    year: "2023",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Повышение квалификации по консультированию",
    org: "Практика персонального сопровождения",
    year: "2024",
    icon: Stethoscope,
  },
  {
    id: 4,
    title: "Сертификат по коммуникации с клиентами",
    org: "Консультативные навыки и этика",
    year: "2024",
    icon: ScrollText,
  },
  {
    id: 5,
    title: "Программа по рациону и режиму дня",
    org: "Современные подходы в нутрициологии",
    year: "2025",
    icon: Sparkles,
  },
  {
    id: 6,
    title: "Сертификат по системной работе с запросом",
    org: "Инструменты мягкого сопровождения",
    year: "2025",
    icon: Award,
  },
];

const Education = () => {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const isTouchLike = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const handleCardPointerDown = (id: number, e: PointerEvent<HTMLElement>) => {
    if (!isTouchLike()) return;
    if (activeCardId !== id) {
      e.preventDefault();
      setActiveCardId(id);
    }
  };

  return (
    <>
      <Seo
        title="Образование и документы"
        description="Дипломы, сертификаты и повышение квалификации клинического нутрициолога. Полные сканы документов могу выслать в переписке."
      />
      <PageHero
        eyebrow="Образование"
        title="Дипломы, сертификаты и документы"
        description="Подтверждение профессиональной подготовки и регулярного повышения квалификации. Полные сканы могу выслать в переписке по запросу."
      />

      <Section className="!pt-4">
        <div className="container-wide">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map(({ id, title, org, year, icon: Icon }) => (
              <figure
                key={id}
                className={`nutrition-flip-card max-w-none ${activeCardId === id ? "is-flipped" : ""}`}
                tabIndex={0}
                onMouseEnter={() => setActiveCardId(id)}
                onMouseLeave={() => setActiveCardId((prev) => (prev === id ? null : prev))}
                onPointerDown={(e) => handleCardPointerDown(id, e)}
              >
                <div className="nutrition-flip-card-inner">
                  <div className="nutrition-flip-card-front items-center text-center">
                    <Icon
                      className="text-primary"
                      style={{ width: 56, height: 56, padding: 0, background: "transparent" }}
                    />
                    <div className="font-serif text-3xl text-primary-deep">{year}</div>
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Документ № {id}
                    </div>
                    <p className="nutrition-flip-card-title font-serif text-[1.1rem]">{title}</p>
                  </div>
                  <div className="nutrition-flip-card-back items-start text-left">
                    <p className="nutrition-flip-card-title font-serif text-[1.1rem]">{title}</p>
                    <p className="nutrition-flip-card-text">{org}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/75">
                      Квалификация подтверждена
                    </p>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl">Документы доступны по запросу</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Полные сканы дипломов и сертификатов могу выслать в переписке — напишите в удобный мессенджер.
          </p>
        </div>
      </Section>
    </>
  );
};

export default Education;
