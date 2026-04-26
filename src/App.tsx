import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import RequireAdmin from "@/components/auth/RequireAdmin";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Education from "./pages/Education";
import Reviews from "./pages/Reviews";
import Booking from "./pages/Booking";
import Contacts from "./pages/Contacts";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminChatLeads from "./pages/admin/AdminChatLeads";
import AdminServices from "./pages/admin/AdminServices";
import AdminReviews from "./pages/admin/AdminReviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** С base из Vite (например /holistic-well-being/) иначе GitHub Pages отдаёт 404-роуты вне корня. */
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={routerBasename}>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/education" element={<Education />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/privacy" element={<Privacy />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminBookings />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="chat-leads" element={<AdminChatLeads />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
