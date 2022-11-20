import { Prisma, PrismaClient } from "@prisma/client";
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

export async function selectMoneyFromAccountByUsername(username: string) {
  return await accounts.findFirst({
    where: {
      user: { username: username },
    },
    select: { balance: true },
  });
}

export async function createTransactionAndUpdateAccounts(
  from: string,
  to: string,
  value: Prisma.Decimal
) {
  const fromId = (
    await users.findFirst({
      where: { username: from },
      select: { id: true },
    })
  )?.id;

  const toId = (
    await users.findFirst({
      where: { username: to },
      select: { id: true },
    })
  )?.id;

  await prisma.$transaction([
    accounts.update({
      where: {
        id: fromId,
      },
      data: {
        balance: { decrement: value },
      },
    }),
    accounts.update({
      where: {
        id: toId,
      },
      data: {
        balance: { increment: value },
      },
    }),
    transactions.create({
      data: {
        created_at: new Date(),
        value: value,
        credited_account: { connect: { id: toId } },
        debited_account: { connect: { id: fromId } },
      },
    }),
  ]);
}

export async function findTransactionsByUserInvolvedId(id: number) {
  return await transactions.findMany({
    where: {
      OR: [
        {
          credited_account: { user: { id: id } },
        },
        {
          debited_account: { user: { id: id } },
        },
      ],
    },
    select: {
      id: true,
      value: true,
      created_at: true,
      credited_account: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      debited_account: {
        select: {
          user: { select: { username: true } },
        },
      },
    },
  });
}

export async function findAccountById(id: number) {
  return await accounts.findFirst({ where: { user: { id: id } } });
}
