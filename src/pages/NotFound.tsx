import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: запрошен несуществующий маршрут:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo title="Страница не найдена" description="Возможно, ссылка устарела или адрес введён с опечаткой." />
      <section className="container-narrow text-center py-24 md:py-32">
        <div className="font-serif text-7xl md:text-8xl text-primary">404</div>
        <h1 className="mt-6 font-serif text-3xl">Страница не найдена</h1>
        <p className="mt-4 text-muted-foreground">
          Возможно, ссылка устарела или адрес введён с опечаткой.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/">На главную</Link>
          </Button>
          <Button
            asChild
            variant="quiet"
            size="lg"
            className="soft-button-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Link to="/contacts">Контакты</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default NotFound;
