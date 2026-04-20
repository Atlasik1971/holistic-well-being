import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { session, isAdmin, loading, roleLoading } = useAuth();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card-soft max-w-md text-center">
          <h2 className="font-serif text-2xl">Нет доступа</h2>
          <p className="mt-3 text-muted-foreground">
            Эта страница доступна только администратору.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAdmin;
