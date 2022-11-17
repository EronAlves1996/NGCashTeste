import { Money } from "./accountsDAO";
import { Transaction } from "../../../types";

const bancoFake = new Map<number, Transaction>();

export function create(transaction: Transaction): void {
  console.log("Transação realizada " + JSON.stringify(transaction));
  console.log("Valor transferido " + transaction.value.getMoney());
  bancoFake.set(transaction.id, transaction);
}

export function readById(id: number): Transaction[] {
  return [...bancoFake.values()].filter(
    (transaction) =>
      transaction.creditedAccount === id || transaction.debitedAccount === id
  );
}

export function readByDate(id: number, date: string): Transaction[] {
  const d = new Date(`${date}T00:00:00`);
  return readById(id).filter((transaction) => {
    const year = transaction.createdAt.getFullYear();
    const month = transaction.createdAt.getMonth();
    const day = transaction.createdAt.getDate();
    return (
      year === d.getFullYear() && month === d.getMonth() && day == d.getDate()
    );
  });
}

export function readByType(id: number, type: string): Transaction[] {
  return readById(id).filter((transaction) =>
    type === "in"
      ? transaction.creditedAccount === id
      : transaction.debitedAccount === id
  );
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
