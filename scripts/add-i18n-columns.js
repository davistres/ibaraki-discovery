/**
 * Script pour ajouter les colonnes i18n (_en, _ja) à la base SQLite
 * directement, sans passer par le client Prisma (qui peut être verrouillé).
 * Exécuter avec : node scripts/add-i18n-columns.js
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'prisma', 'dev.db');

const db = new Database(dbPath);

// Helper pour ajouter une colonne si elle n'existe pas
function addColumnIfNotExists(table, column, type = 'TEXT', defaultVal = "''") {
    const cols = db.pragma(`table_info(${table})`);
    const exists = cols.some(c => c.name === column);
    if (!exists) {
        db.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type} NOT NULL DEFAULT ${defaultVal}`);
        console.log(`✅ Added ${table}.${column}`);
    } else {
        console.log(`⏭️  Already exists: ${table}.${column}`);
    }
}

console.log('📦 Adding i18n columns to Place...');
const placeColumns = [
    'nom_en', 'description_en', 'descriptionLongue_en', 'adresse_en',
    'acces_en', 'horaires_en', 'tarif_en', 'dureeVisite_en',
    'nom_ja', 'description_ja', 'descriptionLongue_ja', 'adresse_ja',
    'acces_ja', 'horaires_ja', 'tarif_ja', 'dureeVisite_ja',
];
for (const col of placeColumns) addColumnIfNotExists('Place', col);

console.log('\n📦 Adding i18n columns to Festival...');
const festivalColumns = [
    'nom_en', 'description_en', 'lieu_en', 'periode_en',
    'nom_ja', 'description_ja', 'lieu_ja', 'periode_ja',
];
for (const col of festivalColumns) addColumnIfNotExists('Festival', col);

console.log('\n📦 Adding i18n columns to Category...');
addColumnIfNotExists('Category', 'nom_en');
addColumnIfNotExists('Category', 'nom_ja');

db.close();
console.log('\n✨ Done! All i18n columns added to the database.');
