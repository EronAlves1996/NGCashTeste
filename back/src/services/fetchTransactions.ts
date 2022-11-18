import { PrismaClient } from "@prisma/client";

export async function fetchTransactions(
  id: number,
  date?: string,
  type?: string
) {
  const prisma = new PrismaClient();

  const user = await prisma.users.findFirst({ where: { id: id } });

  let transactions = await prisma.transactions.findMany({
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
  });

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
        ? transaction.credited_account_id === user?.account_id
        : transaction.debited_account_id === user?.account_id
    );
  }
  return transactions;
}
