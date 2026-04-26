import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";

// Главная грузится сразу — это первый экран.
// Остальные страницы — отдельными чанками, чтобы не раздувать первый загрузочный JS.
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Education = lazy(() => import("./pages/Education"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Booking = lazy(() => import("./pages/Booking"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/** С base из Vite (например /holistic-well-being/) иначе GitHub Pages отдаёт 404-роуты вне корня. */
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const RouteFallback = () => (
  <div className="container-narrow py-24 text-center text-muted-foreground" role="status" aria-live="polite">
    Загрузка…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={routerBasename}>
          <Suspense fallback={<RouteFallback />}>
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
                <Route path="/admin/*" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
