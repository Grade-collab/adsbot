/*
  Warnings:

  - A unique constraint covering the columns `[telegramId]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegramId` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "telegramId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Worker_telegramId_key" ON "Worker"("telegramId");
