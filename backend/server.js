require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =====================
//  🔵 Connexion PostgreSQL
// =====================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// =====================
//  🔵 Initialisation DB (désactivée en production)
// =====================
async function initializeDatabase() {
  console.log("📌 Initialisation de la base de données...");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS etablissements (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        mot_de_passe TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        etudiant VARCHAR(255) NOT NULL,
        contenu TEXT NOT NULL,
        reponse TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables créées ou déjà existantes.");
  } catch (error) {
    console.error("❌ Erreur initialisation DB:", error);
  }
}

// ⚠️ Ne pas initialiser automatiquement en production
if (process.env.NODE_ENV !== "production") {
  initializeDatabase();
}

// =====================
//  🔵 ROUTES
// =====================

// Test API
app.get("/", (req, res) => {
  res.send("🚀 Backend SISCO opérationnel !");
});

// Route pour initialiser la base manuellement
app.get("/api/init-db", async (req, res) => {
  await initializeDatabase();
  res.send("Base de données initialisée !");
});

// 🔹 Connexion établissement
app.post("/api/etablissements/login", async (req, res) => {
  try {
    const { code, mot_de_passe } = req.body;

    const result = await pool.query(
      "SELECT * FROM etablissements WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Code incorrect" });
    }

    const etab = result.rows[0];

    if (etab.mot_de_passe !== mot_de_passe) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: etab.id }, process.env.JWT_SECRET);

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur login etablissement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =====================
//  🔵 Lancement Serveur
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend SISCO lancé sur le port ${PORT}`);
});
