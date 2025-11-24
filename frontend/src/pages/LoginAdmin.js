const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    console.log('🔄 Début de l initialisation de la base de données...');
    
    // Créer la table administrateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS administrateurs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table administrateurs créée');

    // Créer la table etablissements
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etablissements (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        adresse TEXT,
        ville VARCHAR(100),
        telephone VARCHAR(20),
        email VARCHAR(255),
        password VARCHAR(255) DEFAULT 'etab123',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table etablissements créée');

    // Créer la table examens
    await pool.query(`
      CREATE TABLE IF NOT EXISTS examens (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        date_examen DATE,
        heure_debut TIME,
        heure_fin TIME,
        duree INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table examens créée');

    // Créer la table inscriptions_eleves
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscriptions_eleves (
        id SERIAL PRIMARY KEY,
        etablissement_id INTEGER REFERENCES etablissements(id),
        examen_id INTEGER REFERENCES examens(id),
        numero_inscription VARCHAR(100) UNIQUE NOT NULL,
        eleve_nom VARCHAR(255) NOT NULL,
        eleve_prenom VARCHAR(255) NOT NULL,
        date_naissance DATE NOT NULL,
        lieu_naissance VARCHAR(255),
        classe VARCHAR(100),
        statut VARCHAR(50) DEFAULT 'en_attente',
        salle_examen VARCHAR(50),
        centre_examen VARCHAR(255),
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table inscriptions_eleves créée');

    // Vérifier si l'admin existe déjà
    const adminCheck = await pool.query('SELECT COUNT(*) FROM administrateurs WHERE username = $1', ['admin']);
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await pool.query(
        'INSERT INTO administrateurs (username, password, email) VALUES ($1, $2, $3)',
        ['admin', 'admin123', 'admin@sisco.mg']
      );
      console.log('✅ Administrateur par défaut créé');
    }

    // Vérifier si les établissements existent
    const etabCheck = await pool.query('SELECT COUNT(*) FROM etablissements');
    if (parseInt(etabCheck.rows[0].count) === 0) {
      const etablissements = [
        ['Lycée Jean Joseph Rabearivelo', 'LJJR001', 'Rue George V', 'Antananarivo', '+261 20 22 123 45', 'contact@ljjr.mg'],
        ['Lycée Andohalo', 'LAN002', 'Place Andohalo', 'Antananarivo', '+261 20 22 234 56', 'info@andohalo.mg'],
        ['Collège Saint Michel', 'CSM003', 'Ambatovinaky', 'Antananarivo', '+261 20 22 345 67', 'direction@stmichel.mg'],
        ['Lycée Jules Ferry', 'LJF004', 'Analakely', 'Antananarivo', '+261 20 22 456 78', 'secretariat@jferry.mg'],
        ['École Primaire Ampandrana', 'EPA005', 'Ampandrana Ouest', 'Antananarivo', '+261 20 22 567 89', 'epa@edu.mg']
      ];

      for (const etab of etablissements) {
        await pool.query(
          'INSERT INTO etablissements (nom, code, adresse, ville, telephone, email) VALUES ($1, $2, $3, $4, $5, $6)',
          etab
        );
      }
      console.log('✅ 5 établissements de test créés');
    }

    // Vérifier si les examens existent
    const examCheck = await pool.query('SELECT COUNT(*) FROM examens');
    if (parseInt(examCheck.rows[0].count) === 0) {
      const examens = [
        ['Baccalauréat Série A1', 'BAC-A1-2024', '2024-09-15', '08:00', '12:00', 240],
        ['Baccalauréat Série A2', 'BAC-A2-2024', '2024-09-16', '08:00', '12:00', 240],
        ['Baccalauréat Série C', 'BAC-C-2024', '2024-09-17', '08:00', '12:00', 240],
        ['Baccalauréat Série D', 'BAC-D-2024', '2024-09-18', '08:00', '12:00', 240],
        ['BEPC Session 2024', 'BEPC-2024', '2024-07-10', '08:00', '11:00', 180]
      ];

      for (const exam of examens) {
        await pool.query(
          'INSERT INTO examens (nom, code, date_examen, heure_debut, heure_fin, duree) VALUES ($1, $2, $3, $4, $5, $6)',
          exam
        );
      }
      console.log('✅ 5 examens de test créés');
    }

    console.log('🎉 Base de données initialisée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l initialisation de la base de données:', error.message);
  }
}

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'sisco_super_secret_2024', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
}

// ==================== ROUTES DE L'API ====================

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API SISCO Backend opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route pour réinitialiser la base de données
app.post('/api/init-db', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ 
      success: true, 
      message: '✅ Base de données initialisée avec succès!' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'initialisation de la base de données' 
    });
  }
});

// Test de connexion à la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      success: true,
      message: 'Connexion à PostgreSQL réussie',
      current_time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Erreur de connexion à PostgreSQL: ' + error.message 
    });
  }
});

// ==================== ROUTES ADMIN ====================

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const result = await pool.query(
      'SELECT * FROM administrateurs WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Administrateur non trouvé' });
    }

    const admin = result.rows[0];
    
    // Vérifier le mot de passe
    if (password !== admin.password) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        type: 'admin' 
      },
      process.env.JWT_SECRET || 'sisco_super_secret_2024',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion admin réussie',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        type: 'admin'
      }
    });

  } catch (error) {
    console.error('Erreur login admin:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Récupérer les inscriptions (admin)
app.get('/api/admin/inscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { statut, etablissement_id } = req.query;
    
    let query = `
      SELECT ie.*, e.nom as etablissement_nom, e.code as etablissement_code, ex.nom as examen_nom
      FROM inscriptions_eleves ie 
      JOIN etablissements e ON ie.etablissement_id = e.id 
      JOIN examens ex ON ie.examen_id = ex.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (statut) {
      paramCount++;
      query += ` AND ie.statut = $${paramCount}`;
      params.push(statut);
    }

    if (etablissement_id) {
      paramCount++;
      query += ` AND ie.etablissement_id = $${paramCount}`;
      params.push(etablissement_id);
    }

    query += ' ORDER BY ie.date_inscription DESC';

    const result = await pool.query(query, params);
    res.json({ 
      success: true, 
      inscriptions: result.rows 
    });
  } catch (error) {
    console.error('Erreur récupération inscriptions admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour une inscription (admin)
app.put('/api/admin/inscriptions/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { id } = req.params;
    const { statut, salle_examen, centre_examen } = req.body;
    
    const result = await pool.query(
      `UPDATE inscriptions_eleves 
      SET statut = $1, salle_examen = $2, centre_examen = $3 
      WHERE id = $4 RETURNING *`,
      [statut, salle_examen, centre_examen, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }

    res.json({ 
      success: true,
      message: 'Inscription mise à jour avec succès',
      inscription: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur mise à jour inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les statistiques admin
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const totalEtablissements = await pool.query('SELECT COUNT(*) FROM etablissements');
    const totalExamens = await pool.query('SELECT COUNT(*) FROM examens');
    const totalInscriptions = await pool.query('SELECT COUNT(*) FROM inscriptions_eleves');
    
    const statsParStatut = await pool.query(`
      SELECT statut, COUNT(*) as count 
      FROM inscriptions_eleves 
      GROUP BY statut
    `);

    const statsParExamen = await pool.query(`
      SELECT e.nom, COUNT(ie.id) as count
      FROM examens e
      LEFT JOIN inscriptions_eleves ie ON e.id = ie.examen_id
      GROUP BY e.id, e.nom
      ORDER BY count DESC
    `);
    
    res.json({
      success: true,
      statistiques: {
        totalEtablissements: parseInt(totalEtablissements.rows[0].count),
        totalExamens: parseInt(totalExamens.rows[0].count),
        totalInscriptions: parseInt(totalInscriptions.rows[0].count),
        inscriptionsParStatut: statsParStatut.rows,
        inscriptionsParExamen: statsParExamen.rows
      }
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES ÉTABLISSEMENT ====================

// Login établissement
app.post('/api/etablissements/login', async (req, res) => {
  try {
    const { code, password } = req.body;

    if (!code || !password) {
      return res.status(400).json({ error: 'Code établissement et mot de passe requis' });
    }

    const result = await pool.query(
      'SELECT * FROM etablissements WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Établissement non trouvé' });
    }

    const etablissement = result.rows[0];
    
    // Vérifier le mot de passe
    if (password !== etablissement.password) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { 
        id: etablissement.id, 
        code: etablissement.code,
        type: 'etablissement' 
      },
      process.env.JWT_SECRET || 'sisco_super_secret_2024',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion établissement réussie',
      token,
      etablissement: {
        id: etablissement.id,
        nom: etablissement.nom,
        code: etablissement.code,
        adresse: etablissement.adresse,
        ville: etablissement.ville,
        telephone: etablissement.telephone,
        email: etablissement.email,
        type: 'etablissement'
      }
    });

  } catch (error) {
    console.error('Erreur login établissement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer une inscription (établissement)
app.post('/api/etablissements/inscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'etablissement') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { eleves, examen_id } = req.body;
    
    if (!eleves || !examen_id || !Array.isArray(eleves)) {
      return res.status(400).json({ error: 'Données élèves et examen requis' });
    }

    // Vérifier que l'examen existe
    const examenCheck = await pool.query(
      'SELECT id FROM examens WHERE id = $1',
      [examen_id]
    );

    if (examenCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Examen non trouvé' });
    }

    const results = [];
    
    for (const eleve of eleves) {
      // Vérifier les données obligatoires
      if (!eleve.nom || !eleve.prenom || !eleve.date_naissance) {
        continue; // Ignorer les élèves incomplets
      }

      // Générer un numéro d'inscription unique
      const numero_inscription = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await pool.query(
        `INSERT INTO inscriptions_eleves 
        (etablissement_id, examen_id, numero_inscription, eleve_nom, eleve_prenom, date_naissance, lieu_naissance, classe, statut) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          req.user.id,
          examen_id,
          numero_inscription,
          eleve.nom.trim(),
          eleve.prenom.trim(),
          eleve.date_naissance,
          eleve.lieu_naissance?.trim() || '',
          eleve.classe?.trim() || '',
          'en_attente'
        ]
      );
      
      results.push(result.rows[0]);
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Aucun élève valide à inscrire' });
    }

    res.json({
      success: true,
      message: `${results.length} élève(s) inscrit(s) avec succès`,
      inscriptions: results
    });

  } catch (error) {
    console.error('Erreur création inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription des élèves' });
  }
});

// Récupérer les inscriptions d'un établissement
app.get('/api/etablissements/inscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'etablissement') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await pool.query(`
      SELECT ie.*, e.nom as examen_nom, e.code as examen_code
      FROM inscriptions_eleves ie
      JOIN examens e ON ie.examen_id = e.id
      WHERE ie.etablissement_id = $1
      ORDER BY ie.date_inscription DESC
    `, [req.user.id]);

    res.json({ 
      success: true, 
      inscriptions: result.rows 
    });

  } catch (error) {
    console.error('Erreur récupération inscriptions établissement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les examens disponibles
app.get('/api/etablissements/examens', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM examens 
      WHERE date_examen >= CURRENT_DATE OR date_examen IS NULL
      ORDER BY date_examen ASC
    `);

    res.json({ 
      success: true, 
      examens: result.rows 
    });

  } catch (error) {
    console.error('Erreur récupération examens:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES PUBLIQUES ====================

// Récupérer tous les établissements
app.get('/api/etablissements', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM etablissements 
      ORDER BY nom ASC
    `);
    res.json({ success: true, etablissements: result.rows });
  } catch (error) {
    console.error('Erreur récupération établissements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Rechercher des établissements
app.get('/api/etablissements/search', async (req, res) => {
  try {
    const { nom, code, ville } = req.query;
    let query = 'SELECT * FROM etablissements WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (nom) {
      paramCount++;
      query += ` AND nom ILIKE $${paramCount}`;
      params.push(`%${nom}%`);
    }

    if (code) {
      paramCount++;
      query += ` AND code ILIKE $${paramCount}`;
      params.push(`%${code}%`);
    }

    if (ville) {
      paramCount++;
      query += ` AND ville ILIKE $${paramCount}`;
      params.push(`%${ville}%`);
    }

    query += ' ORDER BY nom ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, etablissements: result.rows });
  } catch (error) {
    console.error('Erreur recherche établissements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les examens
app.get('/api/examens', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM examens 
      ORDER BY date_examen DESC
    `);
    res.json({ success: true, examens: result.rows });
  } catch (error) {
    console.error('Erreur récupération examens:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ==================== DÉMARRAGE DU SERVEUR ====================

async function startServer() {
  try {
    // Tester la connexion à la base de données
    const client = await pool.connect();
    console.log('✅ Connecté à PostgreSQL avec succès');
    client.release();
    
    // Initialiser la base de données
    await initializeDatabase();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend SISCO démarré sur le port ${PORT}`);
      console.log(`📊 URL: http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: https://cisco-majunga-2025.onrender.com`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer l'application
startServer();

module.exports = app;