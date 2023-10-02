-- DropForeignKey
ALTER TABLE "bill_payment" DROP CONSTRAINT "bill_payment_derash_status_id_fkey";

-- DropForeignKey
ALTER TABLE "bill_payment" DROP CONSTRAINT "bill_payment_smile_status_id_fkey";

-- AlterTable
ALTER TABLE "bill_payment" ALTER COLUMN "paid_at" SET DATA TYPE TEXT,
ALTER COLUMN "derash_status_id" DROP NOT NULL,
ALTER COLUMN "smile_status_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bill_payment" ADD CONSTRAINT "bill_payment_derash_status_id_fkey" FOREIGN KEY ("derash_status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_payment" ADD CONSTRAINT "bill_payment_smile_status_id_fkey" FOREIGN KEY ("smile_status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
