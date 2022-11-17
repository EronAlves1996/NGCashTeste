import { User } from "../../../types";

const bancoFake: Map<number, User> = new Map();

export function create(user: User): void {
  bancoFake.set(user.id, user);
  console.log("user criado " + JSON.stringify(user));
}

export function readById(id: number): User {
  return <User>bancoFake.get(id);
}

export function readByUsernameAndPassword(
  username: string,
  password: string
): User {
  return <User>(
    [...bancoFake.values()].find(
      (user) => user.username === username && user.password === password
    )
  );
}

export function readByUsername(username: string) {
  return [...bancoFake.values()].find((user) => user.username === username);
}

export function verifyItExistsByUsername(username: string): boolean {
  return [...bancoFake.values()].some((user) => user.username === username);
}

export function readAll(): User[] {
  return [...bancoFake.values()];
}

export function updateById(id: number, user: User): void {
  bancoFake.set(id, user);
}

export function deleteById(id: number) {
  bancoFake.delete(id);
}
