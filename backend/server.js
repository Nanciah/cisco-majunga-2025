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

// Configuration PostgreSQL CORRIGÉE
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
// Test de connexion PostgreSQL
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL avec succès');
});

pool.on('error', (err) => {
  console.error('❌ Erreur connexion PostgreSQL:', err);
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Test de connexion à la base de données
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({ 
            message: 'Connexion à PostgreSQL réussie',
            time: result.rows[0].current_time
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de connexion à PostgreSQL: ' + error.message });
    }
});

// Routes publiques pour les établissements
app.get('/api/etablissements', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, code, nom, secteur, niveau, commune, zap, fokontany, village, remarques
            FROM etablissements 
            ORDER BY nom
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

app.get('/api/etablissements/search', async (req, res) => {
    try {
        const { q, secteur, niveau } = req.query;
        
        let query = `
            SELECT id, code, nom, secteur, niveau, commune, zap, fokontany, village, remarques
            FROM etablissements WHERE 1=1
        `;
        const params = [];

        if (q) {
            query += ' AND (nom ILIKE $1 OR code ILIKE $2 OR commune ILIKE $3 OR fokontany ILIKE $4)';
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (secteur) {
            const paramIndex = params.length + 1;
            query += ` AND secteur = $${paramIndex}`;
            params.push(secteur);
        }

        if (niveau) {
            const paramIndex = params.length + 1;
            query += ` AND niveau = $${paramIndex}`;
            params.push(niveau);
        }

        query += ' ORDER BY nom';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Routes d'authentification
app.post('/api/etablissements/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        
        if (!login || !password) {
            return res.status(400).json({ error: 'Login et mot de passe requis' });
        }

        const result = await pool.query(
            'SELECT * FROM etablissements WHERE login = $1',
            [login]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Établissement non trouvé' });
        }

        const etablissement = result.rows[0];
        
        // Vérification du mot de passe (identique pour tous)
        if (password !== etablissement.password) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { 
                id: etablissement.id, 
                code: etablissement.code,
                nom: etablissement.nom,
                type: 'etablissement' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            etablissement: {
                id: etablissement.id,
                code: etablissement.code,
                nom: etablissement.nom,
                secteur: etablissement.secteur,
                niveau: etablissement.niveau,
                commune: etablissement.commune
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username et mot de passe requis' });
        }

        const result = await pool.query(
            'SELECT * FROM administrateurs WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Administrateur non trouvé' });
        }

        const admin = result.rows[0];
        
        // Vérification simple du mot de passe
        if (password !== admin.password) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { 
                id: admin.id, 
                username: admin.username,
                nom: admin.nom,
                prenom: admin.prenom,
                role: admin.role,
                type: 'admin' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                nom: admin.nom,
                prenom: admin.prenom,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Erreur login admin:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Routes pour les examens
app.get('/api/examens', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM examens ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Routes pour les inscriptions (établissement)
app.post('/api/inscriptions', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'etablissement') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const { eleves, examen_id } = req.body;
        
        if (!eleves || !examen_id || !Array.isArray(eleves)) {
            return res.status(400).json({ error: 'Données invalides' });
        }

        const results = [];
        
        for (const eleve of eleves) {
            if (!eleve.nom || !eleve.prenom || !eleve.date_naissance) {
                continue; // Ignorer les élèves incomplets
            }
            
            const numero_inscription = `INS${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
            
            const result = await pool.query(
                `INSERT INTO inscriptions 
                (etablissement_id, examen_id, eleve_nom, eleve_prenom, date_naissance, lieu_naissance, classe, numero_inscription) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    req.user.id,
                    examen_id,
                    eleve.nom.trim(),
                    eleve.prenom.trim(),
                    eleve.date_naissance,
                    eleve.lieu_naissance?.trim() || '',
                    eleve.classe?.trim() || '',
                    numero_inscription
                ]
            );
            
            results.push({
                id: result.rows[0].id,
                numero_inscription,
                ...eleve
            });
        }

        res.json({ 
            message: `${results.length} inscription(s) enregistrée(s) avec succès`, 
            inscriptions: results 
        });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

app.get('/api/etablissement/inscriptions', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'etablissement') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const result = await pool.query(`
            SELECT i.*, e.nom as examen_nom 
            FROM inscriptions i 
            JOIN examens e ON i.examen_id = e.id 
            WHERE i.etablissement_id = $1 
            ORDER BY i.date_inscription DESC
        `, [req.user.id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Routes admin pour les inscriptions
app.get('/api/admin/inscriptions', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const { statut, etablissement_id } = req.query;
        
        let query = `
            SELECT i.*, e.nom as etablissement_nom, e.code as etablissement_code, ex.nom as examen_nom
            FROM inscriptions i 
            JOIN etablissements e ON i.etablissement_id = e.id 
            JOIN examens ex ON i.examen_id = ex.id 
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 0;

        if (statut) {
            paramCount++;
            query += ` AND i.statut = $${paramCount}`;
            params.push(statut);
        }

        if (etablissement_id) {
            paramCount++;
            query += ` AND i.etablissement_id = $${paramCount}`;
            params.push(etablissement_id);
        }

        query += ' ORDER BY i.date_inscription DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

app.put('/api/admin/inscriptions/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const { statut, salle_examen, centre_examen } = req.body;
        
        await pool.query(
            `UPDATE inscriptions 
            SET statut = $1, salle_examen = $2, centre_examen = $3 
            WHERE id = $4`,
            [statut, salle_examen, centre_examen, req.params.id]
        );

        res.json({ message: 'Inscription mise à jour avec succès' });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Route pour obtenir les statistiques admin
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const inscriptionsStats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
                SUM(CASE WHEN statut = 'accepte' THEN 1 ELSE 0 END) as accepte,
                SUM(CASE WHEN statut = 'refuse' THEN 1 ELSE 0 END) as refuse
            FROM inscriptions
        `);

        const etablissementsStats = await pool.query(`
            SELECT 
                COUNT(*) as total_etablissements,
                COUNT(DISTINCT etablissement_id) as etablissements_actifs
            FROM inscriptions
        `);
        
        res.json({
            inscriptions: inscriptionsStats.rows[0],
            etablissements: etablissementsStats.rows[0]
        });
    } catch (error) {
        console.error('Erreur stats:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});
// === ROUTE TEMPORAIRE POUR INITIALISATION BD - À SUPPRIMER APRÈS ===
app.get('/api/init-database', async (req, res) => {
  try {
    console.log('🔄 Début de l initialisation de la base de données...');

    // 1. Table des administrateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS administrateurs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table administrateurs créée');

    // 2. Table des établissements
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etablissements (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        nom VARCHAR(255) NOT NULL,
        login VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        secteur VARCHAR(50),
        niveau VARCHAR(50),
        commune VARCHAR(100),
        zap VARCHAR(100),
        fokontany VARCHAR(100),
        village VARCHAR(100),
        remarques TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table etablissements créée');

    // 3. Table des examens
    await pool.query(`
      CREATE TABLE IF NOT EXISTS examens (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        annee INTEGER NOT NULL,
        date_debut DATE,
        date_fin DATE,
        statut VARCHAR(50) DEFAULT 'actif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table examens créée');

    // 4. Table des inscriptions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscriptions (
        id SERIAL PRIMARY KEY,
        etablissement_id INTEGER REFERENCES etablissements(id),
        examen_id INTEGER REFERENCES examens(id),
        eleve_nom VARCHAR(255) NOT NULL,
        eleve_prenom VARCHAR(255) NOT NULL,
        date_naissance DATE NOT NULL,
        lieu_naissance VARCHAR(255),
        classe VARCHAR(50),
        numero_inscription VARCHAR(100) UNIQUE NOT NULL,
        statut VARCHAR(50) DEFAULT 'en_attente',
        salle_examen VARCHAR(50),
        centre_examen VARCHAR(255),
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table inscriptions créée');

    // 5. Insertion administrateur par défaut
    await pool.query(`
      INSERT INTO administrateurs (username, password, nom, prenom, role) 
      VALUES ('admin', 'admin123', 'Admin', 'System', 'superadmin')
      ON CONFLICT (username) DO NOTHING
    `);
    console.log('✅ Administrateur par défaut créé');

    // 6. Insertion examen exemple
    await pool.query(`
      INSERT INTO examens (nom, annee, date_debut, date_fin) 
      VALUES ('Examen de Fin d''Etudes Primaires', 2024, '2024-06-01', '2024-06-30')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Exemple d examen créé');

    // 7. Insertion établissement de test
    await pool.query(`
      INSERT INTO etablissements (code, nom, login, password, secteur, niveau, commune) 
      VALUES ('ETAB001', 'Ecole Primaire Publique Majunga', 'majunga', 'password123', 'public', 'primaire', 'Majunga')
      ON CONFLICT (code) DO NOTHING
    `);
    console.log('✅ Établissement de test créé');

    console.log('🎉 Base de données initialisée avec succès!');
    
    res.json({ 
      success: true,
      message: '✅ Base de données initialisée avec succès!',
      tables: ['administrateurs', 'etablissements', 'examens', 'inscriptions']
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l initialisation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l initialisation: ' + error.message 
    });
  }
});
// === FIN DE LA ROUTE TEMPORAIRE ===

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend SISCO démarré sur le port ${PORT}`);
    console.log(`📊 URL: http://localhost:${PORT}`);
});