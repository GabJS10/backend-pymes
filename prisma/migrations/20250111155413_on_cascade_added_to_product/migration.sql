-- DropForeignKey
ALTER TABLE "ProductsOnSections" DROP CONSTRAINT "ProductsOnSections_product_id_fkey";

-- AddForeignKey
ALTER TABLE "ProductsOnSections" ADD CONSTRAINT "ProductsOnSections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
