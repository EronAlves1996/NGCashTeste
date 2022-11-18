import { Accounts } from "@prisma/client";
import { AccountExposed } from "../../../types";
import { accounts } from "./dbAccess";

export async function fetchAccountInfo(id: number): Promise<AccountExposed> {
  const account = await accounts.findFirst({ where: { user: { id: id } } });
  return {
    balance: account?.balance.toNumber()!,
    id: account?.id,
  };
}
