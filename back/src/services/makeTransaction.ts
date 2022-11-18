import { Prisma } from "@prisma/client";
import { TransactionDataExposed } from "../../../types";
import { accounts, transactions, users } from "./dbAccess";

export async function makeTransaction(
  transaction: TransactionDataExposed,
  username: string
) {
  if (transaction.transferFrom === transaction.transferTo) {
    throw new Error("Cannot make a transaction against yourself");
  }

  if (transaction.transferFrom !== username) {
    throw new Error("You can only make a transaction from your account");
  }

  const from = await users.findFirst({
    where: { username: transaction.transferFrom },
  });
  const to = await users.findFirst({
    where: { username: transaction.transferTo },
  });

  if (!from) {
    throw new Error("Login not recognized");
  }

  if (!to) {
    throw new Error("Account not exists");
  }

  const fromAccount = await accounts.findFirst({
    where: { id: from.account_id },
  });
  const toAccount = await accounts.findFirst({
    where: { id: to.account_id },
  });

  if (fromAccount?.balance!.lessThan(new Prisma.Decimal(transaction.value))) {
    throw new Error("Not enough money to transfer");
  }

  await accounts.update({
    data: {
      ...fromAccount,
      balance: fromAccount?.balance.minus(
        new Prisma.Decimal(transaction.value)
      ),
    },
    where: { id: fromAccount?.id },
  });

  await accounts.update({
    data: {
      ...toAccount,
      balance: toAccount?.balance.plus(new Prisma.Decimal(transaction.value)),
    },
    where: { id: toAccount?.id },
  });

  await transactions.create({
    data: {
      created_at: new Date(),
      value: new Prisma.Decimal(transaction.value),
      credited_account: {
        connect: { id: toAccount?.id },
      },
      debited_account: {
        connect: {
          id: fromAccount?.id,
        },
      },
    },
  });
}
