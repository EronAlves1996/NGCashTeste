-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "debited_account_id" INTEGER NOT NULL,
    "credited_account_id" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_account_id_key" ON "Users"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_debited_account_id_key" ON "Transactions"("debited_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_credited_account_id_key" ON "Transactions"("credited_account_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_debited_account_id_fkey" FOREIGN KEY ("debited_account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_credited_account_id_fkey" FOREIGN KEY ("credited_account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
