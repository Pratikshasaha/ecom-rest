-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_vendorId_fkey";

-- DropIndex
DROP INDEX "Product_vendorId_idx";
