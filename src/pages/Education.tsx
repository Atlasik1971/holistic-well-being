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
              <figure key={id} className="card-soft p-6 flex flex-col">
                <div
                  className="relative rounded-xl overflow-hidden aspect-[4/5] flex flex-col items-center justify-center text-center px-6 py-8 border border-primary/15 bg-[radial-gradient(circle_at_top,_hsl(var(--primary-soft))_0%,_hsl(var(--card))_70%)]"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-3 rounded-lg border border-primary/20 pointer-events-none"
                  />
                  <Icon
                    className="text-primary"
                    style={{ width: 56, height: 56, padding: 0, background: "transparent" }}
                  />
                  <div className="mt-6 font-serif text-3xl text-primary-deep">{year}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Документ № {id}
                  </div>
                </div>
                <figcaption className="mt-5">
                  <div className="font-serif text-lg leading-tight">{title}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground">{org}</div>
                </figcaption>
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
