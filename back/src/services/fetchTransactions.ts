import { transactions, users } from "./dbAccess";

export async function fetchTransactions(
  id: number,
  date?: string,
  type?: string
) {
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
        ? transaction.credited_account_id === user?.account_id
        : transaction.debited_account_id === user?.account_id
    );
  }

  return trans;
}
