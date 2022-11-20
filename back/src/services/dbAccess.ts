import { PrismaClient } from "@prisma/client";
import { sha256 } from "js-sha256";

const prisma = new PrismaClient();

const accounts = prisma.accounts;
const users = prisma.users;
const transactions = prisma.transactions;

export async function findUserById(id: number) {
  return await users.findFirst({ where: { id: id } });
}

export async function createUserAndNewAccount(
  username: string,
  password: string
) {
  return await users.create({
    data: {
      password: sha256(password),
      username: username,
      account: {
        create: {
          balance: 100,
        },
      },
    },
  });
}

export async function findUserByUsernameAndPassword(
  username: string,
  password: string
) {
  return await users.findFirst({
    where: {
      AND: [{ username: username }, { password: password }],
    },
  });
}
