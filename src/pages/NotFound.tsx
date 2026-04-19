import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container-narrow text-center py-20">
        <div className="font-serif text-7xl md:text-8xl text-primary">404</div>
        <h1 className="mt-6 font-serif text-3xl">Страница не найдена</h1>
        <p className="mt-4 text-muted-foreground">
          Возможно, ссылка устарела или адрес введён с опечаткой.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/">На главную</Link>
          </Button>
          <Button asChild variant="quiet" size="lg">
            <Link to="/contacts">Контакты</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
