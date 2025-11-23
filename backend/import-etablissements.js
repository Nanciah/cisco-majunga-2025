const mysql = require('mysql2/promise');

// Données des établissements (copiez votre liste ici)
const etablissements = [
    { code: "401011087", nom: "ECOLE PRIVEE SAROBIDY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBALAVOLA", remarques: "ROUVERT" },
    { code: "401030301", nom: "COLLEGE PRIVE MAHAVELONA AMBOROVY", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "AMBOROVY", remarques: "ROUVERT" },
    // ... Ajoutez tous vos établissements ici
];

async function importerEtablissements() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sisco_db'
    });

    try {
        console.log('Début de l\'importation des établissements...');
        
        let compteur = 0;
        for (const etab of etablissements) {
            // Créer un login basé sur le code
            const login = `etab_${etab.code}`;
            
            try {
                await connection.execute(
                    `INSERT INTO etablissements 
                    (code, nom, secteur, niveau, commune, zap, fokontany, village, remarques, login, password) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        etab.code,
                        etab.nom,
                        etab.secteur,
                        etab.niveau,
                        etab.commune,
                        etab.zap,
                        etab.fokontany,
                        etab.village || null,
                        etab.remarques,
                        login,
                        'sisco2024' // Mot de passe identique pour tous
                    ]
                );
                compteur++;
                console.log(`✓ ${etab.nom} importé`);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`⚠ ${etab.nom} déjà existant`);
                } else {
                    console.log(`✗ Erreur avec ${etab.nom}:`, error.message);
                }
            }
        }
        
        console.log(`\n✅ Importation terminée! ${compteur} établissements importés avec succès.`);
        console.log('🔐 Login format: etab_CODE_ETABLISSEMENT');
        console.log('🔐 Mot de passe: sisco2024');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error);
    } finally {
        await connection.end();
    }
}

importerEtablissements();