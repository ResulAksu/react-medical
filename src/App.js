import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DoctorDashboard from './pages/DoctorDashboard';
import Home from './pages/Home';
import Uploads from './pages/Uploads';
import PatientPortfolio from './pages/PatientPortfolio';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/patient/:id" element={<PatientPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
