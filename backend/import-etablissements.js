const { Pool } = require('pg');

// Données des établissements - COPIEZ TOUTE VOTRE LISTE ICI
const etablissements = [
  { code: "401011087", nom: "ECOLE PRIVEE SAROBIDY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBALAVOLA", remarques: "ROUVERT" },
  { code: "401030301", nom: "COLLEGE PRIVE MAHAVELONA AMBOROVY", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "AMBOROVY", remarques: "ROUVERT" },
  { code: "401011181", nom: "ECOLE PRIVEE FINOHANA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "ANKARAOBATO", remarques: "ROUVERT" },
  // ... (votre liste complète d'établissements)
];

async function importerEtablissementsSansDoublons() {
    // Configuration PostgreSQL pour Render
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const client = await pool.connect();
    
    try {
        console.log('🚀 Début de l\'importation des établissements sur Render (PostgreSQL)...');
        console.log('📊 Connexion à la base de données PostgreSQL:', process.env.DB_HOST);
        
        // Vérifier la connexion
        const testResult = await client.query('SELECT 1 as test');
        console.log('✅ Connexion à PostgreSQL réussie');
        
        // Vider la table d'abord pour éviter les doublons
        await client.query('DELETE FROM etablissements');
        console.log('✅ Table etablissements vidée');
        
        let compteur = 0;
        let erreurs = 0;
        
        for (const etab of etablissements) {
            // Nettoyer les données
            const code = etab.code.trim();
            const nom = etab.nom.trim();
            const login = `etab_${code}`;
            
            try {
                await client.query(
                    `INSERT INTO etablissements 
                    (code, nom, secteur, niveau, commune, zap, fokontany, village, remarques, login, password) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        code,
                        nom,
                        etab.secteur,
                        etab.niveau,
                        etab.commune,
                        etab.zap,
                        etab.fokontany,
                        etab.village || null,
                        etab.remarques,
                        login,
                        'sisco2024'
                    ]
                );
                compteur++;
                if (compteur % 10 === 0) {
                    console.log(`✓ ${compteur} établissements importés...`);
                }
            } catch (error) {
                erreurs++;
                console.log(`✗ Erreur avec ${nom} (${code}):`, error.message);
            }
        }
        
        console.log(`\n📊 RÉSULTAT FINAL:`);
        console.log(`✅ ${compteur} établissements importés avec succès`);
        console.log(`❌ ${erreurs} erreurs`);
        
        // Vérification finale
        const result = await client.query('SELECT COUNT(*) as total FROM etablissements');
        console.log(`🔍 Total dans la base: ${result.rows[0].total} établissements`);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
        console.log('🔌 Connexion fermée');
    }
}

// Exporter la fonction pour pouvoir l'appeler
module.exports = { importerEtablissementsSansDoublons };

// Si vous voulez exécuter directement (pour les scripts)
if (require.main === module) {
    importerEtablissementsSansDoublons()
        .then(() => {
            console.log('🎉 Importation terminée avec succès!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Erreur critique:', error);
            process.exit(1);
        });
}