/**
 * Script pour ajouter les colonnes i18n via PrismaClient $executeRawUnsafe
 * Exécuter avec : node --experimental-vm-modules scripts/add-i18n-columns.cjs
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addColumnIfNotExists(table, column) {
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE "${table}" ADD COLUMN "${column}" TEXT NOT NULL DEFAULT ''`
        );
        console.log(`✅ Added ${table}.${column}`);
    } catch (e) {
        if (e.message && e.message.includes('duplicate column name')) {
            console.log(`⏭️  Already exists: ${table}.${column}`);
        } else {
            throw e;
        }
    }
}

async function main() {
    console.log('📦 Adding i18n columns to Place...');
    const placeColumns = [
        'nom_en', 'description_en', 'descriptionLongue_en', 'adresse_en',
        'acces_en', 'horaires_en', 'tarif_en', 'dureeVisite_en',
        'nom_ja', 'description_ja', 'descriptionLongue_ja', 'adresse_ja',
        'acces_ja', 'horaires_ja', 'tarif_ja', 'dureeVisite_ja',
    ];
    for (const col of placeColumns) {
        await addColumnIfNotExists('Place', col);
    }

    console.log('\n📦 Adding i18n columns to Festival...');
    const festivalColumns = [
        'nom_en', 'description_en', 'lieu_en', 'periode_en',
        'nom_ja', 'description_ja', 'lieu_ja', 'periode_ja',
    ];
    for (const col of festivalColumns) {
        await addColumnIfNotExists('Festival', col);
    }

    console.log('\n📦 Adding i18n columns to Category...');
    await addColumnIfNotExists('Category', 'nom_en');
    await addColumnIfNotExists('Category', 'nom_ja');

    console.log('\n✨ Done! All i18n columns added.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
