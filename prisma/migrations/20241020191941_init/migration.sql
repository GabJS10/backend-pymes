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
    "rating" INTEGER,
    "delivery_time" TEXT,

    CONSTRAINT "user_bussiness_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "user_bussiness_email_key" ON "user_bussiness"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_bussiness_name_url_key" ON "user_bussiness"("name_url");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_bussiness_id_fkey" FOREIGN KEY ("user_bussiness_id") REFERENCES "user_bussiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
