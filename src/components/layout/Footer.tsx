import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Footer = () => {
  const year = new Date().getFullYear();
  const { isAdmin } = useAuth();
  const adminHref = isAdmin ? "/admin" : "/auth";
  return (
    <footer className="mt-24 md:mt-32 border-t border-border bg-secondary/40">
      <div className="container-wide py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl text-foreground">Нутрициолог</div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              Консультационное сопровождение по питанию и образу жизни — в связке с врачами,
              после консервативного лечения. Не заменяю медицинскую помощь.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-4">Разделы</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-foreground/80 hover:text-primary">Обо мне</Link></li>
              <li><Link to="/services" className="text-foreground/80 hover:text-primary">Услуги</Link></li>
              <li><Link to="/education" className="text-foreground/80 hover:text-primary">Образование</Link></li>
              <li><Link to="/reviews" className="text-foreground/80 hover:text-primary">Отзывы</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow mb-4">Связь</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/booking" className="text-foreground/80 hover:text-primary">Записаться на консультацию</Link></li>
              <li><Link to="/contacts" className="text-foreground/80 hover:text-primary">Контакты</Link></li>
              <li><Link to="/privacy" className="text-foreground/80 hover:text-primary">Политика конфиденциальности</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/70 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-muted-foreground">
          <div>© {year} Нутрициолог. Все права защищены.</div>
          <div className="max-w-2xl md:flex-1 md:text-right">
            Информация на сайте носит ознакомительный характер и не является медицинской рекомендацией.
            Работа с заболеваниями — компетенция врача.
          </div>
          <Link
            to={adminHref}
            className="text-muted-foreground/70 hover:text-primary transition-colors md:ml-6 self-start md:self-auto"
          >
            Вход для администратора
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
