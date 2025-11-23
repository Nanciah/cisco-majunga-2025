const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sisco_db'
};

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
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('SELECT 1');
        await connection.end();
        res.json({ message: 'Connexion à la base de données réussie' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de connexion à la base de données: ' + error.message });
    }
});

// Routes publiques pour les établissements
app.get('/api/etablissements', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT id, code, nom, secteur, niveau, commune, zap, fokontany, village, remarques
            FROM etablissements 
            ORDER BY nom
        `);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

app.get('/api/etablissements/search', async (req, res) => {
    try {
        const { q, secteur, niveau } = req.query;
        const connection = await mysql.createConnection(dbConfig);
        
        let query = `
            SELECT id, code, nom, secteur, niveau, commune, zap, fokontany, village, remarques
            FROM etablissements WHERE 1=1
        `;
        const params = [];

        if (q) {
            query += ' AND (nom LIKE ? OR code LIKE ? OR commune LIKE ? OR fokontany LIKE ?)';
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (secteur) {
            query += ' AND secteur = ?';
            params.push(secteur);
        }

        if (niveau) {
            query += ' AND niveau = ?';
            params.push(niveau);
        }

        query += ' ORDER BY nom';

        const [rows] = await connection.execute(query, params);
        await connection.end();
        res.json(rows);
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

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT * FROM etablissements WHERE login = ?',
            [login]
        );

        if (rows.length === 0) {
            await connection.end();
            return res.status(401).json({ error: 'Établissement non trouvé' });
        }

        const etablissement = rows[0];
        
        // Vérification du mot de passe (identique pour tous)
        if (password !== etablissement.password) {
            await connection.end();
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

        await connection.end();
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

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT * FROM administrateurs WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            await connection.end();
            return res.status(401).json({ error: 'Administrateur non trouvé' });
        }

        const admin = rows[0];
        
        // Vérification simple du mot de passe
        if (password !== admin.password) {
            await connection.end();
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

        await connection.end();
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
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM examens ORDER BY id');
        await connection.end();
        res.json(rows);
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

        const connection = await mysql.createConnection(dbConfig);
        
        const results = [];
        
        for (const eleve of eleves) {
            if (!eleve.nom || !eleve.prenom || !eleve.date_naissance) {
                continue; // Ignorer les élèves incomplets
            }
            
            const numero_inscription = `INS${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
            
            const [result] = await connection.execute(
                `INSERT INTO inscriptions 
                (etablissement_id, examen_id, eleve_nom, eleve_prenom, date_naissance, lieu_naissance, classe, numero_inscription) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
                id: result.insertId,
                numero_inscription,
                ...eleve
            });
        }

        await connection.end();
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

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT i.*, e.nom as examen_nom 
            FROM inscriptions i 
            JOIN examens e ON i.examen_id = e.id 
            WHERE i.etablissement_id = ? 
            ORDER BY i.date_inscription DESC
        `, [req.user.id]);

        await connection.end();
        res.json(rows);
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
        const connection = await mysql.createConnection(dbConfig);
        
        let query = `
            SELECT i.*, e.nom as etablissement_nom, e.code as etablissement_code, ex.nom as examen_nom
            FROM inscriptions i 
            JOIN etablissements e ON i.etablissement_id = e.id 
            JOIN examens ex ON i.examen_id = ex.id 
            WHERE 1=1
        `;
        const params = [];

        if (statut) {
            query += ' AND i.statut = ?';
            params.push(statut);
        }

        if (etablissement_id) {
            query += ' AND i.etablissement_id = ?';
            params.push(etablissement_id);
        }

        query += ' ORDER BY i.date_inscription DESC';

        const [rows] = await connection.execute(query, params);
        await connection.end();
        res.json(rows);
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
        const connection = await mysql.createConnection(dbConfig);
        
        await connection.execute(
            `UPDATE inscriptions 
            SET statut = ?, salle_examen = ?, centre_examen = ? 
            WHERE id = ?`,
            [statut, salle_examen, centre_examen, req.params.id]
        );

        await connection.end();
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

        const connection = await mysql.createConnection(dbConfig);
        
        const [inscriptionsStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(statut = 'en_attente') as en_attente,
                SUM(statut = 'accepte') as accepte,
                SUM(statut = 'refuse') as refuse
            FROM inscriptions
        `);

        const [etablissementsStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_etablissements,
                COUNT(DISTINCT etablissement_id) as etablissements_actifs
            FROM inscriptions
        `);

        await connection.end();
        
        res.json({
            inscriptions: inscriptionsStats[0],
            etablissements: etablissementsStats[0]
        });
    } catch (error) {
        console.error('Erreur stats:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend SISCO démarré sur le port ${PORT}`);
    console.log(`📊 URL: http://localhost:${PORT}`);
});