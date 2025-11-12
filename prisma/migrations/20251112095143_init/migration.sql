-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group" TEXT NOT NULL,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "nomJaponais" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionLongue" TEXT NOT NULL,
    "imagePrincipale" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "horaires" TEXT NOT NULL,
    "tarif" TEXT NOT NULL,
    "dureeVisite" TEXT NOT NULL,
    "acces" TEXT NOT NULL,
    "siteWeb" TEXT NOT NULL,
    "googleMaps" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    "accessibilite_id" INTEGER NOT NULL,
    CONSTRAINT "Place_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Place_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Place_accessibilite_id_fkey" FOREIGN KEY ("accessibilite_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "nomJaponais" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "mois" TEXT NOT NULL,
    "activites" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "ville_id" INTEGER NOT NULL,
    CONSTRAINT "Festival_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Festival_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToPlace" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToFestival" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToFestival_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToFestival_B_fkey" FOREIGN KEY ("B") REFERENCES "Festival" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_id_key" ON "Place"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Festival_id_key" ON "Festival"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPlace_AB_unique" ON "_CategoryToPlace"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPlace_B_index" ON "_CategoryToPlace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFestival_AB_unique" ON "_CategoryToFestival"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFestival_B_index" ON "_CategoryToFestival"("B");
