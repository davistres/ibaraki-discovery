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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
