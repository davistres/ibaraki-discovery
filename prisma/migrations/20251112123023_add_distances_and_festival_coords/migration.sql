-- CreateTable
CREATE TABLE "Distance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromType" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toType" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "placeFromId" TEXT,
    "placeToId" TEXT,
    "festivalFromId" TEXT,
    "festivalToId" TEXT,
    CONSTRAINT "Distance_placeFromId_fkey" FOREIGN KEY ("placeFromId") REFERENCES "Place" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Distance_placeToId_fkey" FOREIGN KEY ("placeToId") REFERENCES "Place" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Distance_festivalFromId_fkey" FOREIGN KEY ("festivalFromId") REFERENCES "Festival" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Distance_festivalToId_fkey" FOREIGN KEY ("festivalToId") REFERENCES "Festival" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    CONSTRAINT "Festival_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Festival_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Festival" ("activites", "description", "id", "image", "lieu", "mois", "nom", "nomJaponais", "periode", "region_id", "ville_id") SELECT "activites", "description", "id", "image", "lieu", "mois", "nom", "nomJaponais", "periode", "region_id", "ville_id" FROM "Festival";
DROP TABLE "Festival";
ALTER TABLE "new_Festival" RENAME TO "Festival";
CREATE UNIQUE INDEX "Festival_id_key" ON "Festival"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Distance_fromType_fromId_toType_toId_key" ON "Distance"("fromType", "fromId", "toType", "toId");
