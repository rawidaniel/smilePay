/*
  Warnings:

  - You are about to drop the `BillPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillPayment" DROP CONSTRAINT "BillPayment_derash_status_id_fkey";

-- DropForeignKey
ALTER TABLE "BillPayment" DROP CONSTRAINT "BillPayment_smile_status_id_fkey";

-- DropForeignKey
ALTER TABLE "BillPayment" DROP CONSTRAINT "BillPayment_user_id_fkey";

-- DropTable
DROP TABLE "BillPayment";

-- DropTable
DROP TABLE "Status";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "smile_id" BIGINT NOT NULL,
    "account_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_payment" (
    "id" TEXT NOT NULL,
    "manifest_id" TEXT NOT NULL,
    "bill_id" TEXT NOT NULL,
    "biller_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid_data" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "payee_mobile" TEXT NOT NULL,
    "txn_id" TEXT NOT NULL,
    "confirmation_code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "derash_status_id" TEXT NOT NULL,
    "smile_status_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "bill_payment" ADD CONSTRAINT "bill_payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_payment" ADD CONSTRAINT "bill_payment_derash_status_id_fkey" FOREIGN KEY ("derash_status_id") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_payment" ADD CONSTRAINT "bill_payment_smile_status_id_fkey" FOREIGN KEY ("smile_status_id") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
