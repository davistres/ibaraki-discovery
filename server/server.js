import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- Helper: pick the right language fields for a Place ---
function localizePlace(place, lang) {
  const l = lang === 'en' || lang === 'ja' ? lang : null;
  if (!l) return place; // French = original fields, no change

  return {
    ...place,
    nom: place[`nom_${l}`] || place.nom,
    description: place[`description_${l}`] || place.description,
    descriptionLongue: place[`descriptionLongue_${l}`] || place.descriptionLongue,
    adresse: place[`adresse_${l}`] || place.adresse,
    acces: place[`acces_${l}`] || place.acces,
    horaires: place[`horaires_${l}`] || place.horaires,
    tarif: place[`tarif_${l}`] || place.tarif,
    dureeVisite: place[`dureeVisite_${l}`] || place.dureeVisite,
  };
}

// --- Helper: pick the right language fields for a Festival ---
function localizeFestival(festival, lang) {
  const l = lang === 'en' || lang === 'ja' ? lang : null;
  if (!l) return festival;

  return {
    ...festival,
    nom: festival[`nom_${l}`] || festival.nom,
    description: festival[`description_${l}`] || festival.description,
    lieu: festival[`lieu_${l}`] || festival.lieu,
    periode: festival[`periode_${l}`] || festival.periode,
    mois: festival[`mois_${l}`] || festival.mois,
    activites: festival[`activites_${l}`] || festival.activites,
  };
}

// --- Helper: localize a Category ---
function localizeCategory(cat, lang) {
  const l = lang === 'en' || lang === 'ja' ? lang : null;
  if (!l) return cat;
  return { ...cat, nom: cat[`nom_${l}`] || cat.nom };
}

// ============================================================
// GET /api/places?lang=fr|en|ja
// ============================================================
app.get('/api/places', async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const places = await prisma.place.findMany({
      include: {
        region: true,
        ville: true,
        accessibilite: true,
        categories: true,
      },
    });
    const localized = places.map(p => {
      const loc = localizePlace(p, lang);
      return {
        ...loc,
        region: localizeCategory(p.region, lang),
        ville: localizeCategory(p.ville, lang),
        accessibilite: localizeCategory(p.accessibilite, lang),
        categories: p.categories.map(c => localizeCategory(c, lang)),
      };
    });
    res.json(localized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// ============================================================
// GET /api/places/:id?lang=fr|en|ja
// ============================================================
app.get('/api/places/:id', async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const place = await prisma.place.findUnique({
      where: { id: req.params.id },
      include: {
        region: true,
        ville: true,
        accessibilite: true,
        categories: true,
      },
    });
    if (!place) return res.status(404).json({ error: 'Place not found' });
    const loc = localizePlace(place, lang);
    res.json({
      ...loc,
      region: localizeCategory(place.region, lang),
      ville: localizeCategory(place.ville, lang),
      accessibilite: localizeCategory(place.accessibilite, lang),
      categories: place.categories.map(c => localizeCategory(c, lang)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

// ============================================================
// PUT /api/places/:id/translations  { nom_en, description_en, ... }
// ============================================================
app.put('/api/places/:id/translations', async (req, res) => {
  try {
    const allowed = [
      'nom_en', 'description_en', 'descriptionLongue_en', 'adresse_en',
      'acces_en', 'horaires_en', 'tarif_en', 'dureeVisite_en',
      'nom_ja', 'description_ja', 'descriptionLongue_ja', 'adresse_ja',
      'acces_ja', 'horaires_ja', 'tarif_ja', 'dureeVisite_ja',
    ];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    const updated = await prisma.place.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, id: updated.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update translations' });
  }
});

// ============================================================
// GET /api/festivals?lang=fr|en|ja
// ============================================================
app.get('/api/festivals', async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const festivals = await prisma.festival.findMany({
      include: { region: true, ville: true, categories: true },
    });
    const localized = festivals.map(f => {
      const loc = localizeFestival(f, lang);
      return {
        ...loc,
        region: localizeCategory(f.region, lang),
        ville: localizeCategory(f.ville, lang),
        categories: f.categories.map(c => localizeCategory(c, lang)),
      };
    });
    res.json(localized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch festivals' });
  }
});

// ============================================================
// GET /api/festivals/:id?lang=fr|en|ja
// ============================================================
app.get('/api/festivals/:id', async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const festival = await prisma.festival.findUnique({
      where: { id: req.params.id },
      include: { region: true, ville: true, categories: true },
    });
    if (!festival) return res.status(404).json({ error: 'Festival not found' });
    const loc = localizeFestival(festival, lang);
    res.json({
      ...loc,
      region: localizeCategory(festival.region, lang),
      ville: localizeCategory(festival.ville, lang),
      categories: festival.categories.map(c => localizeCategory(c, lang)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch festival' });
  }
});

// ============================================================
// PUT /api/festivals/:id/translations
// ============================================================
app.put('/api/festivals/:id/translations', async (req, res) => {
  try {
    const allowed = [
      'nom_en', 'description_en', 'lieu_en', 'periode_en', 'mois_en', 'activites_en',
      'nom_ja', 'description_ja', 'lieu_ja', 'periode_ja', 'mois_ja', 'activites_ja',
    ];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    const updated = await prisma.festival.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, id: updated.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update festival translations' });
  }
});

// ============================================================
// GET /api/categories
// ============================================================
app.get('/api/categories', async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const categories = await prisma.category.findMany();
    res.json(categories.map(c => localizeCategory(c, lang)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ============================================================
// PUT /api/categories/:id/translations
// ============================================================
app.put('/api/categories/:id/translations', async (req, res) => {
  try {
    const { nom_en, nom_ja } = req.body;
    const updated = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { nom_en: nom_en ?? undefined, nom_ja: nom_ja ?? undefined },
    });
    res.json({ success: true, id: updated.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category translations' });
  }
});

// ============================================================
// Distance endpoints (unchanged)
// ============================================================
app.get('/api/distances/:fromType/:fromId/:toType/:toId', async (req, res) => {
  try {
    const { fromType, fromId, toType, toId } = req.params;
    const distance = await prisma.distance.findUnique({
      where: { fromType_fromId_toType_toId: { fromType, fromId, toType, toId } },
    });
    if (!distance) return res.status(404).json({ error: 'Distance not found' });
    res.json(distance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distance' });
  }
});

app.get('/api/distances/from/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const distances = await prisma.distance.findMany({
      where: { fromType: type, fromId: id },
      orderBy: { distanceKm: 'asc' },
    });
    res.json(distances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distances' });
  }
});

app.get('/api/distances/matrix', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: 'Missing ids parameter' });
    const locationIds = ids.split(',');
    const distances = await prisma.distance.findMany({
      where: {
        AND: [
          { OR: locationIds.map(id => ({ fromId: id })) },
          { OR: locationIds.map(id => ({ toId: id })) },
        ],
      },
    });
    res.json(distances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distance matrix' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
