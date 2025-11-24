import React, { useState, useEffect } from 'react';
import { etablissementService } from '../services/api'; // SEULEMENT ce import

const EspaceEtablissement = () => {
  const [activeTab, setActiveTab] = useState('inscription');
  const [examens, setExamens] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [etablissementInfo, setEtablissementInfo] = useState(null);
  const [formData, setFormData] = useState({
    examen_id: '',
    eleves: [{ nom: '', prenom: '', date_naissance: '', lieu_naissance: '', classe: '' }]
  });

  useEffect(() => {
    // Récupérer l'établissement connecté
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type === 'etablissement') {
        setEtablissementInfo(parsedUser);
      }
    }

    chargerExamens();
    if (activeTab === 'consultation') {
      chargerInscriptions();
    }
  }, [activeTab]);

  // CHANGÉ : utilisation de etablissementService
  const chargerExamens = async () => {
    try {
      const response = await etablissementService.getExamens(); // ICI
      setExamens(response.data.examens || []);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des examens');
    }
  };

  // CHANGÉ : utilisation de etablissementService
  const chargerInscriptions = async () => {
    try {
      setLoading(true);
      const response = await etablissementService.getInscriptions(); // ICI
      setInscriptions(response.data.inscriptions || []);
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

  // CHANGÉ : utilisation de etablissementService
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.examen_id) {
      setMessage('Veuillez sélectionner un examen');
      return;
    }

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
      // CHANGÉ ICI : utilisation de etablissementService
      const response = await etablissementService.createInscription({
        eleves: elevesValides,
        examen_id: formData.examen_id
      });

      setMessage(`✅ ${response.data.message}`);
      
      setFormData({
        examen_id: '',
        eleves: [{ nom: '', prenom: '', date_naissance: '', lieu_naissance: '', classe: '' }]
      });

      chargerInscriptions();
      
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`❌ ${error.response?.data?.error || 'Erreur lors de l\'inscription'}`);
    } finally {
      setLoading(false);
    }
  };

  // ... (le reste de votre code JSX reste exactement le même)
};

export default EspaceEtablissement;