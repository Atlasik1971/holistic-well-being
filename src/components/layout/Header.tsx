import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "Обо мне" },
  { to: "/services", label: "Услуги" },
  { to: "/education", label: "Образование" },
  { to: "/reviews", label: "Отзывы" },
  { to: "/contacts", label: "Контакты" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/0",
      )}
    >
      <div className="container-wide flex h-16 md:h-20 items-center justify-between">
        <Link
          to="/"
          className="font-serif text-lg md:text-xl tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          Нутрициолог
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="hero" size="default" className="rounded-full">
            <Link to="/booking">Записаться</Link>
          </Button>
        </div>

        <button
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <nav className="container-wide flex flex-col py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 text-base border-b border-border/60 last:border-b-0",
                    isActive ? "text-primary" : "text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button asChild variant="hero" size="lg" className="mt-5 self-start">
              <Link to="/booking" onClick={() => setOpen(false)}>
                Записаться
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
