-- CreateTable
CREATE TABLE "BillPayment" (
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

    CONSTRAINT "BillPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_derash_status_id_fkey" FOREIGN KEY ("derash_status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_smile_status_id_fkey" FOREIGN KEY ("smile_status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
