/*
  Warnings:

  - You are about to alter the column `name` on the `author` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `title` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `publisher` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Made the column `publishedYear` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `author` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `bio` TEXT NULL;

-- AlterTable
ALTER TABLE `book` MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `publishedYear` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `publisher` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `address` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX `Author_name_idx` ON `Author`(`name`);

-- CreateIndex
CREATE INDEX `Book_title_idx` ON `Book`(`title`);

-- CreateIndex
CREATE INDEX `Publisher_name_idx` ON `Publisher`(`name`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- RenameIndex
ALTER TABLE `book` RENAME INDEX `Book_authorId_fkey` TO `Book_authorId_idx`;

-- RenameIndex
ALTER TABLE `book` RENAME INDEX `Book_publisherId_fkey` TO `Book_publisherId_idx`;
