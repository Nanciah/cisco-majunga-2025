import React, { useState } from 'react';
import { adminService } from '../services/api';

const LoginAdmin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminService.login(formData);
      const { token, admin } = response.data;
      
      onLogin(
        { ...admin, type: 'admin' },
        token
      );
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.response?.data?.error || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="admin-login-container">
        {/* Section sécurité */}
        <div className="security-section">
          <div className="security-content">
            <div className="security-icon">🛡️</div>
            <h1>Espace Administration</h1>
            <p>Accès sécurisé au panneau d'administration du système</p>
            
            <div className="security-features">
              <div className="security-item">
                <span className="feature-icon">🔐</span>
                <div>
                  <strong>Authentification sécurisée</strong>
                  <p>Accès restreint au personnel autorisé</p>
                </div>
              </div>
              
              <div className="security-item">
                <span className="feature-icon">📊</span>
                <div>
                  <strong>Gestion complète</strong>
                  <p>Supervision de tous les établissements</p>
                </div>
              </div>
              
              <div className="security-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <strong>Interface d'administration</strong>
                  <p>Outils de gestion avancés</p>
                </div>
              </div>
            </div>

            <div className="security-warning">
              <span className="warning-icon">⚠️</span>
              <p>Cet espace est réservé au personnel administratif autorisé</p>
            </div>
          </div>
        </div>

        {/* Section formulaire */}
        <div className="login-form-section">
          <div className="admin-login-card">
            <div className="login-header">
              <div className="admin-icon">👑</div>
              <h2>Connexion Administration</h2>
              <p>Accès au panneau de contrôle</p>
            </div>

            {error && (
              <div className="error-banner">
                <div className="error-icon">🚫</div>
                <div className="error-content">
                  <strong>Accès refusé</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Identifiant administrateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre identifiant administrateur"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔑</span>
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre mot de passe administrateur"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-admin-login"
                disabled={loading}
              >
                <span className="btn-icon">
                  {loading ? '⏳' : '🚀'}
                </span>
                {loading ? 'Authentification en cours...' : 'Accéder au panneau'}
                {!loading && <span className="btn-arrow">→</span>}
              </button>
            </form>

            {/* Informations d'accès */}
            <div className="access-info">
              <div className="info-header">
                <span className="info-icon">💡</span>
                <h4>Identifiants de test</h4>
              </div>
              <div className="credentials">
                <div className="credential-item">
                  <span className="credential-label">Utilisateur:</span>
                  <code className="credential-value">admin</code>
                </div>
                <div className="credential-item">
                  <span className="credential-label">Mot de passe:</span>
                  <code className="credential-value">admin123</code>
                </div>
              </div>
              <div className="access-note">
                <span className="note-icon">📝</span>
                Ces identifiants sont pour l'environnement de test uniquement
              </div>
            </div>

            {/* Sécurité */}
            <div className="security-notice">
              <div className="notice-content">
                <span className="notice-icon">🔒</span>
                <p>Votre session sera sécurisée et chiffrée</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .admin-login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          min-height: 750px;
        }

        /* Section sécurité */
        .security-section {
          background: linear-gradient(135deg, #1a2b3c 0%, #2c3e50 100%);
          color: white;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .security-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(41, 128, 185, 0.1) 0%, transparent 50%);
        }

        .security-content {
          text-align: center;
          z-index: 1;
          position: relative;
          max-width: 400px;
        }

        .security-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        .security-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #3498db, #2ecc71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .security-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .security-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .security-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }

        .feature-icon {
          font-size: 1.5rem;
          width: 40px;
          text-align: center;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .security-item strong {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }

        .security-item p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.4;
        }

        .security-warning {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .warning-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .security-warning p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Section formulaire */
        .login-form-section {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .admin-login-card {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .admin-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
          background: linear-gradient(135deg, #e74c3c, #e67e22);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .login-header h2 {
          color: #2c3e50;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .login-header p {
          color: #7f8c8d;
          margin: 0;
          font-size: 1rem;
        }

        /* Bannière d'erreur */
        .error-banner {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }

        .error-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .error-content {
          flex: 1;
        }

        .error-content strong {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }

        .error-content p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Formulaire */
        .login-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .label-icon {
          font-size: 1.1rem;
          opacity: 0.8;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #dcdfe3;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: #2c3e50;
        }

        .form-input:focus {
          outline: none;
          border-color: #3498db;
          background: white;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          transform: translateY(-1px);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f8f9fa;
        }

        /* Bouton de connexion */
        .btn-admin-login {
          width: 100%;
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn {
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-admin-login {
          background: linear-gradient(135deg, #e74c3c, #e67e22);
          color: white;
        }

        .btn-admin-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
        }

        .btn-admin-login::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-admin-login:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-arrow {
          font-size: 1.1rem;
          margin-left: auto;
          opacity: 0.8;
        }

        /* Informations d'accès */
        .access-info {
          background: linear-gradient(135deg, #34495e, #2c3e50);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .info-header h4 {
          margin: 0;
          color: #ecf0f1;
          font-size: 1rem;
        }

        .credentials {
          space-y: 0.75rem;
        }

        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .credential-label {
          color: #bdc3c7;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .credential-value {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.3);
          font-size: 0.9rem;
        }

        .access-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.8rem;
          color: #95a5a6;
        }

        .note-icon {
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        /* Avis de sécurité */
        .security-notice {
          background: #ecf0f1;
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          padding: 1rem;
        }

        .notice-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
        }

        .notice-icon {
          font-size: 1.1rem;
          color: #27ae60;
        }

        .notice-content p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .admin-login-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .security-section {
            padding: 2rem;
            display: none; /* Cacher sur mobile pour plus de simplicité */
          }

          .login-form-section {
            padding: 2rem;
          }

          .security-content h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 1rem;
          }

          .login-form-section {
            padding: 1.5rem;
          }

          .login-header h2 {
            font-size: 1.75rem;
          }

          .form-input {
            padding: 0.875rem 1rem;
          }

          .btn-admin-login {
            padding: 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginAdmin;