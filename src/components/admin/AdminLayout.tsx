import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Inbox, MessageSquare, MessagesSquare, Wrench, Star, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", end: true, label: "Заявки", icon: Inbox },
  { to: "/admin/messages", label: "Сообщения", icon: MessageSquare },
  { to: "/admin/chat-leads", label: "Чат-лиды", icon: MessagesSquare },
  { to: "/admin/services", label: "Услуги", icon: Wrench },
  { to: "/admin/reviews", label: "Отзывы", icon: Star },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <Link to="/admin" className="px-6 py-5 border-b border-border">
          <div className="font-serif text-lg">Админ-панель</div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary-soft/60 text-primary-deep font-medium"
                    : "text-foreground/75 hover:bg-secondary",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Button asChild variant="quiet" size="sm" className="w-full justify-start">
            <Link to="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Открыть сайт
            </Link>
          </Button>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="font-serif text-base">Админ-панель</div>
          <Button onClick={handleSignOut} variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex overflow-x-auto px-2 pb-2 gap-1 no-scrollbar">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary-soft/60 text-primary-deep font-medium"
                    : "text-foreground/75 hover:bg-secondary",
                )
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 pt-28 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
