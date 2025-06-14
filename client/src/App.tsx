import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import WebSeries from "./pages/WebSeries";
import TvShows from "./pages/TvShows";
import Upcoming from "./pages/Upcoming";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SeeMore from "./pages/SeeMore";
import MoreInfo from "./pages/MoreInfo";
import Player from "./pages/Player";
import UpcomingMoreInfo from "./components/UpcomingMoreInfo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Wave background overlay for entire app */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-dark-green/20 to-black opacity-50 wave-transition pointer-events-none" />

        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/web-series" element={<WebSeries />} />
              <Route path="/tv-shows" element={<TvShows />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/see-more" element={<SeeMore />} />
              <Route path="/more-info/:id" element={<MoreInfo />} />
              <Route path="/upcoming-more-info" element={<UpcomingMoreInfo />} />
              <Route path="/player/:id" element={<Player />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;