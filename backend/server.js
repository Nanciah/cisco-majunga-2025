const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration PostgreSQL avec vos variables
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    console.log('🔄 Début de l initialisation de la base de données...');
    
    // Création de la table administrateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS administrateurs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table administrateurs créée');

    // Création de la table etablissements
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etablissements (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        adresse TEXT,
        ville VARCHAR(100),
        telephone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table etablissements créée');

    // Création de la table examens
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

    // Création de la table inscriptions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscriptions (
        id SERIAL PRIMARY KEY,
        etablissement_id INTEGER REFERENCES etablissements(id),
        examen_id INTEGER REFERENCES examens(id),
        nombre_candidats INTEGER DEFAULT 0,
        statut VARCHAR(50) DEFAULT 'en_attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(etablissement_id, examen_id)
      )
    `);
    console.log('✅ Table inscriptions créée');

    // Créer un administrateur par défaut
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await pool.query(`
      INSERT INTO administrateurs (username, password_hash, email) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING
    `, ['admin', hashedPassword, 'admin@sisco.mg']);
    console.log('✅ Administrateur par défaut créé');

    // Ajouter des données d'exemple
    await addSampleData();

    console.log('🎉 Base de données initialisée avec succès!');
    
    return { success: true, message: "Base de données initialisée avec succès" };
  } catch (error) {
    console.error('❌ Erreur lors de l initialisation de la base de données:', error);
    throw error;
  }
}

// Fonction pour ajouter des données d'exemple
async function addSampleData() {
  try {
    console.log('📝 Ajout des données exemple...');
    
    // Vérifier si des établissements existent déjà
    const existingEtablissements = await pool.query('SELECT COUNT(*) FROM etablissements');
    if (parseInt(existingEtablissements.rows[0].count) === 0) {
      
      // Ajouter des établissements
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
      console.log('✅ 5 établissements d exemple créés');
    }

    // Vérifier si des examens existent déjà
    const existingExamens = await pool.query('SELECT COUNT(*) FROM examens');
    if (parseInt(existingExamens.rows[0].count) === 0) {
      
      // Ajouter des examens
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
      console.log('✅ 5 examens d exemple créés');
    }

    // Vérifier si des inscriptions existent déjà
    const existingInscriptions = await pool.query('SELECT COUNT(*) FROM inscriptions');
    if (parseInt(existingInscriptions.rows[0].count) === 0) {
      
      // Ajouter quelques inscriptions
      const inscriptions = [
        [1, 1, 85, 'confirmé'],
        [1, 2, 45, 'en_attente'],
        [2, 1, 120, 'validé'],
        [2, 3, 65, 'confirmé'],
        [3, 2, 90, 'en_attente'],
        [4, 1, 75, 'validé'],
        [5, 5, 150, 'confirmé']
      ];

      for (const inscription of inscriptions) {
        await pool.query(
          'INSERT INTO inscriptions (etablissement_id, examen_id, nombre_candidats, statut) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          inscription
        );
      }
      console.log('✅ Inscriptions d exemple créées');
    }

    console.log('🎉 Données d exemple ajoutées avec succès!');
  } catch (error) {
    console.log('ℹ️ Les données existent peut-être déjà:', error.message);
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

// Routes de l'API

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API SISCO Backend opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route pour initialiser la DB
app.post('/api/init-db', async (req, res) => {
  try {
    const result = await initializeDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'initialisation de la base de données' 
    });
  }
});

// Route de login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    // Rechercher l'administrateur
    const result = await pool.query(
      'SELECT * FROM administrateurs WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const admin = result.rows[0];

    // Vérifier le mot de passe avec bcryptjs
    const validPassword = bcrypt.compareSync(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'sisco_super_secret_2024',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Routes pour les établissements
app.get('/api/etablissements', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM etablissements 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, etablissements: result.rows });
  } catch (error) {
    console.error('Erreur récupération établissements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/etablissements', authenticateToken, async (req, res) => {
  try {
    const { nom, code, adresse, ville, telephone, email } = req.body;

    const result = await pool.query(
      `INSERT INTO etablissements (nom, code, adresse, ville, telephone, email) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [nom, code, adresse, ville, telephone, email]
    );

    res.json({ 
      success: true, 
      message: 'Établissement créé avec succès',
      etablissement: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Le code établissement existe déjà' });
    } else {
      console.error('Erreur création établissement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

app.put('/api/etablissements/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, code, adresse, ville, telephone, email } = req.body;

    const result = await pool.query(
      `UPDATE etablissements 
       SET nom = $1, code = $2, adresse = $3, ville = $4, telephone = $5, email = $6 
       WHERE id = $7 
       RETURNING *`,
      [nom, code, adresse, ville, telephone, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }

    res.json({ 
      success: true, 
      message: 'Établissement modifié avec succès',
      etablissement: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Le code établissement existe déjà' });
    } else {
      console.error('Erreur modification établissement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

app.delete('/api/etablissements/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM etablissements WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }

    res.json({ 
      success: true, 
      message: 'Établissement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression établissement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les examens
app.get('/api/examens', authenticateToken, async (req, res) => {
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

app.post('/api/examens', authenticateToken, async (req, res) => {
  try {
    const { nom, code, date_examen, heure_debut, heure_fin, duree } = req.body;

    const result = await pool.query(
      `INSERT INTO examens (nom, code, date_examen, heure_debut, heure_fin, duree) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [nom, code, date_examen, heure_debut, heure_fin, duree]
    );

    res.json({ 
      success: true, 
      message: 'Examen créé avec succès',
      examen: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Le code examen existe déjà' });
    } else {
      console.error('Erreur création examen:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

// Routes pour les inscriptions
app.get('/api/inscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, e.nom as etablissement_nom, ex.nom as examen_nom, ex.code as examen_code
      FROM inscriptions i
      JOIN etablissements e ON i.etablissement_id = e.id
      JOIN examens ex ON i.examen_id = ex.id
      ORDER BY i.created_at DESC
    `);
    res.json({ success: true, inscriptions: result.rows });
  } catch (error) {
    console.error('Erreur récupération inscriptions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/inscriptions', authenticateToken, async (req, res) => {
  try {
    const { etablissement_id, examen_id, nombre_candidats, statut } = req.body;

    const result = await pool.query(
      `INSERT INTO inscriptions (etablissement_id, examen_id, nombre_candidats, statut) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [etablissement_id, examen_id, nombre_candidats, statut || 'en_attente']
    );

    res.json({ 
      success: true, 
      message: 'Inscription créée avec succès',
      inscription: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Cette inscription existe déjà' });
    } else {
      console.error('Erreur création inscription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

// Route pour les statistiques
app.get('/api/statistiques', authenticateToken, async (req, res) => {
  try {
    const totalEtablissements = await pool.query('SELECT COUNT(*) FROM etablissements');
    const totalExamens = await pool.query('SELECT COUNT(*) FROM examens');
    const totalInscriptions = await pool.query('SELECT COUNT(*) FROM inscriptions');
    const totalCandidats = await pool.query('SELECT SUM(nombre_candidats) FROM inscriptions');

    res.json({
      success: true,
      statistiques: {
        totalEtablissements: parseInt(totalEtablissements.rows[0].count),
        totalExamens: parseInt(totalExamens.rows[0].count),
        totalInscriptions: parseInt(totalInscriptions.rows[0].count),
        totalCandidats: parseInt(totalCandidats.rows[0].sum) || 0
      }
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
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
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer l'application
startServer();

module.exports = app;