import { Accounts, PrismaClient } from "@prisma/client";

export async function fetchAccountInfo(id: number): Promise<Accounts> {
  const prisma = new PrismaClient();
  return <Accounts>(
    await prisma.accounts.findFirst({ where: { user: { id: id } } })
  );
}
