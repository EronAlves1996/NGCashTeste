export declare type AccountExposed = {
  id?: number;
  balance: number;
};

export declare type RegisterDataExposed = {
  username: string;
  password: string;
};

export declare type UserExposed = {
  id?: number;
  username: string;
  accountId: number;
};

export declare type TransactionExposed = {
  id: number;
  to: string;
  from: string;
  value: number;
  createdAt: string;
};

export declare type TransactionDataExposed = {
  transferFrom: string;
  transferTo: string;
  value: number;
};
