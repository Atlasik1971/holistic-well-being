import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const schema = z.object({
  email: z.string().trim().email("Некорректный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(128),
});

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  useEffect(() => {
    if (!authLoading && session) {
      navigate(isAdmin ? from : "/", { replace: true });
    }
  }, [session, isAdmin, authLoading, from, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message);
      return;
    }
    toast.success("Вход выполнен");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-xl mb-8 text-foreground">
          Нутрициолог
        </Link>
        <div className="card-soft">
          <h1 className="font-serif text-2xl">Вход в админ-панель</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Доступ только для администратора сайта.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Войти"}
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:text-primary">← Вернуться на сайт</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
