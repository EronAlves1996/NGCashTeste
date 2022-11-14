type User = {
    id: number;
    username: string;
    password: string;
    accountId: string;
}

const bancoFake = new Map();

export function create(user: User): void{
    bancoFake.set(user.id, user);
}

export function readById(id: number): User{
    return bancoFake.get(id);
}

export function readAll(): User[]{
    return [...bancoFake.values()];
}

export function updateById(id: number, user: User): void{
    bancoFake.set(id, user);
}

export function deleteById(id: number){
    bancoFake.delete(id);
}