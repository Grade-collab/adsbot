/*
  Warnings:

  - A unique constraint covering the columns `[prefix,siteId]` on the table `SubDomain` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubDomain_prefix_key";

-- CreateIndex
CREATE UNIQUE INDEX "SubDomain_prefix_siteId_key" ON "SubDomain"("prefix", "siteId");
