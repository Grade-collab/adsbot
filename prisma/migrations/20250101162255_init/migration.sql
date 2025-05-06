/*
  Warnings:

  - A unique constraint covering the columns `[passCodeId]` on the table `Log` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "passCodeId" TEXT;

-- CreateTable
CREATE TABLE "PassCode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workerId" INTEGER,

    CONSTRAINT "PassCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Log_passCodeId_key" ON "Log"("passCodeId");

-- AddForeignKey
ALTER TABLE "PassCode" ADD CONSTRAINT "PassCode_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_passCodeId_fkey" FOREIGN KEY ("passCodeId") REFERENCES "PassCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
