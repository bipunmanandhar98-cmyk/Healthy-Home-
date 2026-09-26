import { BrowserRouter, Routes, Route, ScrollToTop } from './router';
import { BookingProvider, TopBar, Navbar, Footer } from './components/chrome';
import PromoPopup from './components/PromoPopup';
import Home from './pages/Home';
import Services from './pages/Services';
import MainService from './pages/TreatmentDetail';
import SubService from './pages/SubService';
import Locations from './pages/Locations';
import Membership from './pages/Membership';
import Specials from './pages/Specials';
import About from './pages/About';
import WellnessHub from './pages/WellnessHub';
import WellnessStore from './pages/WellnessStore';
import { Navigate } from './router';
import Career from './pages/Career';
import Franchise from './pages/Franchise';

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <ScrollToTop />
        <TopBar />
        <Navbar />
        <main className="min-h-[60vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<MainService />} />
            <Route path="/services/:id/:subId" element={<SubService />} />
            {/* Legacy aliases so old /treatments links keep working */}
            <Route path="/treatments/:id" element={<MainService />} />
            <Route path="/treatments/:id/:subId" element={<SubService />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/specials" element={<Specials />} />
            <Route path="/about" element={<About />} />
            <Route path="/wellness-hub" element={<WellnessHub />} />
            <Route path="/wellness-store" element={<WellnessStore />} />
            {/* Old tool URLs now live inside the hub */}
            <Route path="/bmi-calculator" element={<Navigate to="/wellness-hub#bmi" replace />} />
            <Route path="/skin-quiz" element={<Navigate to="/wellness-hub#skin" replace />} />
            <Route path="/career" element={<Career />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <PromoPopup />
      </BookingProvider>
    </BrowserRouter>
  );
}