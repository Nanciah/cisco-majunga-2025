import React, { useState, useEffect } from 'react';
import { etablissements as etablissementsData } from '../data/etablissements';

const ListeEtablissements = () => {
  const [etablissements, setEtablissements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    secteur: '',
    niveau: ''
  });

  // Fonction de recherche principale
  const effectuerRecherche = () => {
    let resultats = [...etablissementsData];

    // Filtre par recherche texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultats = resultats.filter(etab => 
        etab.nom.toLowerCase().includes(term) ||
        etab.code.toLowerCase().includes(term) ||
        etab.commune.toLowerCase().includes(term) ||
        (etab.fokontany && etab.fokontany.toLowerCase().includes(term)) ||
        (etab.zap && etab.zap.toLowerCase().includes(term)) ||
        (etab.village && etab.village.toLowerCase().includes(term))
      );
    }

    // Filtre par secteur
    if (filters.secteur) {
      resultats = resultats.filter(etab => etab.secteur === filters.secteur);
    }

    // Filtre par niveau
    if (filters.niveau) {
      resultats = resultats.filter(etab => etab.niveau === filters.niveau);
    }

    setEtablissements(resultats);
  };

  // Recherche automatique quand les filtres changent
  useEffect(() => {
    effectuerRecherche();
  }, [searchTerm, filters.secteur, filters.niveau]);

  // Initialisation
  useEffect(() => {
    setEtablissements(etablissementsData);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSecteurChange = (e) => {
    setFilters({ ...filters, secteur: e.target.value });
  };

  const handleNiveauChange = (e) => {
    setFilters({ ...filters, niveau: e.target.value });
  };

  const reinitialiserRecherche = () => {
    setSearchTerm('');
    setFilters({ secteur: '', niveau: '' });
  };

  return (
    <div className="liste-etablissements">
      <div className="page-header">
        <h1 className="page-title">📚 Liste des Établissements Scolaires</h1>
        <p className="page-subtitle">Gérez et recherchez les établissements de votre région</p>
      </div>
      
      {/* Bannière d'information */}
      <div className="info-banner">
        <div className="info-content">
          <div className="info-icon">ℹ️</div>
          <div>
            <strong>Base de données :</strong> {etablissementsData.length} établissements chargés
            <div className="info-stats">
              <span className="stat-item">🔍 {etablissements.length} résultat(s)</span>
              {etablissements.length !== etablissementsData.length && (
                <span className="stat-item">📊 Filtres actifs</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carte de filtres */}
      <div className="filters-card">
        <div className="card-header">
          <h3>🔍 Recherche et Filtres</h3>
          <button onClick={reinitialiserRecherche} className="btn btn-outline">
            <span className="btn-icon">🔄</span>
            Réinitialiser
          </button>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🔎</span>
              Recherche
            </label>
            <input
              type="text"
              placeholder="Nom, code, commune, fokontany, ZAP..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🏛️</span>
              Secteur
            </label>
            <select 
              value={filters.secteur} 
              onChange={handleSecteurChange}
              className="filter-select"
            >
              <option value="">Tous les secteurs</option>
              <option value="Public">Public</option>
              <option value="Privé">Privé</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎓</span>
              Niveau
            </label>
            <select 
              value={filters.niveau} 
              onChange={handleNiveauChange}
              className="filter-select"
            >
              <option value="">Tous les niveaux</option>
              <option value="Primaire">Primaire</option>
              <option value="Collège">Collège</option>
              <option value="Lycée">Lycée</option>
              <option value="Technique">Technique</option>
            </select>
          </div>
        </div>

        {/* Indicateurs de filtres actifs */}
        {(searchTerm || filters.secteur || filters.niveau) && (
          <div className="active-filters">
            <div className="filters-badge">
              <span className="badge-icon">⚡</span>
              Filtres actifs :
            </div>
            <div className="filters-tags">
              {searchTerm && (
                <span className="filter-tag">
                  🔎 "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="tag-remove"
                  >×</button>
                </span>
              )}
              {filters.secteur && (
                <span className="filter-tag">
                  🏛️ {filters.secteur}
                  <button 
                    onClick={() => setFilters({...filters, secteur: ''})}
                    className="tag-remove"
                  >×</button>
                </span>
              )}
              {filters.niveau && (
                <span className="filter-tag">
                  🎓 {filters.niveau}
                  <button 
                    onClick={() => setFilters({...filters, niveau: ''})}
                    className="tag-remove"
                  >×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Résumé des résultats */}
      <div className="results-summary">
        <div className="summary-card">
          <div className="summary-icon">📚</div>
          <div className="summary-content">
            <h3>{etablissements.length}</h3>
            <p>Établissement(s) trouvé(s)</p>
          </div>
        </div>
        {etablissements.length !== etablissementsData.length && (
          <div className="summary-card filtered">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h3>{etablissementsData.length - etablissements.length}</h3>
              <p>Masqué(s) par les filtres</p>
            </div>
          </div>
        )}
      </div>

      {/* Grille des établissements */}
      <div className="etablissements-grid">
        {etablissements.map((etab, index) => (
          <div key={index} className="etablissement-card">
            <div className="card-header">
              <h3 className="etab-name">{etab.nom}</h3>
              <div className="etab-badges">
                <span className={`secteur-badge ${etab.secteur.toLowerCase()}`}>
                  {etab.secteur === 'Public' ? '🏛️' : '🏢'} {etab.secteur}
                </span>
                <span className={`niveau-badge ${etab.niveau.toLowerCase()}`}>
                  {etab.niveau === 'Primaire' ? '👦' : 
                   etab.niveau === 'Collège' ? '👨‍🎓' : 
                   etab.niveau === 'Lycée' ? '🎓' : '🔧'} {etab.niveau}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">📋 Code:</span>
                <span className="info-value">{etab.code}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">🏘️ Commune:</span>
                <span className="info-value">{etab.commune}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">🗺️ ZAP:</span>
                <span className="info-value">{etab.zap}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">📍 Fokontany:</span>
                <span className="info-value">{etab.fokontany}</span>
              </div>
              
              {etab.village && (
                <div className="info-row">
                  <span className="info-label">🏡 Village:</span>
                  <span className="info-value">{etab.village}</span>
                </div>
              )}
              
              {etab.remarques && (
                <div className="info-row full-width">
                  <span className="info-label">💡 Remarques:</span>
                  <span className={`remarque ${getRemarqueClass(etab.remarques)}`}>
                    {etab.remarques}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {etablissements.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Aucun établissement trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou réinitialisez les filtres</p>
          <button onClick={reinitialiserRecherche} className="btn btn-primary">
            <span className="btn-icon">🔄</span>
            Réinitialiser la recherche
          </button>
        </div>
      )}

      <style>{`
        .liste-etablissements {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-title {
          color: #1e3c72;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        /* Bannière d'information */
        .info-banner {
          background: linear-gradient(135deg, #d1edff, #e3f2fd);
          border: 1px solid #b3e0ff;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .info-stats {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.7);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Carte de filtres */
        .filters-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          margin: 0;
          color: #1e3c72;
          font-size: 1.25rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        .search-input, .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        .search-input:focus, .filter-select:focus {
          outline: none;
          border-color: #1e3c72;
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
        }

        .search-input {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666' width='18' height='18'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 12px center;
          background-size: 18px;
          padding-left: 40px;
        }

        /* Filtres actifs */
        .active-filters {
          background: #e8f5e8;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .filters-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2d5016;
          margin-bottom: 0.5rem;
        }

        .filters-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #c3e6cb;
        }

        .tag-remove {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .tag-remove:hover {
          background: #f8f9fa;
          color: #333;
        }

        /* Résumé des résultats */
        .results-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 4px solid #1e3c72;
        }

        .summary-card.filtered {
          border-left-color: #6c757d;
        }

        .summary-icon {
          font-size: 2rem;
        }

        .summary-content h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1e3c72;
        }

        .summary-card.filtered .summary-content h3 {
          color: #6c757d;
        }

        .summary-content p {
          margin: 0.25rem 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        /* Grille des établissements */
        .etablissements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .etablissement-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e1e5e9;
        }

        .etablissement-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }

        .etablissement-card .card-header {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 1.5rem;
          border-bottom: 1px solid #e1e5e9;
          margin-bottom: 0;
        }

        .etab-name {
          margin: 0 0 1rem 0;
          color: #1e3c72;
          font-size: 1.25rem;
          line-height: 1.4;
        }

        .etab-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .secteur-badge, .niveau-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .secteur-badge.public {
          background: #d1edff;
          color: #0c5460;
        }

        .secteur-badge.privé {
          background: #d1f7e4;
          color: #0f5132;
        }

        .niveau-badge.primaire {
          background: #e7f3ff;
          color: #084298;
        }

        .niveau-badge.collège {
          background: #fff3cd;
          color: #856404;
        }

        .niveau-badge.lycée {
          background: #f8d7da;
          color: #721c24;
        }

        .niveau-badge.technique {
          background: #e2e3ff;
          color: #383d81;
        }

        .card-body {
          padding: 1.5rem;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .info-row.full-width {
          flex-direction: column;
          align-items: flex-start;
        }

        .info-label {
          font-weight: 600;
          color: #333;
          min-width: 100px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .info-value {
          color: #666;
          flex: 1;
        }

        .remarque {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Boutons */
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border: 2px solid #6c757d;
        }

        .btn-outline:hover {
          background: #6c757d;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* État vide */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        /* Fonction utilitaire pour les remarques */
        ${getRemarqueStyles()}

        /* Responsive */
        @media (max-width: 768px) {
          .liste-etablissements {
            padding: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .etablissements-grid {
            grid-template-columns: 1fr;
          }

          .results-summary {
            grid-template-columns: 1fr;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .etab-badges {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Fonction utilitaire pour les classes de remarques
function getRemarqueClass(remarque) {
  if (remarque.includes('Nouveau')) return 'nouveau';
  if (remarque.includes('FONCTIONNEL')) return 'fonctionnel';
  if (remarque.includes('ROUVERT')) return 'rouvert';
  if (remarque.includes('NON AFFILIÉ')) return 'non-affilie';
  return 'default';
}

// Fonction pour les styles des remarques
function getRemarqueStyles() {
  return `
    .remarque.nouveau {
      background: #f8d7da;
      color: #721c24;
    }
    .remarque.fonctionnel {
      background: #d1f7e4;
      color: #0f5132;
    }
    .remarque.rouvert {
      background: #d1edff;
      color: #0c5460;
    }
    .remarque.non-affilie {
      background: #e2e3e5;
      color: #383d41;
    }
    .remarque.default {
      background: #fff3cd;
      color: #856404;
    }
  `;
}

export default ListeEtablissements;