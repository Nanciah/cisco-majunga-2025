import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-logo">
          <Link to="/" className="nav-link">CISCO</Link>
        </div>
        
        <div className="nav-links">
          {/* Liens publics */}
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Accueil
          </Link>
          
          <Link 
            to="/etablissements" 
            className={`nav-link ${location.pathname === '/etablissements' ? 'active' : ''}`}
          >
            🏫 Établissements
          </Link>

          {/* Lien Contact */}
          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            📞 Contact
          </Link>

          {/* Liens selon le type d'utilisateur */}
          {user ? (
            <>
              {user.type === 'etablissement' && (
                <Link 
                  to="/espace-etablissement" 
                  className={`nav-link ${location.pathname === '/espace-etablissement' ? 'active' : ''}`}
                >
                  📊 Mon Espace
                </Link>
              )}
              
              {user.type === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  ⚙️ Administration
                </Link>
              )}
              
              <span className="nav-user">
                👤 {user.nom || user.username}
              </span>
              
              <button onClick={onLogout} className="logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login/etablissement" 
                className={`nav-link ${location.pathname === '/login/etablissement' ? 'active' : ''}`}
              >
                🔐 Espace Établissement
              </Link>
              
              <Link 
                to="/login/admin" 
                className={`nav-link ${location.pathname === '/login/admin' ? 'active' : ''}`}
              >
                🔒 Administration
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;