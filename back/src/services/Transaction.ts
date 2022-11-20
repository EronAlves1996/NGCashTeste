import { Prisma } from "@prisma/client";
import { TransactionDataExposed, TransactionExposed } from "../../../types";
import {
  createTransactionAndUpdateAccounts,
  findTransactionsByUserInvolvedId,
  findUserById,
  selectMoneyFromAccountByUsername,
} from "./dbAccess";

type SpecialSelectedTransactions = {
  id: number;
  debited_account: {
    user: {
      username: string;
    } | null;
  };
  credited_account: {
    user: {
      username: string;
    } | null;
  };
  value: Prisma.Decimal;
  created_at: Date;
};

async function validateTransaction(
  transaction: TransactionDataExposed,
  username: string
) {
  if (transaction.transferFrom === transaction.transferTo) {
    throw new Error("Você não pode transferir para si mesmo");
  }

  if (transaction.transferFrom !== username) {
    throw new Error("Você só pode realizar uma transação logado da sua conta");
  }

  if (transaction.value <= 0) {
    throw new Error("Você não pode transferir 0 ou um valor negativo");
  }

  const money = await selectMoneyFromAccountByUsername(username);

  if (money?.balance!.lessThan(new Prisma.Decimal(transaction.value))) {
    throw new Error("Você não tem todo esse dinheiro para transferir");
  }
}

export async function makeTransaction(
  transaction: TransactionDataExposed,
  username: string
) {
  try {
    await validateTransaction(transaction, username);
    await createTransactionAndUpdateAccounts(
      transaction.transferFrom,
      transaction.transferTo,
      new Prisma.Decimal(transaction.value)
    );
  } catch (_) {
    throw new Error(
      "Transferência inválida: gentileza conferir o username para o qual você está transferindo"
    );
  }
}

async function filterTransactions(
  transactions: SpecialSelectedTransactions[],
  id: number,
  date?: string,
  type?: string
) {
  const user = await findUserById(id);

  if (date) {
    const parsedDate = new Date(`${date?.toString()}T00:00`);

    transactions = transactions.filter((transaction) => {
      const year = transaction.created_at.getFullYear();
      const month = transaction.created_at.getMonth();
      const day = transaction.created_at.getDate();

      return (
        year === parsedDate.getFullYear() &&
        month === parsedDate.getMonth() &&
        day == parsedDate.getDate()
      );
    });
  }

  if (type) {
    transactions = transactions.filter((transaction) =>
      type === "in"
        ? transaction.credited_account.user?.username === user?.username
        : transaction.debited_account.user?.username === user?.username
    );
  }

  return transactions;
}

export async function fetchTransactions(
  id: number,
  date?: string,
  type?: string
): Promise<TransactionExposed[]> {
  let trans = await findTransactionsByUserInvolvedId(id);

  if (date || type) {
    trans = await filterTransactions(trans, id, date, type);
  }

  return trans.map((t) => {
    return {
      createdAt: t.created_at.toString(),
      from: t.debited_account.user?.username!,
      to: t.credited_account.user?.username!,
      id: t.id,
      value: t.value.toNumber(),
    };
  });
}
