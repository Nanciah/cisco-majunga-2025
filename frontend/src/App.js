import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Accueil from './pages/Accueil';
import ListeEtablissements from './pages/ListeEtablissements';
import LoginEtablissement from './pages/LoginEtablissement';
import LoginAdmin from './pages/LoginAdmin';
import EspaceEtablissement from './pages/EspaceEtablissement';
import EspaceAdmin from './pages/EspaceAdmin';
import Contact from './pages/Contact'; // AJOUTE CET IMPORT

// Composants
import Navbar from './components/Navbar'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={logout} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/etablissements" element={<ListeEtablissements />} />
            <Route path="/contact" element={<Contact />} /> {/* AJOUTE CETTE ROUTE */}
            
            {/* Routes de connexion */}
            <Route 
              path="/login/etablissement" 
              element={
                user ? <Navigate to={user.type === 'etablissement' ? '/espace-etablissement' : '/admin'} /> 
                : <LoginEtablissement onLogin={login} />
              } 
            />
            
            <Route 
              path="/login/admin" 
              element={
                user ? <Navigate to={user.type === 'admin' ? '/admin' : '/espace-etablissement'} /> 
                : <LoginAdmin onLogin={login} />
              } 
            />
            
            {/* Espaces sécurisés */}
            <Route 
              path="/espace-etablissement" 
              element={
                user && user.type === 'etablissement' ? <EspaceEtablissement /> 
                : <Navigate to="/login/etablissement" />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                user && user.type === 'admin' ? <EspaceAdmin /> 
                : <Navigate to="/login/admin" />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;