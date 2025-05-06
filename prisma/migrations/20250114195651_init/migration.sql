/*
  Warnings:

  - A unique constraint covering the columns `[secretKey]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "secretKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Worker_secretKey_key" ON "Worker"("secretKey");
