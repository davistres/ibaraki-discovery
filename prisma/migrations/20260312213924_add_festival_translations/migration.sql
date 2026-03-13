-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Festival" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "nomJaponais" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "mois" TEXT NOT NULL,
    "activites" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "lat" REAL NOT NULL DEFAULT 0,
    "lng" REAL NOT NULL DEFAULT 0,
    "nom_en" TEXT NOT NULL DEFAULT '',
    "description_en" TEXT NOT NULL DEFAULT '',
    "lieu_en" TEXT NOT NULL DEFAULT '',
    "periode_en" TEXT NOT NULL DEFAULT '',
    "mois_en" TEXT NOT NULL DEFAULT '',
    "activites_en" TEXT NOT NULL DEFAULT '',
    "nom_ja" TEXT NOT NULL DEFAULT '',
    "description_ja" TEXT NOT NULL DEFAULT '',
    "lieu_ja" TEXT NOT NULL DEFAULT '',
    "periode_ja" TEXT NOT NULL DEFAULT '',
    "mois_ja" TEXT NOT NULL DEFAULT '',
    "activites_ja" TEXT NOT NULL DEFAULT '',
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    CONSTRAINT "Festival_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Festival_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Festival" ("activites", "description", "description_en", "description_ja", "id", "image", "lat", "lieu", "lieu_en", "lieu_ja", "lng", "mois", "nom", "nomJaponais", "nom_en", "nom_ja", "periode", "periode_en", "periode_ja", "region_id", "ville_id") SELECT "activites", "description", "description_en", "description_ja", "id", "image", "lat", "lieu", "lieu_en", "lieu_ja", "lng", "mois", "nom", "nomJaponais", "nom_en", "nom_ja", "periode", "periode_en", "periode_ja", "region_id", "ville_id" FROM "Festival";
DROP TABLE "Festival";
ALTER TABLE "new_Festival" RENAME TO "Festival";
CREATE UNIQUE INDEX "Festival_id_key" ON "Festival"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
