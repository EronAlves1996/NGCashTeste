import { TransactionExposed } from "../../../types";
import { transactions, users } from "./dbAccess";

export async function fetchTransactions(
  id: number,
  date?: string,
  type?: string
): Promise<TransactionExposed[]> {
  const user = await users.findFirst({ where: { id: id } });

  let trans = await transactions.findMany({
    where: {
      OR: [
        {
          credited_account: { user: { id: id } },
        },
        {
          debited_account: { user: { id: id } },
        },
      ],
    },
    select: {
      id: true,
      value: true,
      created_at: true,
      credited_account: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      debited_account: {
        select: {
          user: { select: { username: true } },
        },
      },
    },
  });

  if (date) {
    const parsedDate = new Date(`${date?.toString()}T00:00`);

    trans = trans.filter((transaction) => {
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
    trans = trans.filter((transaction) =>
      type === "in"
        ? transaction.credited_account.user?.username === user?.username
        : transaction.debited_account.user?.username === user?.account_id
    );
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
