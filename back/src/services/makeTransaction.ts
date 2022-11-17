import { TransactionData } from "..";
import * as accountsDAO from "./accountsDAO";
import * as usersDAO from "../dbAccess/usersDAO";
import * as transactionsDAO from "../dbAccess/transactionsDAO";

let transactionId = 0;

export function makeTransaction(transaction: TransactionData) {
  if (transaction.transferFrom === transaction.transferTo) {
    throw new Error("Cannot make a transaction against yourself");
  }

  const from = usersDAO.readByUsername(transaction.transferFrom);
  const to = usersDAO.readByUsername(transaction.transferTo);

  if (!from) {
    throw new Error("Login not recognized");
  }

  if (!to) {
    throw new Error("Account not exists");
  }

  const fromAccount = accountsDAO.readById(from?.accountId as number);
  const toAccount = accountsDAO.readById(to?.accountId as number);

  if (fromAccount.balance.getMoney() < transaction.value) {
    throw new Error("Not enough money to transfer");
  }

  accountsDAO.updateById(
    fromAccount.id,
    (() => {
      fromAccount.balance.setMoney(
        fromAccount.balance.getMoney() - transaction.value
      );
      return fromAccount;
    })()
  );

  accountsDAO.updateById(
    toAccount.id,
    (() => {
      toAccount.balance.setMoney(
        toAccount.balance.getMoney() + transaction.value
      );
      return toAccount;
    })()
  );

  transactionsDAO.create({
    createdAt: new Date(),
    creditedAccount: to?.id,
    debitedAccount: <number>from?.id,
    id: ++transactionId,
    value: new accountsDAO.Money(transaction.value),
  });
}
