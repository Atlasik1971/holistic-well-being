import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description?: string;
  ogImage?: string;
}

const SITE_NAME = "Нутрициолог";
const SITE_ORIGIN = "https://atlasik1971.github.io";

const upsertMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const Seo = ({ title, description, ogImage }: SeoProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        description,
      );
      upsertMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        description,
      );
    }

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    const canonical = `${SITE_ORIGIN}${baseUrl}${pathname === "/" ? "/" : pathname}`;
    upsertLink("canonical", canonical);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);

    if (ogImage) {
      const absolute = ogImage.startsWith("http")
        ? ogImage
        : `${SITE_ORIGIN}${baseUrl}/${ogImage.replace(/^\//, "")}`;
      upsertMeta('meta[property="og:image"]', "property", "og:image", absolute);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", absolute);
    }
  }, [title, description, ogImage, pathname]);

  return null;
};

export default Seo;
