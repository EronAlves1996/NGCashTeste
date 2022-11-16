import { Money } from "./accountsDAO";

export type Transaction = {
  id: number;
  debitedAccount: number;
  creditedAccount: number;
  value: Money;
  createdAt: Date;
};

const bancoFake = new Map<number, Transaction>();

export function create(transaction: Transaction): void {
  console.log("Transação realizada " + JSON.stringify(transaction));
  console.log("Valor transferido " + transaction.value.getMoney());
  bancoFake.set(transaction.id, transaction);
}

export function readById(id: number): Transaction {
  return <Transaction>bancoFake.get(id);
}

export function readAll(): Transaction[] {
  return [...bancoFake.values()];
}

export function updateById(id: number, transaction: Transaction): void {
  bancoFake.set(id, transaction);
}

export function deleteById(id: number): void {
  bancoFake.delete(id);
}
