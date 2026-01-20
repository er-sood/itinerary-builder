/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `createdByEmail` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `googleMapLink` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `stars` on the `Property` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "contactNumber",
DROP COLUMN "createdByEmail",
DROP COLUMN "googleMapLink",
DROP COLUMN "notes",
DROP COLUMN "stars",
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "starRating" INTEGER,
ADD COLUMN     "websiteLink" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
