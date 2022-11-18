import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const accounts = prisma.accounts;
export const users = prisma.users;
export const transactions = prisma.transactions;
