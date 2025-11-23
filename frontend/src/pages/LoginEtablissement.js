import React, { useState } from 'react';
import { etablissementService } from '../services/api';

const LoginEtablissement = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    login: '',
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
    
    if (!formData.login || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await etablissementService.login(formData);
      const { token, etablissement } = response.data;
      
      onLogin(
        { ...etablissement, type: 'etablissement' },
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
      <div className="login-container">
        {/* Section gauche - Illustration */}
        <div className="login-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">🏫</div>
            <h1>Espace Établissement</h1>
            <p>Connectez-vous pour gérer les inscriptions de vos élèves aux examens</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                Inscription des élèves
              </div>
              <div className="feature-item">
                <span className="feature-icon">👁️</span>
                Suivi des demandes
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                Gestion simplifiée
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h2>Connexion Établissement</h2>
              <p>Accédez à votre espace personnel</p>
            </div>

            {error && (
              <div className="error-banner">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <strong>Erreur de connexion</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Identifiant de l'établissement
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: etab_401011087"
                  disabled={loading}
                />
                <div className="input-hint">
                  Format: etab_CODE_ETABLISSEMENT
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔒</span>
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre mot de passe"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-login"
                disabled={loading}
              >
                <span className="btn-icon">
                  {loading ? '⏳' : '🚀'}
                </span>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            {/* Informations d'aide */}
            <div className="login-info">
              <div className="info-header">
                <span className="info-icon">💡</span>
                <h4>Informations de connexion</h4>
              </div>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Identifiant:</span>
                  <code>etab_CODE_ETABLISSEMENT</code>
                </div>
                <div className="info-item">
                  <span className="info-label">Mot de passe:</span>
                  <code>sisco2024</code>
                </div>
                <div className="info-example">
                  <strong>Exemple:</strong> etab_401011087 / sisco2024
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="support-section">
              <p>Besoin d'aide ? <a href="#" className="support-link">Contactez le support</a></p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          min-height: 700px;
        }

        /* Section illustration */
        .login-illustration {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-illustration::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
        }

        .illustration-content {
          text-align: center;
          z-index: 1;
          position: relative;
        }

        .illustration-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .illustration-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .illustration-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          font-size: 1.5rem;
          width: 40px;
          text-align: center;
        }

        /* Section formulaire */
        .login-form-section {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .login-header h2 {
          color: #1e3c72;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .login-header p {
          color: #666;
          margin: 0;
        }

        /* Bannière d'erreur */
        .error-banner {
          background: linear-gradient(135deg, #f8d7da, #f1b0b7);
          border: 1px solid #f5c6cb;
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .error-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .error-content {
          flex: 1;
        }

        .error-content strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #721c24;
        }

        .error-content p {
          margin: 0;
          color: #721c24;
          font-size: 0.9rem;
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
          color: #333;
          font-size: 0.95rem;
        }

        .label-icon {
          font-size: 1.1rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          outline: none;
          border-color: #1e3c72;
          background: white;
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
          transform: translateY(-1px);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-hint {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
          margin-left: 1.75rem;
        }

        /* Bouton de connexion */
        .btn-login {
          width: 100%;
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          margin-top: 1rem;
          transition: all 0.3s ease;
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

        .btn-primary {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 60, 114, 0.4);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        /* Informations de connexion */
        .login-info {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border: 1px solid #90caf9;
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
          color: #1565c0;
          font-size: 1rem;
        }

        .info-content {
          space-y: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .info-label {
          color: #333;
          font-weight: 500;
        }

        .info-item code {
          background: rgba(255, 255, 255, 0.7);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #1e3c72;
        }

        .info-example {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #90caf9;
          font-size: 0.9rem;
          color: #333;
        }

        /* Support */
        .support-section {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e1e5e9;
        }

        .support-section p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .support-link {
          color: #1e3c72;
          text-decoration: none;
          font-weight: 600;
        }

        .support-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .login-illustration {
            padding: 2rem;
            display: none; /* Cacher l'illustration sur mobile pour plus de simplicité */
          }

          .login-form-section {
            padding: 2rem;
          }

          .illustration-content h1 {
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

          .btn-login {
            padding: 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginEtablissement;