-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER_BUSSINESS', 'USER_CLIENT');

-- CreateTable
CREATE TABLE "user_bussiness" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "name_url" VARCHAR(255) NOT NULL,
    "holder" TEXT NOT NULL,
    "whatsapp_contact" VARCHAR(10) NOT NULL,
    "locality" TEXT NOT NULL,
    "shipping_cost" DECIMAL(65,30) NOT NULL,
    "contact_name" TEXT NOT NULL,
    "number_contact" VARCHAR(10) NOT NULL,
    "social_media_contact" TEXT,
    "image_profile" TEXT,
    "image_cover" TEXT,
    "category" TEXT,
    "description" TEXT,
    "open_hours" TEXT,
    "close_hours" TEXT,
    "qualification" SMALLINT DEFAULT 0,
    "delivery_time" TEXT,

    CONSTRAINT "user_bussiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" SERIAL NOT NULL,
    "rating" SMALLINT NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    "user_bussiness_id" INTEGER NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "section" TEXT,
    "user_bussiness_id" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_bussiness_id" INTEGER NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsOnSections" (
    "product_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "user_bussiness_id" INTEGER NOT NULL,

    CONSTRAINT "ProductsOnSections_pkey" PRIMARY KEY ("product_id","section_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_bussiness_email_key" ON "user_bussiness"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_bussiness_name_url_key" ON "user_bussiness"("name_url");

-- CreateIndex
CREATE UNIQUE INDEX "rating_user_user_bussiness_id_key" ON "rating"("user", "user_bussiness_id");

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_bussiness_id_fkey" FOREIGN KEY ("user_bussiness_id") REFERENCES "user_bussiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_bussiness_id_fkey" FOREIGN KEY ("user_bussiness_id") REFERENCES "user_bussiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_user_bussiness_id_fkey" FOREIGN KEY ("user_bussiness_id") REFERENCES "user_bussiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnSections" ADD CONSTRAINT "ProductsOnSections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnSections" ADD CONSTRAINT "ProductsOnSections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnSections" ADD CONSTRAINT "ProductsOnSections_user_bussiness_id_fkey" FOREIGN KEY ("user_bussiness_id") REFERENCES "user_bussiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
