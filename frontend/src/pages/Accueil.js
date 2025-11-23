import React from 'react';
import { Link } from 'react-router-dom';

const Accueil = () => {
  return (
    <div className="accueil">
      {/* Section Hero */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🎓</span>
              Système Éducatif
            </div>
            <h1 className="hero-title">
              Bienvenue sur 
              <span className="cisco-highlight"> CISCO</span>
            </h1>
            <p className="hero-subtitle">
              Plateforme Intégrée de Gestion Scolaire de la Circonscription
            </p>
            <p className="hero-description">
              CISCO révolutionne la gestion des établissements scolaires en offrant une solution 
              complète pour les inscriptions aux examens, la supervision administrative et 
              la coordination éducative.
            </p>
            
            <div className="hero-actions">
              <Link to="/etablissements" className="btn btn-primary btn-hero">
                <span className="btn-icon">🏫</span>
                Explorer les Établissements
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/login/etablissement" className="btn btn-secondary btn-hero">
                <span className="btn-icon">🔐</span>
                Espace Établissement
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Établissements</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Examens</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Numérisé</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">📊</div>
              <div className="card-text">Gestion</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🚀</div>
              <div className="card-text">Innovation</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">⭐</div>
              <div className="card-text">Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="features-section">
        <div className="section-header">
          <h2>Fonctionnalités Principales</h2>
          <p>Découvrez comment CISCO transforme la gestion éducative</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🏫</div>
            </div>
            <h3>Gestion des Établissements</h3>
            <p>Base de données complète de tous les établissements scolaires de la circonscription avec informations détaillées et mises à jour en temps réel.</p>
            <div className="feature-badge">Accès public</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">📝</div>
            </div>
            <h3>Inscriptions aux Examens</h3>
            <p>Plateforme sécurisée pour l'inscription en ligne des élèves aux examens nationaux (CEPE, BEPC, BAC) avec suivi en temps réel.</p>
            <div className="feature-badge">Établissements</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">👨‍💼</div>
            </div>
            <h3>Espace Administration</h3>
            <p>Panneau de contrôle complet pour la validation des inscriptions, l'affectation des centres et la supervision du processus examens.</p>
            <div className="feature-badge">Administrateurs</div>
          </div>
        </div>
      </section>

      {/* Section Examens */}
      <section className="exams-section">
        <div className="section-header">
          <h2>Examens Nationaux</h2>
          <p>Gérez l'ensemble des examens sur une seule plateforme</p>
        </div>
        
        <div className="exams-grid">
          <div className="exam-card exam-cepe">
            <div className="exam-header">
              <div className="exam-icon">👦</div>
              <div className="exam-level">Primaire</div>
            </div>
            <h3>CEPE</h3>
            <p className="exam-fullname">Certificat d'Études Primaires Élémentaires</p>
            <ul className="exam-features">
              <li>✓ Inscription en ligne</li>
              <li>✓ Suivi numérique</li>
              <li>✓ Validation automatique</li>
            </ul>
          </div>
          
          <div className="exam-card exam-bepc">
            <div className="exam-header">
              <div className="exam-icon">👨‍🎓</div>
              <div className="exam-level">Collège</div>
            </div>
            <h3>BEPC</h3>
            <p className="exam-fullname">Brevet d'Études du Premier Cycle</p>
            <ul className="exam-features">
              <li>✓ Gestion centralisée</li>
              <li>✓ Affectation des centres</li>
              <li>✓ Rapports détaillés</li>
            </ul>
          </div>
          
          <div className="exam-card exam-bac">
            <div className="exam-header">
              <div className="exam-icon">🎓</div>
              <div className="exam-level">Lycée</div>
            </div>
            <h3>BAC</h3>
            <p className="exam-fullname">Baccalauréat</p>
            <ul className="exam-features">
              <li>✓ Processus complet</li>
              <li>✓ Coordination multi-établissements</li>
              <li>✓ Analytics avancés</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Prêt à commencer ?</h2>
            <p>Rejoignez les établissements qui utilisent déjà CISCO pour moderniser leur gestion éducative</p>
          </div>
          <div className="cta-actions">
            <Link to="/login/etablissement" className="btn btn-primary btn-large">
              <span className="btn-icon">🚀</span>
              Accéder à mon espace
            </Link>
            <Link to="/etablissements" className="btn btn-outline btn-large">
              <span className="btn-icon">🔍</span>
              Découvrir les établissements
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .accueil {
          min-height: 100vh;
        }

        /* Section Hero */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .badge-icon {
          font-size: 1rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .cisco-highlight {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          opacity: 0.8;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn-hero {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #1a1a1a;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-arrow {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }

        .btn:hover .btn-arrow {
          transform: translateX(3px);
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .hero-visual {
          position: relative;
          height: 400px;
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 50%;
          right: 20%;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
        }

        .card-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .card-text {
          font-weight: 600;
          font-size: 0.9rem;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Sections générales */
        .features-section, .exams-section, .cta-section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #1e3c72;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #666;
          margin: 0;
        }

        /* Section Fonctionnalités */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }

        .feature-icon {
          font-size: 2rem;
        }

        .feature-card h3 {
          color: #1e3c72;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .feature-badge {
          display: inline-block;
          background: #e8f4fd;
          color: #1e3c72;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Section Examens */
        .exams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .exam-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
          transition: transform 0.3s ease;
        }

        .exam-card:hover {
          transform: translateY(-5px);
        }

        .exam-cepe {
          border-top: 4px solid #3498db;
        }

        .exam-bepc {
          border-top: 4px solid #e74c3c;
        }

        .exam-bac {
          border-top: 4px solid #2ecc71;
        }

        .exam-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .exam-icon {
          font-size: 2.5rem;
        }

        .exam-level {
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #666;
        }

        .exam-card h3 {
          color: #1e3c72;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .exam-fullname {
          color: #666;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .exam-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .exam-features li {
          padding: 0.5rem 0;
          color: #333;
          font-weight: 500;
        }

        /* Section CTA */
        .cta-section {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          border-radius: 20px;
          margin: 4rem auto;
        }

        .cta-card {
          text-align: center;
          padding: 4rem 2rem;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 1.25rem 2.5rem;
          font-size: 1.1rem;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .hero-background {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-visual {
            display: none;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            justify-content: center;
          }

          .features-grid, .exams-grid {
            grid-template-columns: 1fr;
          }

          .cta-actions {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .hero-section, .features-section, .exams-section {
            padding: 2rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-hero {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Accueil;