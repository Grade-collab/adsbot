/*
  Warnings:

  - A unique constraint covering the columns `[cfId]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cfId` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "cfId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Domain_cfId_key" ON "Domain"("cfId");
