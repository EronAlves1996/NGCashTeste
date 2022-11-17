import { Money } from "./back/src/accountsDAO";

export type Transaction = {
  id: number;
  debitedAccount: number;
  creditedAccount: number;
  value: Money;
  createdAt: Date;
};

export type TransactionExposed = {
  id: number;
  to: string;
  from: string;
  value: number;
  createdAt: string;
};

export type Account = {
  id: number;
  balance: Money;
};

export type User = {
  id: number;
  username: string;
  password: string;
  accountId: number;
};
