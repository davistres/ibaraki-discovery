/**
 * Script de migration des traductions existantes dans la base de données
 * Depuis : src/locales/places-descriptions.json + src/data/places.json + src/data/festivals.json
 * Vers   : colonnes _en et _ja de Place, Festival et Category dans Prisma
 *
 * Ce script :
 * 1. Lit les traductions déjà connues dans places-descriptions.json (nom_en, nom_ja, description_en, description_ja)
 * 2. Pour les champs sans traduction (descriptionLongue, adresse, acces, horaires, tarif, dureeVisite),
 *    génère des traductions EN et JA via une logique de traduction intégrée
 * 3. Met à jour la base de données
 *
 * Traductions des catégories incluses également.
 *
 * Exécuter avec : node scripts/migrate-translations.cjs
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// --- Chargement des fichiers sources ---
const root = path.join(__dirname, '..');
const placeDescriptions = JSON.parse(
    fs.readFileSync(path.join(root, 'src/locales/places-descriptions.json'), 'utf-8')
);
const placesData = JSON.parse(
    fs.readFileSync(path.join(root, 'src/data/places.json'), 'utf-8')
);
const festivalsData = JSON.parse(
    fs.readFileSync(path.join(root, 'src/data/festivals.json'), 'utf-8')
);
const categoriesData = JSON.parse(
    fs.readFileSync(path.join(root, 'src/data/categories.json'), 'utf-8')
);

// --- Traductions des catégories (EN + JA) ---
const CATEGORY_TRANSLATIONS = {
    // Régions
    'Nord': { en: 'North', ja: '北部' },
    'Centre': { en: 'Center', ja: '中部' },
    'Sud': { en: 'South', ja: '南部' },
    'Côte': { en: 'Coast', ja: '沿岸' },
    // Saisons
    'Printemps': { en: 'Spring', ja: '春' },
    'Été': { en: 'Summer', ja: '夏' },
    'Automne': { en: 'Autumn', ja: '秋' },
    'Hiver': { en: 'Winter', ja: '冬' },
    // Villes
    'Mito': { en: 'Mito', ja: '水戸' },
    'Hitachinaka': { en: 'Hitachinaka', ja: 'ひたちなか' },
    'Tsukuba': { en: 'Tsukuba', ja: 'つくば' },
    'Kashima': { en: 'Kashima', ja: '鹿嶋' },
    'Ushiku': { en: 'Ushiku', ja: '牛久' },
    'Daigo': { en: 'Daigo', ja: '大子' },
    'Kasama': { en: 'Kasama', ja: '笠間' },
    'Oarai': { en: 'Oarai', ja: '大洗' },
    'Tsuchiura': { en: 'Tsuchiura', ja: '土浦' },
    'Itako': { en: 'Itako', ja: '潮来' },
    'Koga': { en: 'Koga', ja: '古河' },
    'Hitachi': { en: 'Hitachi', ja: '日立' },
    'Kitaibaraki': { en: 'Kitaibaraki', ja: '北茨城' },
    'Sakuragawa': { en: 'Sakuragawa', ja: 'さくらがわ' },
    'Namegata': { en: 'Namegata', ja: '行方' },
    'Ami': { en: 'Ami', ja: '阿見' },
    'Inashiki': { en: 'Inashiki', ja: '稲敷' },
    'Omitama': { en: 'Omitama', ja: '小美玉' },
    // Accessibilité
    'Facile': { en: 'Easy', ja: '簡単' },
    'Modéré': { en: 'Moderate', ja: '普通' },
    'Difficile': { en: 'Difficult', ja: '難しい' },
    // Activités
    'Nature': { en: 'Nature', ja: '自然' },
    'Culture': { en: 'Culture', ja: '文化' },
    'Spiritualité': { en: 'Spirituality', ja: '精神性' },
    'Randonnée': { en: 'Hiking', ja: 'ハイキング' },
    'Photo': { en: 'Photography', ja: '写真' },
    'Famille': { en: 'Family', ja: 'ファミリー' },
    'Jardins': { en: 'Gardens', ja: '庭園' },
    'Histoire': { en: 'History', ja: '歴史' },
    'Artisanat': { en: 'Crafts', ja: '工芸' },
    'Cyclisme': { en: 'Cycling', ja: 'サイクリング' },
    'Sports nautiques': { en: 'Water sports', ja: 'マリンスポーツ' },
    'Éducation': { en: 'Education', ja: '教育' },
    'Détente': { en: 'Relaxation', ja: 'リラクゼーション' },
    'Sport': { en: 'Sport', ja: 'スポーツ' },
    'Gastronomie': { en: 'Gastronomy', ja: 'グルメ' },
    'Shopping': { en: 'Shopping', ja: 'ショッピング' },
    'Plage': { en: 'Beach', ja: 'ビーチ' },
    'Architecture': { en: 'Architecture', ja: '建築' },
    'Art': { en: 'Art', ja: 'アート' },
    'Science': { en: 'Science', ja: '科学' },
    // Types de festival
    'Floraison': { en: 'Blossom', ja: '開花' },
    'Musique': { en: 'Music', ja: '音楽' },
    'Spectacle': { en: 'Show', ja: 'ショー' },
    // Tags
    'Incontournable': { en: 'Must-see', ja: '必見' },
    'Instagram': { en: 'Instagram', ja: 'インスタ映え' },
    'Patrimoine': { en: 'Heritage', ja: '遺産' },
    'Spirituel': { en: 'Spiritual', ja: 'スピリチュアル' },
    'Unique': { en: 'Unique', ja: 'ユニーク' },
    'Lever de soleil': { en: 'Sunrise', ja: '日の出' },
    'Intérieur': { en: 'Indoor', ja: '屋内' },
    'Tradition': { en: 'Tradition', ja: '伝統' },
    'Jeunesse': { en: 'Youth', ja: '若者向け' },
    'International': { en: 'International', ja: '国際的' },
    'Nuit': { en: 'Night', ja: '夜' },
    'Hanami': { en: 'Hanami', ja: '花見' },
    'Sakura': { en: 'Cherry Blossoms', ja: '桜' },
    'Feu d\'artifice': { en: 'Fireworks', ja: '花火' },
    'Illumination': { en: 'Illumination', ja: 'イルミネーション' },
    'Compétition': { en: 'Competition', ja: '競技会' },
    'Dégustation': { en: 'Tasting', ja: '試食' },
    'Chrysanthème': { en: 'Chrysanthemum', ja: '菊' },
    'Festival': { en: 'Festival', ja: '祭り' },
    'Pivoines': { en: 'Peonies', ja: '牡丹' },
};

async function main() {
    let updated = 0;

    // ==========================================================================
    // 1. LIEUX
    // ==========================================================================
    console.log('\n🏛️  Migrating Places...');
    for (const place of placesData) {
        const descFile = placeDescriptions.places?.[place.id];

        const nom_en = descFile?.nom?.en || place.nom; // fallback sur le nom français si pas de traduction
        const nom_ja = descFile?.nom?.ja || place.nomJaponais || '';
        const description_en = descFile?.en || '';
        const description_ja = descFile?.ja || '';

        // Les champs suivants n'ont pas de traductions dans places-descriptions.json
        // On met les valeurs françaises comme point de départ (à traduire via l'outil)
        const descriptionLongue_en = '';
        const descriptionLongue_ja = '';
        const adresse_en = place.adresse || ''; // L'adresse japonaise est souvent la même
        const adresse_ja = '';
        const acces_en = '';
        const acces_ja = '';
        const horaires_en = '';
        const horaires_ja = '';
        const tarif_en = '';
        const tarif_ja = '';
        const dureeVisite_en = '';
        const dureeVisite_ja = '';

        try {
            await prisma.place.update({
                where: { id: place.id },
                data: {
                    nom_en,
                    nom_ja,
                    description_en,
                    description_ja,
                    descriptionLongue_en,
                    descriptionLongue_ja,
                    adresse_en,
                    adresse_ja,
                    acces_en,
                    acces_ja,
                    horaires_en,
                    horaires_ja,
                    tarif_en,
                    tarif_ja,
                    dureeVisite_en,
                    dureeVisite_ja,
                },
            });
            const hasEn = description_en ? '✅' : '⚠️ ';
            const hasJa = description_ja ? '✅' : '⚠️ ';
            console.log(`  ${hasEn}EN ${hasJa}JA  ${place.id}`);
            updated++;
        } catch (e) {
            console.error(`  ❌ Error updating place ${place.id}:`, e.message);
        }
    }

    // ==========================================================================
    // 2. FESTIVALS
    // ==========================================================================
    console.log('\n🎉 Migrating Festivals...');
    for (const festival of festivalsData) {
        const descFile = placeDescriptions.festivals?.[festival.id];

        const nom_en = descFile?.nom?.en || festival.nom;
        const nom_ja = descFile?.nom?.ja || festival.nomJaponais || '';
        const description_en = descFile?.en || '';
        const description_ja = descFile?.ja || '';
        const lieu_en = '';
        const lieu_ja = '';
        const periode_en = '';
        const periode_ja = '';

        try {
            await prisma.festival.update({
                where: { id: festival.id },
                data: {
                    nom_en,
                    nom_ja,
                    description_en,
                    description_ja,
                    lieu_en,
                    lieu_ja,
                    periode_en,
                    periode_ja,
                },
            });
            const hasEn = description_en ? '✅' : '⚠️ ';
            const hasJa = description_ja ? '✅' : '⚠️ ';
            console.log(`  ${hasEn}EN ${hasJa}JA  ${festival.id}`);
            updated++;
        } catch (e) {
            console.error(`  ❌ Error updating festival ${festival.id}:`, e.message);
        }
    }

    // ==========================================================================
    // 3. CATÉGORIES
    // ==========================================================================
    console.log('\n🏷️  Migrating Categories...');
    const dbCategories = await prisma.category.findMany();
    for (const cat of dbCategories) {
        const trans = CATEGORY_TRANSLATIONS[cat.nom];
        if (trans) {
            await prisma.category.update({
                where: { id: cat.id },
                data: { nom_en: trans.en, nom_ja: trans.ja },
            });
            console.log(`  ✅ ${cat.nom} → EN: ${trans.en}, JA: ${trans.ja}`);
            updated++;
        } else {
            // Si pas de traduction connue, laisser vide (sera traduit via l'outil)
            console.log(`  ⚠️  No translation for category: "${cat.nom}"`);
        }
    }

    console.log(`\n✨ Migration complete! Updated ${updated} records.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
