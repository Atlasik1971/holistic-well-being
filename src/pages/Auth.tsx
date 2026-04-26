import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-xl mb-8 text-foreground">
          Нутрициолог
        </Link>
        <div className="card-soft">
          <h1 className="font-serif text-2xl">Демо-версия сайта</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Закрытый раздел администратора отключен в финальной демонстрационной версии проекта.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6 w-full">
            <Link to="/">Вернуться на главную</Link>
          </Button>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:text-primary">← Вернуться на сайт</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
