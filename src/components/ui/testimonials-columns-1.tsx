"use client";

import React from "react";
import { motion } from "motion/react";
import InitialsAvatar from "@/components/reviews/InitialsAvatar";

export type TestimonialItem = {
  text: string;
  name: string;
  role: string;
  /** Опционально: фото клиента. Если не указано — рендерим инициалы. */
  image?: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 12,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-7 rounded-3xl border border-border bg-card shadow-lg shadow-primary/10 max-w-xs w-full"
                key={`${name}-${i}-${index}`}
              >
                <div className="text-sm leading-relaxed text-foreground/90">«{text}»</div>
                <div className="flex items-center gap-3 mt-5">
                  {image ? (
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <InitialsAvatar name={name} />
                  )}
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 text-sm opacity-70 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
