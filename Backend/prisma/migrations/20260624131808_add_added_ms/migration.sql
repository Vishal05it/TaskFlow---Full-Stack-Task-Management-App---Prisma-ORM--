/*
  Warnings:

  - Added the required column `addedMs` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `addedMs` INTEGER NOT NULL;
