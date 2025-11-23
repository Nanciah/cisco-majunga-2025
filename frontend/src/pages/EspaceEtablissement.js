import React, { useState, useEffect } from 'react';
import { inscriptionService, examenService } from '../services/api';

const EspaceEtablissement = () => {
  const [activeTab, setActiveTab] = useState('inscription');
  const [examens, setExamens] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Récupérer les infos de l'établissement connecté
  const [user, setUser] = useState(null);
  const [etablissementInfo, setEtablissementInfo] = useState(null);

  // Données du formulaire d'inscription
  const [formData, setFormData] = useState({
    examen_id: '',
    eleves: [{ nom: '', prenom: '', date_naissance: '', lieu_naissance: '', classe: '' }]
  });

  useEffect(() => {
    // Récupérer l'utilisateur de manière sécurisée
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.type === 'etablissement') {
          setEtablissementInfo(parsedUser);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    }

    chargerExamens();
    if (activeTab === 'consultation') {
      chargerInscriptions();
    }
  }, [activeTab]);

  const chargerExamens = async () => {
    try {
      const response = await examenService.getExamens();
      setExamens(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des examens');
    }
  };

  const chargerInscriptions = async () => {
    try {
      setLoading(true);
      const response = await inscriptionService.getEtablissementInscriptions();
      setInscriptions(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleEleveChange = (index, field, value) => {
    const newEleves = [...formData.eleves];
    newEleves[index][field] = value;
    setFormData({ ...formData, eleves: newEleves });
  };

  const ajouterEleve = () => {
    setFormData({
      ...formData,
      eleves: [...formData.eleves, { nom: '', prenom: '', date_naissance: '', lieu_naissance: '', classe: '' }]
    });
  };

  const supprimerEleve = (index) => {
    if (formData.eleves.length > 1) {
      const newEleves = formData.eleves.filter((_, i) => i !== index);
      setFormData({ ...formData, eleves: newEleves });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.examen_id) {
      setMessage('Veuillez sélectionner un examen');
      return;
    }

    // Vérifier que tous les élèves ont au moins le nom et prénom
    const elevesValides = formData.eleves.filter(eleve => 
      eleve.nom.trim() && eleve.prenom.trim() && eleve.date_naissance
    );

    if (elevesValides.length === 0) {
      setMessage('Veuillez remplir au moins le nom, prénom et date de naissance pour un élève');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await inscriptionService.create({
        eleves: elevesValides,
        examen_id: formData.examen_id
      });

      setMessage(`✅ ${response.data.message}`);
      
      // Réinitialiser le formulaire
      setFormData({
        examen_id: '',
        eleves: [{ nom: '', prenom: '', date_naissance: '', lieu_naissance: '', classe: '' }]
      });

      // Recharger les inscriptions
      chargerInscriptions();
      
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`❌ ${error.response?.data?.error || 'Erreur lors de l\'inscription'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: 'badge-en_attente',
      accepte: 'badge-accepte',
      refuse: 'badge-refuse'
    };
    return <span className={`badge ${badges[statut]}`}>{statut.replace('_', ' ')}</span>;
  };

  return (
    <div className="espace-etablissement">
      <div className="page-header">
        <h1 className="page-title">🏫 Espace Établissement</h1>
        <p className="page-subtitle">Gestion des inscriptions aux examens</p>
      </div>

      {/* Informations de l'établissement connecté */}
      {etablissementInfo && (
        <div className="info-card">
          <div className="info-header">
            <div className="info-icon">🏫</div>
            <div>
              <h3>{etablissementInfo.nom}</h3>
              <p>Établissement connecté</p>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">📋 Code:</span>
              <span className="info-value">{etablissementInfo.code}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🏛️ Secteur:</span>
              <span className={`secteur-value ${etablissementInfo.secteur?.toLowerCase()}`}>
                {etablissementInfo.secteur}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">🎓 Niveau:</span>
              <span className="info-value">{etablissementInfo.niveau}</span>
            </div>
            {etablissementInfo.commune && (
              <div className="info-item">
                <span className="info-label">🏘️ Commune:</span>
                <span className="info-value">{etablissementInfo.commune}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="tabs-navigation">
        <button
          onClick={() => setActiveTab('inscription')}
          className={`tab-btn ${activeTab === 'inscription' ? 'active' : ''}`}
        >
          <span className="tab-icon">📝</span>
          Inscription des Élèves
        </button>
        <button
          onClick={() => setActiveTab('consultation')}
          className={`tab-btn ${activeTab === 'consultation' ? 'active' : ''}`}
        >
          <span className="tab-icon">👁️</span>
          Consultation des Inscriptions
        </button>
      </div>

      {/* Message de statut */}
      {message && (
        <div className={`message-banner ${message.includes('✅') ? 'success' : 'error'}`}>
          <div className="message-content">
            <span className="message-icon">{message.includes('✅') ? '✅' : '❌'}</span>
            {message.replace('✅ ', '').replace('❌ ', '')}
          </div>
        </div>
      )}

      {/* Onglet Inscription */}
      {activeTab === 'inscription' && (
        <div className="card">
          <div className="card-header">
            <h2>📝 Inscription des Élèves aux Examens</h2>
            <div className="card-subtitle">
              Ajoutez les élèves de votre établissement aux examens disponibles
            </div>
          </div>

          <form onSubmit={handleSubmit} className="inscription-form">
            <div className="form-section">
              <h3 className="section-title">🎯 Sélection de l'examen</h3>
              <div className="form-group">
                <label className="form-label">Examen *</label>
                <select
                  value={formData.examen_id}
                  onChange={(e) => setFormData({ ...formData, examen_id: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un examen</option>
                  {examens.map(examen => (
                    <option key={examen.id} value={examen.id}>
                      {examen.nom} - {examen.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">👥 Liste des Élèves</h3>
                <button
                  type="button"
                  onClick={ajouterEleve}
                  className="btn btn-outline"
                >
                  <span className="btn-icon">➕</span>
                  Ajouter un élève
                </button>
              </div>
              
              {formData.eleves.map((eleve, index) => (
                <div key={index} className="eleve-card">
                  <div className="eleve-header">
                    <h4>👦 Élève {index + 1}</h4>
                    {formData.eleves.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerEleve(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <span className="btn-icon">🗑️</span>
                        Supprimer
                      </button>
                    )}
                  </div>

                  <div className="eleve-form-grid">
                    <div className="form-group">
                      <label className="form-label">Nom *</label>
                      <input
                        type="text"
                        value={eleve.nom}
                        onChange={(e) => handleEleveChange(index, 'nom', e.target.value)}
                        className="form-input"
                        placeholder="Nom de famille"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Prénom *</label>
                      <input
                        type="text"
                        value={eleve.prenom}
                        onChange={(e) => handleEleveChange(index, 'prenom', e.target.value)}
                        className="form-input"
                        placeholder="Prénom"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date de naissance *</label>
                      <input
                        type="date"
                        value={eleve.date_naissance}
                        onChange={(e) => handleEleveChange(index, 'date_naissance', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lieu de naissance</label>
                      <input
                        type="text"
                        value={eleve.lieu_naissance}
                        onChange={(e) => handleEleveChange(index, 'lieu_naissance', e.target.value)}
                        className="form-input"
                        placeholder="Lieu de naissance"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Classe</label>
                      <input
                        type="text"
                        value={eleve.classe}
                        onChange={(e) => handleEleveChange(index, 'classe', e.target.value)}
                        className="form-input"
                        placeholder="Ex: CM2, 3ème, Terminale"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                <span className="btn-icon">
                  {loading ? '⏳' : '💾'}
                </span>
                {loading ? 'Enregistrement en cours...' : 'Enregistrer les inscriptions'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Onglet Consultation */}
      {activeTab === 'consultation' && (
        <div className="card">
          <div className="card-header">
            <h2>👁️ Consultation des Inscriptions</h2>
            <div className="card-subtitle">
              Consultez l'état des inscriptions de vos élèves
            </div>
          </div>
          
          <div className="table-actions">
            <button 
              onClick={chargerInscriptions} 
              className="btn btn-secondary"
              disabled={loading}
            >
              <span className="btn-icon">🔄</span>
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
            <div className="table-info">
              {inscriptions.length} inscription(s) trouvée(s)
            </div>
          </div>

          {inscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Aucune inscription trouvée</h3>
              <p>Les inscriptions apparaîtront ici une fois enregistrées</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Examen</th>
                    <th>Date Naissance</th>
                    <th>Statut</th>
                    <th>Salle</th>
                    <th>Centre</th>
                    <th>Date Inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map(inscription => (
                    <tr key={inscription.id}>
                      <td>
                        <div className="student-info">
                          <strong>{inscription.eleve_nom} {inscription.eleve_prenom}</strong>
                          <div className="student-details">
                            <span className="detail-item">N°: {inscription.numero_inscription}</span>
                          </div>
                        </div>
                      </td>
                      <td className="exam-name">{inscription.examen_nom}</td>
                      <td className="birth-date">
                        {new Date(inscription.date_naissance).toLocaleDateString('fr-FR')}
                      </td>
                      <td>{getStatutBadge(inscription.statut)}</td>
                      <td className="room-info">{inscription.salle_examen || '-'}</td>
                      <td className="center-info">{inscription.centre_examen || '-'}</td>
                      <td className="inscription-date">
                        {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        .espace-etablissement {
          padding: 2rem;
          max-width: 1200px;
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

        /* Carte d'information */
        .info-card {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3);
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-icon {
          font-size: 2.5rem;
        }

        .info-header h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .info-header p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .info-label {
          font-weight: 600;
          opacity: 0.9;
        }

        .info-value {
          font-weight: 500;
        }

        .secteur-value.public {
          color: #a8d8ff;
          font-weight: 600;
        }

        .secteur-value.privé {
          color: #90ee90;
          font-weight: 600;
        }

        /* Navigation par onglets */
        .tabs-navigation {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tab-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          box-shadow: 0 2px 8px rgba(30, 60, 114, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: #f8f9fa;
          color: #333;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        /* Message banner */
        .message-banner {
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid;
        }

        .message-banner.success {
          background: #d1edff;
          color: #0c5460;
          border-color: #b3e0ff;
        }

        .message-banner.error {
          background: #f8d7da;
          color: #721c24;
          border-color: #f1b0b7;
        }

        .message-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .message-icon {
          font-size: 1.2rem;
        }

        /* Cartes principales */
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid #e1e5e9;
        }

        .card-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1e3c72;
          font-size: 1.5rem;
        }

        .card-subtitle {
          color: #666;
          font-size: 0.95rem;
        }

        /* Formulaire */
        .inscription-form {
          padding: 0 2rem 2rem 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-title {
          color: #1e3c72;
          font-size: 1.25rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          background: white;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #1e3c72;
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        /* Carte élève */
        .eleve-card {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .eleve-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .eleve-header h4 {
          margin: 0;
          color: #1e3c72;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .eleve-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #1e3c72;
          border: 2px solid #1e3c72;
        }

        .btn-outline:hover:not(:disabled) {
          background: #1e3c72;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* Actions du formulaire */
        .form-actions {
          text-align: center;
          margin-top: 2rem;
        }

        /* Tableau */
        .table-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e1e5e9;
        }

        .table-info {
          color: #666;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
          padding: 0 2rem 2rem 2rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .data-table th {
          background: #1e3c72;
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #e1e5e9;
          vertical-align: top;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .student-info strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #333;
        }

        .student-details {
          font-size: 0.75rem;
          color: #666;
        }

        .exam-name, .birth-date, .room-info, .center-info, .inscription-date {
          color: #333;
          font-weight: 500;
        }

        /* Badges de statut */
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          display: inline-block;
        }

        .badge-en_attente {
          background: #fff3cd;
          color: #856404;
        }

        .badge-accepte {
          background: #d1edff;
          color: #0c5460;
        }

        .badge-refuse {
          background: #f8d7da;
          color: #721c24;
        }

        /* État vide */
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .espace-etablissement {
            padding: 1rem;
          }

          .tabs-navigation {
            flex-direction: column;
          }

          .eleve-form-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .table-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .card-header, .inscription-form {
            padding: 1rem;
          }

          .table-container {
            padding: 0 1rem 1rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EspaceEtablissement;