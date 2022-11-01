/*
  Warnings:

  - Added the required column `slug` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "avatar" TEXT NOT NULL,
    "quote" TEXT,
    "nationality" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("avatar", "createdAt", "id", "name", "nationality", "quote", "title", "updatedAt") SELECT "avatar", "createdAt", "id", "name", "nationality", "quote", "title", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
