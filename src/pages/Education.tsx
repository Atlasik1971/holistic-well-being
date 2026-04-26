import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import diplomaImage from "@/assets/diploma-placeholder.jpg";
import { GraduationCap } from "lucide-react";

const documents = [
  { id: 1, title: "Диплом о профессиональной переподготовке", org: "Программа по нутрициологии", year: "2022" },
  { id: 2, title: "Сертификат по работе с пищевыми привычками", org: "Курс по поведенческим стратегиям", year: "2023" },
  { id: 3, title: "Повышение квалификации по консультированию", org: "Практика персонального сопровождения", year: "2024" },
  { id: 4, title: "Сертификат по коммуникации с клиентами", org: "Консультативные навыки и этика", year: "2024" },
  { id: 5, title: "Программа по рациону и режиму дня", org: "Современные подходы в нутрициологии", year: "2025" },
  { id: 6, title: "Сертификат по системной работе с запросом", org: "Инструменты мягкого сопровождения", year: "2025" },
];

const Education = () => {
  return (
    <>
      <PageHero
        eyebrow="Образование"
        title="Дипломы, сертификаты и документы"
        description="Подтверждение профессиональной подготовки и регулярного повышения квалификации."
      />

      <Section className="!pt-4">
        <div className="container-wide">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((d) => (
              <figure
                key={d.id}
                className="card-soft p-4 flex flex-col"
              >
                <div className="rounded-xl overflow-hidden bg-muted aspect-[4/5]">
                  <img
                    src={diplomaImage}
                    alt={`Документ: ${d.title}`}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-4 px-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {d.year}
                  </div>
                  <div className="mt-1.5 font-serif text-lg">{d.title}</div>
                  <div className="text-sm text-muted-foreground">{d.org}</div>
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
