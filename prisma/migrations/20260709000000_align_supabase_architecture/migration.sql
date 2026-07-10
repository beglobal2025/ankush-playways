-- DropForeignKey
ALTER TABLE "AdminSession" DROP CONSTRAINT "AdminSession_adminUserId_fkey";

-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- DropIndex
DROP INDEX "Product_status_idx";

-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- DropIndex
DROP INDEX "ProductColorOption_productId_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "seoDescription" VARCHAR(160),
ADD COLUMN     "seoTitle" VARCHAR(60);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "seoDescription" VARCHAR(160),
ADD COLUMN     "seoTitle" VARCHAR(60);

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProductColorOption" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "AdminUser";

-- DropTable
DROP TABLE "AdminSession";

-- CreateIndex
CREATE INDEX "Category_updatedAt_idx" ON "Category"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Product_updatedAt_idx" ON "Product"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Product_status_sortOrder_updatedAt_idx" ON "Product"("status", "sortOrder", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Product_status_isFeatured_updatedAt_idx" ON "Product"("status", "isFeatured", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Product_categoryId_status_sortOrder_updatedAt_idx" ON "Product"("categoryId", "status", "sortOrder", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductColorOption_productId_sortOrder_idx" ON "ProductColorOption"("productId", "sortOrder");
