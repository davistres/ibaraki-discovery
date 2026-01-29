import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint to get all places
app.get('/api/places', async (req, res) => {
  try {
    const places = await prisma.place.findMany({
      include: {
        region: true,
        ville: true,
        accessibilite: true,
        categories: true,
      },
    });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Endpoint to get all festivals
app.get('/api/festivals', async (req, res) => {
  try {
    const festivals = await prisma.festival.findMany({
      include: {
        region: true,
        ville: true,
        categories: true,
      },
    });
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch festivals' });
  }
});

// Endpoint to get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/distances/:fromType/:fromId/:toType/:toId', async (req, res) => {
  try {
    const { fromType, fromId, toType, toId } = req.params;

    const distance = await prisma.distance.findUnique({
      where: {
        fromType_fromId_toType_toId: {
          fromType,
          fromId,
          toType,
          toId
        }
      }
    });

    if (!distance) {
      return res.status(404).json({ error: 'Distance not found' });
    }

    res.json(distance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distance' });
  }
});

app.get('/api/distances/from/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;

    const distances = await prisma.distance.findMany({
      where: {
        fromType: type,
        fromId: id
      },
      orderBy: {
        distanceKm: 'asc'
      }
    });

    res.json(distances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distances' });
  }
});

app.get('/api/distances/matrix', async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: 'Missing ids parameter' });
    }

    const locationIds = ids.split(',');

    const distances = await prisma.distance.findMany({
      where: {
        AND: [
          {
            OR: locationIds.map(id => ({ fromId: id }))
          },
          {
            OR: locationIds.map(id => ({ toId: id }))
          }
        ]
      }
    });

    res.json(distances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distance matrix' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
