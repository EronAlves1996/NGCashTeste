import * as transactionsDAO from "../dbAccess/transactionsDAO";
import * as usersDAO from "../dbAccess/usersDAO";

export function fetchTransactions(id: number, date?: string, type?: string) {
  const user = usersDAO.readById(id);
  let transactions = transactionsDAO.readById(user.accountId);

  if (date) {
    const parsedDate = new Date(`${date?.toString()}T00:00`);

    transactions = transactions.filter((transaction) => {
      const year = transaction.createdAt.getFullYear();
      const month = transaction.createdAt.getMonth();
      const day = transaction.createdAt.getDate();

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
        ? transaction.creditedAccount === id
        : transaction.debitedAccount === id
    );
  }
  return transactions;
}
