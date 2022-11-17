import { Money } from "./back/src/accountsDAO";

export declare type Transaction = {
  id: number;
  debitedAccount: number;
  creditedAccount: number;
  value: Money;
  createdAt: Date;
};

export declare type TransactionExposed = {
  id: number;
  to: string;
  from: string;
  value: number;
  createdAt: string;
};

export declare type Account = {
  id: number;
  balance: Money;
};

export declare type User = {
  id: number;
  username: string;
  password: string;
  accountId: number;
};

export declare type AccountExposed = {
  id: number;
  balance: number;
};
