import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "soft" | "muted";
  id?: string;
}

const Section = ({ children, className, tone = "default", id }: SectionProps) => {
  const bg =
    tone === "soft"
      ? "bg-primary-soft/40"
      : tone === "muted"
        ? "bg-secondary/50"
        : "bg-background";
  return (
    <section id={id} className={cn("py-16 md:py-24", bg, className)}>
      {children}
    </section>
  );
};

export default Section;
