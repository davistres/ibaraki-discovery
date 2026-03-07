-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nom_en" TEXT NOT NULL DEFAULT '',
    "nom_ja" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Category" ("group", "id", "nom") SELECT "group", "id", "nom" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
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
    "nom_ja" TEXT NOT NULL DEFAULT '',
    "description_ja" TEXT NOT NULL DEFAULT '',
    "lieu_ja" TEXT NOT NULL DEFAULT '',
    "periode_ja" TEXT NOT NULL DEFAULT '',
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    CONSTRAINT "Festival_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Festival_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Festival" ("activites", "description", "id", "image", "lat", "lieu", "lng", "mois", "nom", "nomJaponais", "periode", "region_id", "ville_id") SELECT "activites", "description", "id", "image", "lat", "lieu", "lng", "mois", "nom", "nomJaponais", "periode", "region_id", "ville_id" FROM "Festival";
DROP TABLE "Festival";
ALTER TABLE "new_Festival" RENAME TO "Festival";
CREATE UNIQUE INDEX "Festival_id_key" ON "Festival"("id");
CREATE TABLE "new_Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "nomJaponais" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionLongue" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "acces" TEXT NOT NULL,
    "horaires" TEXT NOT NULL,
    "tarif" TEXT NOT NULL,
    "dureeVisite" TEXT NOT NULL,
    "nom_en" TEXT NOT NULL DEFAULT '',
    "description_en" TEXT NOT NULL DEFAULT '',
    "descriptionLongue_en" TEXT NOT NULL DEFAULT '',
    "adresse_en" TEXT NOT NULL DEFAULT '',
    "acces_en" TEXT NOT NULL DEFAULT '',
    "horaires_en" TEXT NOT NULL DEFAULT '',
    "tarif_en" TEXT NOT NULL DEFAULT '',
    "dureeVisite_en" TEXT NOT NULL DEFAULT '',
    "nom_ja" TEXT NOT NULL DEFAULT '',
    "description_ja" TEXT NOT NULL DEFAULT '',
    "descriptionLongue_ja" TEXT NOT NULL DEFAULT '',
    "adresse_ja" TEXT NOT NULL DEFAULT '',
    "acces_ja" TEXT NOT NULL DEFAULT '',
    "horaires_ja" TEXT NOT NULL DEFAULT '',
    "tarif_ja" TEXT NOT NULL DEFAULT '',
    "dureeVisite_ja" TEXT NOT NULL DEFAULT '',
    "imagePrincipale" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "siteWeb" TEXT NOT NULL,
    "googleMaps" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    "accessibilite_id" INTEGER NOT NULL,
    CONSTRAINT "Place_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Place_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Place_accessibilite_id_fkey" FOREIGN KEY ("accessibilite_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Place" ("acces", "accessibilite_id", "adresse", "description", "descriptionLongue", "dureeVisite", "googleMaps", "horaires", "id", "imagePrincipale", "images", "lat", "lng", "nom", "nomJaponais", "region_id", "siteWeb", "tarif", "ville_id") SELECT "acces", "accessibilite_id", "adresse", "description", "descriptionLongue", "dureeVisite", "googleMaps", "horaires", "id", "imagePrincipale", "images", "lat", "lng", "nom", "nomJaponais", "region_id", "siteWeb", "tarif", "ville_id" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
CREATE UNIQUE INDEX "Place_id_key" ON "Place"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
