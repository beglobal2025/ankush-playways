CREATE TABLE "ProductColorOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductColorOption_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductColorOption_productId_idx" ON "ProductColorOption"("productId");

ALTER TABLE "ProductColorOption" ADD CONSTRAINT "ProductColorOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
