/*
  Warnings:

  - Added the required column `type` to the `Industry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "type" TEXT NOT NULL;
