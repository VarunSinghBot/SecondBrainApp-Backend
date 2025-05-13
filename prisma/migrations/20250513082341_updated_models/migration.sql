/*
  Warnings:

  - You are about to drop the column `link` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ContentToLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContentToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tagName]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sharableLink]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagName` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContentToLink" DROP CONSTRAINT "_ContentToLink_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToLink" DROP CONSTRAINT "_ContentToLink_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToTag" DROP CONSTRAINT "_ContentToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToTag" DROP CONSTRAINT "_ContentToTag_B_fkey";

-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "link",
DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "tagName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "sharable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharableLink" TEXT,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "_ContentToLink";

-- DropTable
DROP TABLE "_ContentToTag";

-- CreateTable
CREATE TABLE "_ContentTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContentTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContentTags_B_index" ON "_ContentTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "User_sharableLink_key" ON "User"("sharableLink");

-- AddForeignKey
ALTER TABLE "_ContentTags" ADD CONSTRAINT "_ContentTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentTags" ADD CONSTRAINT "_ContentTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
