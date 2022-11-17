import { Account } from "../../types";

export class Money {
  _integers: number;
  _floats: number;

  constructor(value: number) {
    this._integers = Math.trunc(value);
    this._floats = Math.trunc((value - this._integers) * 100);
  }

  getMoney(): number {
    return this._integers + this._floats / 100;
  }

  setMoney(value: number) {
    this._integers = Math.trunc(value);
    this._floats = Math.trunc((value - this._integers) * 100);
  }

  toString() {
    return this.getMoney();
  }
}

const bancoFake = new Map();

export function create(account: Account): void {
  console.log("conta criada " + JSON.stringify(account));
  console.log("conta criada " + account.balance.getMoney());
  bancoFake.set(account.id, account);
}

export function readById(id: number): Account {
  return bancoFake.get(id);
}

export function readAll(): Account[] {
  return [...bancoFake.values()];
}

export function updateById(id: number, account: Account): void {
  bancoFake.set(id, account);
  console.log(
    "Atualizado: ",
    "id: ",
    id,
    "Conta: ",
    account,
    "Valor: ",
    account.balance.getMoney()
  );
}

export function deleteById(id: number) {
  bancoFake.delete(id);
}
