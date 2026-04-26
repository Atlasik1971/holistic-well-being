import { useEffect } from "react";

/**
 * Вставляет JSON-LD блок в <head>. При размонтировании удаляет.
 * Несколько блоков идентифицируются через уникальный id.
 */
const JsonLd = ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  useEffect(() => {
    const elementId = `jsonld-${id}`;
    let el = document.head.querySelector<HTMLScriptElement>(`script#${elementId}`);
    if (!el) {
      el = document.createElement("script");
      el.id = elementId;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const existing = document.head.querySelector(`script#${elementId}`);
      if (existing) existing.remove();
    };
  }, [id, data]);

  return null;
};

export default JsonLd;
