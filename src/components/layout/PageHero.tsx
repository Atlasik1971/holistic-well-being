import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

const PageHero = ({ eyebrow, title, description, align = "left", className }: PageHeroProps) => {
  return (
    <section className={cn("pt-12 md:pt-20 pb-10 md:pb-16", className)}>
      <div className={cn("container-wide", align === "center" && "text-center")}>
        {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
        <h1 className={cn("max-w-3xl", align === "center" && "mx-auto")}>{title}</h1>
        {description && (
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
