import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const EspaceAdmin = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    statut: ''
  });
  
  // État pour la modale
  const [showModal, setShowModal] = useState(false);
  const [currentInscription, setCurrentInscription] = useState(null);
  const [modalData, setModalData] = useState({
    salle_examen: '',
    centre_examen: ''
  });

  // État pour la modale de confirmation de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inscriptionToDelete, setInscriptionToDelete] = useState(null);

  useEffect(() => {
    chargerInscriptions();
    chargerStats();
  }, [filters]);

  const chargerInscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getInscriptions(filters);
      setInscriptions(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  const chargerStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Ouvrir la modale pour remplir salle et centre
  const ouvrirModal = (inscription, statut) => {
    setCurrentInscription({ ...inscription, nouveauStatut: statut });
    setModalData({
      salle_examen: inscription.salle_examen || '',
      centre_examen: inscription.centre_examen || ''
    });
    setShowModal(true);
  };

  // Fermer la modale
  const fermerModal = () => {
    setShowModal(false);
    setCurrentInscription(null);
    setModalData({ salle_examen: '', centre_examen: '' });
  };

  // Mettre à jour l'inscription après validation de la modale
  const validerModal = async () => {
    if (!modalData.salle_examen || !modalData.centre_examen) {
      alert('Veuillez remplir la salle et le centre d\'examen');
      return;
    }

    try {
      await adminService.updateInscription(currentInscription.id, {
        statut: currentInscription.nouveauStatut,
        salle_examen: modalData.salle_examen,
        centre_examen: modalData.centre_examen
      });
      
      alert('Inscription mise à jour avec succès');
      fermerModal();
      chargerInscriptions();
      chargerStats();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Ouvrir la modale de confirmation de suppression
  const ouvrirDeleteModal = (inscription) => {
    setInscriptionToDelete(inscription);
    setShowDeleteModal(true);
  };

  // Fermer la modale de suppression
  const fermerDeleteModal = () => {
    setShowDeleteModal(false);
    setInscriptionToDelete(null);
  };

  // Supprimer l'inscription - Version corrigée
  const supprimerInscription = async () => {
    if (!inscriptionToDelete) return;

    try {
      // Essayer d'abord la suppression via update avec statut "refuse"
      await adminService.updateInscription(inscriptionToDelete.id, {
        statut: 'refuse',
        salle_examen: '',
        centre_examen: ''
      });
      
      alert('Inscription refusée et supprimée avec succès');
      fermerDeleteModal();
      chargerInscriptions();
      chargerStats();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: 'badge-en_attente',
      accepte: 'badge-accepte',
      refuse: 'badge-refuse'
    };
    return <span className={`badge ${badges[statut] || 'badge-en_attente'}`}>{statut.replace('_', ' ')}</span>;
  };

  return (
    <div className="espace-admin">
      <h1 className="page-title">Espace Administration</h1>

      {/* Modale pour salle et centre */}
      {showModal && currentInscription && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Affecter la salle et le centre d'examen</h3>
              <button onClick={fermerModal} className="modal-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="inscription-info">
                <p><strong>Élève:</strong> {currentInscription.eleve_nom} {currentInscription.eleve_prenom}</p>
                <p><strong>Établissement:</strong> {currentInscription.etablissement_nom}</p>
                <p><strong>Examen:</strong> {currentInscription.examen_nom}</p>
                <p><strong>Statut:</strong> {getStatutBadge(currentInscription.nouveauStatut)}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Salle d'examen *</label>
                <input
                  type="text"
                  value={modalData.salle_examen}
                  onChange={(e) => setModalData({...modalData, salle_examen: e.target.value})}
                  className="form-input"
                  placeholder="Ex: Salle A, Salle 101..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Centre d'examen *</label>
                <input
                  type="text"
                  value={modalData.centre_examen}
                  onChange={(e) => setModalData({...modalData, centre_examen: e.target.value})}
                  className="form-input"
                  placeholder="Ex: Lycée Philibert, CEG Mahabibo..."
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={fermerModal} className="btn btn-secondary">
                Annuler
              </button>
              <button onClick={validerModal} className="btn btn-primary">
                Confirmer l'affectation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && inscriptionToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmer le refus</h3>
              <button onClick={fermerDeleteModal} className="modal-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="warning-message">
                <div className="warning-icon">⚠️</div>
                <h4>Êtes-vous sûr de vouloir refuser cette inscription ?</h4>
                <p>L'élève ne pourra pas passer l'examen.</p>
              </div>
              
              <div className="inscription-details">
                <p><strong>Élève:</strong> {inscriptionToDelete.eleve_nom} {inscriptionToDelete.eleve_prenom}</p>
                <p><strong>Établissement:</strong> {inscriptionToDelete.etablissement_nom}</p>
                <p><strong>Examen:</strong> {inscriptionToDelete.examen_nom}</p>
                <p><strong>N° d'inscription:</strong> {inscriptionToDelete.numero_inscription}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={fermerDeleteModal} className="btn btn-secondary">
                Annuler
              </button>
              <button onClick={supprimerInscription} className="btn btn-danger">
                Refuser l'inscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.inscriptions.total}</h3>
              <p>Total Inscriptions</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.inscriptions.en_attente}</h3>
              <p>En Attente</p>
            </div>
          </div>
          <div className="stat-card accepted">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.inscriptions.accepte}</h3>
              <p>Acceptées</p>
            </div>
          </div>
          <div className="stat-card refused">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>{stats.inscriptions.refuse}</h3>
              <p>Refusées</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="card management-card">
        <div className="card-header">
          <h2>Gestion des Inscriptions</h2>
          <div className="header-actions">
            <button 
              onClick={chargerInscriptions} 
              className="btn btn-refresh"
              disabled={loading}
            >
              <span className="btn-icon">🔄</span>
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>
        </div>
        
        <div className="filters">
          <div className="form-group">
            <label className="form-label">Filtrer par statut</label>
            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="form-select"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="accepte">Accepté</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>
        </div>

        {inscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Aucune inscription trouvée</h3>
            <p>Aucune inscription ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Établissement</th>
                  <th>Examen</th>
                  <th>Date Naissance</th>
                  <th>Statut</th>
                  <th>Salle</th>
                  <th>Centre</th>
                  <th className="actions-column">Actions</th>
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
                          <span className="detail-item">Classe: {inscription.classe || 'Non précisée'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="school-info">
                        {inscription.etablissement_nom}
                        <div className="school-code">
                          Code: {inscription.etablissement_code}
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
                    <td className="actions-column">
                      <div className="actions-container">
                        <button
                          onClick={() => ouvrirModal(inscription, 'accepte')}
                          className="btn btn-accept"
                          disabled={inscription.statut === 'accepte'}
                          title="Accepter l'inscription"
                        >
                          <span className="btn-icon">✓</span>
                          Accepter
                        </button>
                        <button
                          onClick={() => ouvrirDeleteModal(inscription)}
                          className="btn btn-delete"
                          disabled={inscription.statut === 'refuse'}
                          title="Refuser l'inscription"
                        >
                          <span className="btn-icon">🗑️</span>
                          Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .espace-admin {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-title {
          color: #1e3c72;
          margin-bottom: 2rem;
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Statistiques */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
          border-left: 4px solid;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-card.total {
          border-left-color: #1e3c72;
        }

        .stat-card.pending {
          border-left-color: #ffc107;
        }

        .stat-card.accepted {
          border-left-color: #28a745;
        }

        .stat-card.refused {
          border-left-color: #dc3545;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1e3c72;
        }

        .stat-content p {
          margin: 0.25rem 0 0 0;
          color: #666;
          font-weight: 500;
        }

        /* Cartes principales */
        .management-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e1e5e9;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .card-header h2 {
          margin: 0;
          color: #1e3c72;
          font-size: 1.5rem;
        }

        /* Filtres */
        .filters {
          padding: 1.5rem;
          border-bottom: 1px solid #e1e5e9;
          display: flex;
          gap: 1rem;
          align-items: end;
        }

        .form-group {
          flex: 1;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-select, .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-select:focus, .form-input:focus {
          outline: none;
          border-color: #1e3c72;
        }

        /* Boutons */
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          min-width: auto;
          white-space: nowrap;
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

        .btn-accept {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 0.4rem 0.8rem;
        }

        .btn-accept:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        }

        .btn-delete {
          background: linear-gradient(135deg, #dc3545, #e83e8c);
          color: white;
          padding: 0.4rem 0.8rem;
        }

        .btn-delete:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        .btn-refresh {
          background: #17a2b8;
          color: white;
          padding: 0.75rem 1.5rem;
        }

        .btn-refresh:hover:not(:disabled) {
          background: #138496;
        }

        .btn-icon {
          font-size: 0.9rem;
        }

        /* Tableau */
        .table-container {
          overflow-x: auto;
          padding: 0 1rem 1rem 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
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
          padding: 0.8rem;
          border-bottom: 1px solid #e1e5e9;
          vertical-align: top;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        /* Colonne Actions */
        .actions-column {
          min-width: 140px;
          max-width: 140px;
          width: 140px;
        }

        /* Informations élève et établissement */
        .student-info strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #333;
        }

        .student-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .detail-item {
          font-size: 0.75rem;
          color: #666;
        }

        .school-info {
          color: #333;
        }

        .school-code {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .exam-name, .birth-date, .room-info, .center-info {
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

        /* Actions */
        .actions-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 120px;
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

        /* Modales */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e1e5e9;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .modal-header h3 {
          margin: 0;
          color: #1e3c72;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .modal-close:hover {
          background: #e9ecef;
          color: #333;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e1e5e9;
        }

        .inscription-info, .inscription-details {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .inscription-info p, .inscription-details p {
          margin: 0.5rem 0;
        }

        .warning-message {
          text-align: center;
          padding: 1rem;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .warning-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .warning-message h4 {
          margin: 0.5rem 0;
          color: #856404;
        }

        .warning-message p {
          margin: 0;
          color: #856404;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .espace-admin {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .header-actions {
            align-self: stretch;
          }

          .actions-container {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .data-table {
            font-size: 0.875rem;
            min-width: 800px;
          }

          .data-table th,
          .data-table td {
            padding: 0.5rem;
          }

          .actions-column {
            min-width: 120px;
            max-width: 120px;
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default EspaceAdmin;