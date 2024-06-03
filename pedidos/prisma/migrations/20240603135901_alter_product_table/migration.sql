/*
  Warnings:

  - Added the required column `quatity` to the `prodcuts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prodcuts" ADD COLUMN     "quatity" INTEGER NOT NULL;
