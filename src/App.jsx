import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DoctorDashboard from './pages/DoctorDashboard';
import Home from './pages/Home';
import Uploads from './pages/Uploads';
import PatientPortfolio from './pages/PatientPortfolio';
import ArchitectAssistant from './pages/ArchitectAssistant';
import { initializeLocalStorageIfEmpty } from "./data/storageService";

// Direkt beim Laden der App aufrufen
initializeLocalStorageIfEmpty();


function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/architect-assistant";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/dm" element={<Uploads />} />
        <Route path="/patient/:id" element={<PatientPortfolio />} />
        <Route path="/architect-assistant" element={<ArchitectAssistant />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
