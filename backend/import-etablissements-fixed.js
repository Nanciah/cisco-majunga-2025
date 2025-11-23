const mysql = require('mysql2/promise');

// Données des établissements - COPIEZ TOUTE VOTRE LISTE ICI
const etablissements = [
  { code: "401011087", nom: "ECOLE PRIVEE SAROBIDY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBALAVOLA", remarques: "ROUVERT" },
  { code: "401030301", nom: "COLLEGE PRIVE MAHAVELONA AMBOROVY", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "AMBOROVY", remarques: "ROUVERT" },
  { code: "401011181", nom: "ECOLE PRIVEE FINOHANA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "ANKARAOBATO", remarques: "ROUVERT" },
  { code: "401011049", nom: "ECOLE PRIVEE LUTHERIENNE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", remarques: "ROUVERT" },
  { code: "401020204", nom: "ECOLE PRIVEE SAINT ESPRIT", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY AVARATRA", remarques: "Nouveau 24/25" },
  { code: "401020304", nom: "COLLEGE PRIVE LA GRACE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA", remarques: "Nouveau 24/25" },
  { code: "401020401", nom: "ECOLE PRIVEE MY DESTINY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "MAHATSINJO", village: "MAHATSINJO", remarques: "Nouveau 24/25" },
  { code: "401020502", nom: "ECOLE PRIVEE TRUSTY SCHOOL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "TANAMBAO SOTEMA", village: "TANAMBAO SOTEMA", remarques: "Nouveau 24/25" },
  { code: "401030202", nom: "ECOLE PRIVEE ARC EN CIEL III", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBONDRONA", village: "ANDOVINJO", remarques: "Nouveau 24/25" },
  { code: "401030305", nom: "ECOLE PRIVEE MIRANTSOA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", village: "MAROALA AMBOROVY", remarques: "Nouveau 24/25" },
   { code: "401010402", nom: "COLLEGE PRIVE LE VAILLANT", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", remarques: "Nouveau 24/post25" },
  { code: "401011302", nom: "ECOLE PRIVEE WISDOM", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", remarques: "Nouveau 24/25" },
  { code: "401010006", nom: "EPP AMBOHIMANDAMINA", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010008", nom: "EPP ANTANIMALANDY", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010019", nom: "EPP VICTOIRE RASOAMANARIVO", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010017", nom: "EPP TANAMBAO SOTEMA", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "TANAMBAO SOTEMA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010007", nom: "EPP AMBOROVY", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010010", nom: "EPP BELINTA", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010036", nom: "EPP MANARAPENITRA AMBOROVY", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010015", nom: "EPP FIOFIO", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "FIOFIO", remarques: "FONCTIONNEL 24/25" },
  { code: "401010018", nom: "EPP TSARARANO", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010025", nom: "EPP ECOLE D'APPLICATION MAHABIBO", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMBOVOALANANA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010027", nom: "EPP BARDAY", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", remarques: "FONCTIONNEL 24/25" },
  { code: "401010011", nom: "EPP CHARLES RENEL", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", remarques: "FONCTIONNEL 24/25" },
  { code: "401010012", nom: "EPP CITE TSARAMANDROSO", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY ATSIMO", remarques: "FONCTIONNEL 24/25" },
  { code: "401010014", nom: "EPP FIHAROVANA", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMPISIKINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010013", nom: "EPP FANANTENANA", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAROVATO ABATTOIR", remarques: "FONCTIONNEL 24/25" },
  { code: "401010028", nom: "EPP FIRAISANA FRANCOIS POIRIER", secteur: "Public", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAROVATO ABATTOIR", remarques: "FONCTIONNEL 24/25" },
  { code: "401010003", nom: "CEG ANTANIMALANDY", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010001", nom: "CEG AMBOROVY", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "AMBOROVY TSARARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010031", nom: "CEG DE REFERENCE AMBOROVY", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARIVOTRA -EST", remarques: "FONCTIONNEL 24/25" },
  { code: "401010005", nom: "CEG TSARARANO", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401010032", nom: "CEG MAHABIBO", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMBOVOALANANA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010004", nom: "CEG CHARLES RENEL MAHAJANGA", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA-BE", remarques: "FONCTIONNEL 24/25" },
  { code: "401010029", nom: "CEG AMPISIKINA", secteur: "Public", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401030304", nom: "LYCEE MANARAPENITRA AMBOROVY", secteur: "Public", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010020", nom: "LYCEE PHILIBERT TSIRANANA MAHAJANGA", secteur: "Public", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", remarques: "FONCTIONNEL 24/25" },
  { code: "401010034", nom: "LYCEE MANGARIVOTRA", secteur: "Public", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011023", nom: "COLLEGE PRIVE AVENIR", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011048", nom: "COLLEGE PRIVE LES ELITES", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011010", nom: "COLLEGE PRIVE MAHASOA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "0211J0330 SECTEUR 5", remarques: "FONCTIONNEL 24/25" },
  { code: "401011053", nom: "COLLEGE PRIVE NY AINA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA SECTEUR V", remarques: "FONCTIONNEL 24/25" },
  { code: "401011081", nom: "COLLEGE PRIVE RAINISOALAMBO", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "SECTERU 05", remarques: "FONCTIONNEL 24/25" },
  { code: "401011234", nom: "ECOLE PRIVEE LA FIERTE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA SECTEUR III", remarques: "FONCTIONNEL 24/25" },
  { code: "401011042", nom: "ECOLE PRIVEE LA PEPINIERE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA SECTEUR N°2", remarques: "FONCTIONNEL 24/25" },
  { code: "401011210", nom: "ECOLE PRIVEE TANJONA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "AMBOHIMANDAMINA SECTEUR III", remarques: "FONCTIONNEL 24/25" },
  { code: "401011056", nom: "LYCEE PRIVE SANTATRA", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "AMBOHIMANDAMINA", village: "SECTEUR IV AMBOHIMANDAMINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011021", nom: "COLLEGE PRIVE AL AMAL", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY AVARATRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011161", nom: "COLLEGE PRIVE LA REUSSITE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "SOTEMA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011045", nom: "COLLEGE PRIVE LE PALMIER", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011242", nom: "COLLEGE PRIVE LE SUCCES", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011205", nom: "COLLEGE PRIVE LES GENS DE LA MAISON", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY EN FACE GARAN-TSARETY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011139", nom: "COLLEGE PRIVE LES SERAPHINS I", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY CENTRE I", remarques: "FONCTIONNEL 24/25" },
  { code: "401011185", nom: "COLLEGE PRIVE PAPOOSE II", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011016", nom: "COLLEGE PRIVE RADAMA RASALIMO", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "AVARATRA I BIS", remarques: "FONCTIONNEL 24/25" },
  { code: "401011160", nom: "COLLEGE PRIVE SAINTE JEANNE D'ARC I", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "AMPARIHINGIDRO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011026", nom: "ECOLE PRIVEE CHRISTOLIVE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011148", nom: "ECOLE PRIVEE JOLY'S SCHOOL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401020203", nom: "ECOLE PRIVEE KIDS ACADEMY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011206", nom: "ECOLE PRIVEE LA BONNE BASE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "AMPARIHINGIDRO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011062", nom: "INSTITUTION NUR", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011007", nom: "LYCEE PRIVE L'AMITIE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "ANTANIMALANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011069", nom: "SEKOLY MAMPIATY MAHAJANGA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMALANDY", village: "CENTREIII ANTANIMANDY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011011", nom: "COLLEGE PRIVE MARIE AUXILIATRICE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011012", nom: "COLLEGE PRIVE MIHARISOA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "SECTEUR 5", remarques: "FONCTIONNEL 24/25" },
  { code: "401011044", nom: "ECOLE PRIVEE LAUREAT SCHOOL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "AMBALAMANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011207", nom: "ECOLE PRIVEE LE SOLEIL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "MAHATSINJO", remarques: "FONCTIONNEL 24/25" },
  { code: "401020302", nom: "ECOLE PRIVEE MAJHAND", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA", remarques: "FONCTIONNEL 24/25" },
  { code: "401020301", nom: "ECOLE PRIVEE MINI", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011140", nom: "ECOLE PRIVEE SAINTE THERESE DE L'ENFANT JESUS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA MAHAJANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401020303", nom: "ECOLE PRIVEE TSIMIALONJAFY", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "MAHATSINJO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011038", nom: "LYCEE PRIVE LA BONNE ETOILE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "ANTANIMASAJA", village: "ANTANIMASAJA SECTEUR 3", remarques: "FONCTIONNEL 24/25" },
  { code: "401010703", nom: "ECOLE PRIVEE FITAHIANA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "MANGA", village: "AMBOHIMANDAMINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011226", nom: "COLLEGE PRIVE ARC EN CIEL II", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "TANAMBAO SOTEMA", village: "TANAMBAO SOTEMA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011084", nom: "COLLEGE PRIVE LOHARANO", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "TANAMBAO SOTEMA", village: "TANAMBAO SOTEMA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011050", nom: "COLLEGE PRIVE MAHENINTSOA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO I", fokontany: "TANAMBAO SOTEMA", village: "AMPASIKA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011192", nom: "LYCEE PRIVE ARMANDINE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY SECTEUR II", remarques: "NON AFFILIÉ" },
  { code: "401011192", nom: "LYCEE PRIVE ARMANDINE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY SECTEUR II", remarques: "NON AFFILIÉ" },
  { code: "401011150", nom: "COLLEGE PRIVE CATHOLIQUE SAINT GEORGES", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011046", nom: "COLLEGE PRIVE EXCELLENT PETIT NID", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011020", nom: "COLLEGE PRIVE TSIRY", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011186", nom: "ECOLE PRIVEE CELESTE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011135", nom: "ECOLE PRIVEE CENTRE DE RECUPERATION SAINT MAURICE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011031", nom: "ECOLE PRIVEE FANOMEZANTSOA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011166", nom: "LYCEE PRIVE CATHOLIQUE VICTOIR RASOAMANARIVO", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011063", nom: "LYCEE PRIVE INSTITUTION PALMARES", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO AMBONY", village: "TSARARANO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011171", nom: "COLLEGE PRIVE LA ROMANCE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO ANOSIKELY", village: "TSARARANO ANOSIKELY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011170", nom: "ECOLE PRIVEE CATHOLIQUE SAINTE MARIE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO ANOSIKELY", village: "TSARARANO ANOSIKELY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011163", nom: "ECOLE PRIVEE FAHASOAVANA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "ANOSIKELY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011190", nom: "ECOLE PRIVEE MALAZARIVO", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO ANOSIKELY", village: "TSARARANO AMBONY", remarques: "NON AFFILIÉ" },
  { code: "401011236", nom: "ECOLE PRIVEE SAINT FRANCOIS D'ASSISE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO ANOSIKELY", village: "TSARARANO ANOSIKELY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011091", nom: "LYCEE PRIVE HARI-ELATRA", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHABIBO II", fokontany: "TSARARANO ANOSIKELY", village: "SECTEUR A", remarques: "FONCTIONNEL 24/25" },
  { code: "401020101", nom: "LYCEE PRIVE MASOANDRO", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMBOHIMANDAMINA", village: "MANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011204", nom: "COLLEGE PRIVE COCOON II AMBOVOALANANA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMBOVOALANANA", village: "AMBOVOALANANA", remarques: "NON AFFILIÉ" },
  { code: "401010201", nom: "ECOLE PRIVEE AVENIR DE LA FAMILLE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "ANTA", village: "ARANTA", remarques: "NON AFFILIÉ" },
  { code: "401011104", nom: "ECOLE PRIVEE SAINT ALPHONSE MARIE FUSCO", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "ANTA", village: "AMBALAHONKO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011143", nom: "COLLEGE PRIVE ARC EN CIEL", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "MAHAJANGA BE", remarques: "FONCTIONNEL 24/25" },
  { code: "401011220", nom: "ECOLE ANGLO FRANCO SCHOOL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "LA CORNICHE VILLA QUERCY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011003", nom: "ECOLE PRIVEE BOURHANI SCHOOL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "AMPASIKA", remarques: "NON AFFILIÉ" },
  { code: "401011228", nom: "ECOLE PRIVEE CHEICK ALI ALIMASSE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "AMPASIKA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011156", nom: "ECOLE PRIVEE LA RUCHE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "LA CORNICHE", remarques: "FONCTIONNEL 24/25" },
  { code: "401011179", nom: "ECOLE PRIVEE LA SPIRALE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "AMPASIKA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010401", nom: "ECOLE PRIVEE PLEIN SOLEIL", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "MAHAJANGA VILLE", remarques: "FONCTIONNEL 24/25" },
  { code: "401011149", nom: "LYCEE PRIVE AL-NOOR", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAJANGA VILLE", village: "RUE DU QUARTIER GENERAL", remarques: "FONCTIONNEL 24/25" },
  { code: "401011184", nom: "ECOLE PRIVEE LINDANGAYAH", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY ATSIMO", village: "TSARAMANDROSO CITE", remarques: "FONCTIONNEL 24/25" },
  { code: "401011058", nom: "ECOLE PRIVEE SOUVENIR", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY ATSIMO", village: "MAHAVOKY ATSIMO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011061", nom: "INSTITUTION NOBEL", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY ATSIMO", village: "MAHAVOKY ATSIMO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011111", nom: "COLLEGE PRIVE FANOLORANTSOA AGAPE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY AVARATRA", village: "SECTEUR II", remarques: "FONCTIONNEL 24/25" },
  { code: "401011175", nom: "ECOLE PRIVEE LA BELLE SOURCE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY AVARATRA", village: "MAHAVOKY AVARATRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011095", nom: "ECOLE PRIVEE LES FLAMBOYANTS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY AVARATRA", village: "JIRAMA AMBOABOAKA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011238", nom: "ECOLE PRIVEE NID DOUX", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAHAVOKY AVARATRA", village: "SECTEUR 7", remarques: "NON AFFILIÉ" },
  { code: "401011142", nom: "CAP ISA", secteur: "Privé", niveau: "Technique", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGA", village: "MANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011030", nom: "ECOLE PRIVEE FALINA MEJA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGA", village: "MANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010701", nom: "ECOLE PRIVEE ILOT DE TENDRESSE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGA", village: "MANGA", remarques: "NON AFFILIÉ" },
  { code: "401010702", nom: "ECOLE PRIVEE LES MEILLEURS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGA", village: "MANGA", remarques: "NON AFFILIÉ" },
  { code: "401011078", nom: "LYCEE PRIVE ADVENTISTE MAHAJANGA (LYPAM)", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGA", village: "MANGA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011024", nom: "COLLEGE PRIVE BAMBINO", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011152", nom: "COLLEGE PRIVE COCOON", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011015", nom: "COLLEGE PRIVE FJKM MANGARIVOTRA MAHAJANGA", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011173", nom: "ECOLE PRIVEE AVENIR DE L'OCEAN INDIEN", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011025", nom: "ECOLE PRIVEE CANAAN", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "AMBALANOMBY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011183", nom: "ECOLE PRIVEE COEUR D'ENFANTS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010802", nom: "ECOLE PRIVEE DAY-STAR", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "NON AFFILIÉ" },
  { code: "401011113", nom: "ECOLE PRIVEE LA FONTAINE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "ANTSAHAVAKY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011137", nom: "ECOLE PRIVEE LE PALAISA", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "ANTSAHAVAKY SECTION", remarques: "FONCTIONNEL 24/25" },
  { code: "401011200", nom: "ECOLE PRIVEE LE TRIOMPHE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "ANTSAHAVAKY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011109", nom: "ECOLE PRIVEE LES LUTINS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "AMBALANOMBY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011014", nom: "LYCEE PRIVE CATHOLIQUE MONTFORT SAINT GABRIEL", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401010801", nom: "LYCEE PRIVE ELITE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011145", nom: "LYCEE PRIVE FJKM ZIONA VAOVAO", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "AMPISIKINA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011065", nom: "LYCEE PRIVE NICOLETTA", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011066", nom: "LYCEE PRIVE NOTRE DAME", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011068", nom: "LYCEE PRIVE PAPOOSES", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011018", nom: "LYCEE PRIVE SAINTE JEANNE D'ARC", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANGARIVOTRA", village: "LA CARRIERE MANGARIVOTRA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011191", nom: "COLLEGE PRIVE JEDIDIAH SCHOOL", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANJARISOA", village: "MANJARISOA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011096", nom: "ECOLE ENFANTINE LA RIBAMBELLE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MANJARISOA", village: "MANJARISOA", remarques: "FONCTIONNEL 24/25" },
  { code: "401011005", nom: "COLLEGE PRIVE ESPOIR", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "MAROVATO ABATTOIR", village: "SECTEUR 6", remarques: "FONCTIONNEL 24/25" },
  { code: "401011180", nom: "COLLEGE PRIVE LE GENIE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "LOT 06 A TSARAMANDROSO AMBANY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011101", nom: "COLLEGE PRIVE LES CHERUBINS", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "SECTEUR 3", remarques: "FONCTIONNEL 24/25" },
  { code: "401011197", nom: "ECOLE PRIVEE LA CIGOGNE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "TSARAMANDROSO AMBANY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011107", nom: "ECOLE PRIVEE LES PETITS MARCELLIN'S", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "TSARAMANDROSO AMBANY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011159", nom: "LYCEE PRIVE FANAMBINANA", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "MAHAJANGA", remarques: "NON AFFILIÉ" },
  { code: "401011125", nom: "LYCEE PRIVE LOVASOA", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBANY", village: "TSARAMANDROSO AMBANY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011102", nom: "COEUR IMMACULEE DE MARIE", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011301", nom: "COLLEGE PRIVE YAL SHY SY", secteur: "Privé", niveau: "Collège", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011230", nom: "ECOLE PRIVEE FJKM EXELLANCE", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO", remarques: "FONCTIONNEL 24/25" },
  { code: "401011202", nom: "ECOLE PRIVEE LES OISILLONS", secteur: "Privé", niveau: "Primaire", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011157", nom: "LYCEE PRIVE ALADIN", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "SECTEUR 8-TSARAMANDROSO AMBONY", remarques: "FONCTIONNEL 24/25" },
  { code: "401011192", nom: "LYCEE PRIVE ARMANDINE", secteur: "Privé", niveau: "Lycée", commune: "CU MAHAJANGA", zap: "MAHAJANGA", fokontany: "TSARAMANDROSO AMBONY", village: "TSARAMANDROSO AMBONY SECTEUR II", remarques: "NON AFFILIÉ" }
];


async function importerEtablissementsSansDoublons() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sisco_db'
    });

    try {
        console.log('🚀 Début de l\'importation des établissements...');
        
        // Vider la table d'abord pour éviter les doublons
        await connection.execute('DELETE FROM etablissements');
        console.log('✅ Table etablissements vidée');
        
        let compteur = 0;
        let erreurs = 0;
        
        for (const etab of etablissements) {
            // Nettoyer les données
            const code = etab.code.trim();
            const nom = etab.nom.trim();
            const login = `etab_${code}`;
            
            try {
                await connection.execute(
                    `INSERT INTO etablissements 
                    (code, nom, secteur, niveau, commune, zap, fokontany, village, remarques, login, password) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                console.log(`✓ ${nom} importé`);
            } catch (error) {
                erreurs++;
                console.log(`✗ Erreur avec ${nom}:`, error.message);
            }
        }
        
        console.log(`\n📊 RÉSULTAT FINAL:`);
        console.log(`✅ ${compteur} établissements importés avec succès`);
        console.log(`❌ ${erreurs} erreurs`);
        
        // Vérification finale
        const [result] = await connection.execute('SELECT COUNT(*) as total FROM etablissements');
        console.log(`🔍 Total dans la base: ${result[0].total} établissements`);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error);
    } finally {
        await connection.end();
    }
}

importerEtablissementsSansDoublons();