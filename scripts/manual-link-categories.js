import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const data = {
  "hitachi-seaside-park": [1918, 1920, 1948, 1952, 1954, 1957, 2041, 1970, 1971],
  "kairaku-en": [1918, 1948, 1949, 1954, 1955, 1970, 1972, 1987],
  "mont-tsukuba": [1918, 1919, 1920, 1921, 1948, 1950, 1951, 1952, 1961, 1970, 1973, 2011],
  "kashima-jingu": [1949, 1950, 1955, 1970, 1972, 1973, 1977, 2011],
  "grand-bouddha-ushiku": [1918, 1919, 1949, 1950, 1954, 1970, 1973, 1974, 2041],
  "chutes-fukuroda": [1920, 1921, 1948, 1952, 1970, 1974, 1975],
  "kasama-inari": [1920, 1949, 1950, 1970, 1973, 1977, 2006, 2011],
  "oarai-isosaki": [1949, 1950, 1952, 1970, 1971, 1973, 1975, 1988, 2011],
  "aqua-world-oarai": [1949, 1959, 2041, 1970, 1976, 2043],
  "lac-kasumigaura": [1919, 1948, 1957, 1958, 1970, 2007]
};

async function main() {
  console.log("Starting manual linking of places to categories...");

  for (const [placeId, categoryIds] of Object.entries(data)) {
    console.log(`Linking ${placeId} to categories: ${categoryIds.join(', ')}`);
    
    try {
      await prisma.place.update({
        where: { id: placeId },
        data: {
          categories: {
            set: categoryIds.map(id => ({ id }))
          }
        }
      });
      console.log(`Successfully updated ${placeId}`);
    } catch (error) {
      console.error(`Error updating ${placeId}:`, error.message);
    }
  }

  console.log("Finished manual linking.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
