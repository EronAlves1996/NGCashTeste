export class Money {
    #integers: number;
    #floats: number;

    constructor(value: number){
        this.#integers = Math.trunc(value);
        this.#floats = (value - this.#integers) * 100;
    }

    getMoney(): number{
        return this.#integers + (this.#floats / 100);
    }

    setMoney(value: number){
        this.#integers = Math.trunc(value);
        this.#floats = (value - this.#integers) * 100;
    }
}

export type Account = {
    id: number;
    balance: Money;
}

const bancoFake = new Map();

export function create(account: Account): void{
    bancoFake.set(account.id, account);
}

export function readById(id: number): Account{
    return bancoFake.get(id);
}

export function readAll(): Account[]{
    return [...bancoFake.values()];
}

export function updateById(id: number, user: Account): void{
    bancoFake.set(id, user);
}

export function deleteById(id: number){
    bancoFake.delete(id);
}