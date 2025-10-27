import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobListPage from './pages/jobs/JobListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import EmployerJobList from './pages/employer/EmployerJobList';
import EmployerApplications from './pages/employer/EmployerApplications';
import CandidateApplications from './pages/candidate/CandidateApplications';
import FavoritesPage from './pages/candidate/FavoritesPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            
            {/* Routes Employeur */}
            <Route path="/employer/jobs" element={<EmployerJobList />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            
            {/* Routes Candidat */}
            <Route path="/my-applications" element={<CandidateApplications />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            
            {/* Routes Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;