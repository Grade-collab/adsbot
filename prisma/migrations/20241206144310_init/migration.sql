/*
  Warnings:

  - A unique constraint covering the columns `[prefix]` on the table `SubDomain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefix` to the `SubDomain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubDomain" ADD COLUMN     "prefix" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubDomain_prefix_key" ON "SubDomain"("prefix");
