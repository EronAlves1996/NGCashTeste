import { Accounts } from "@prisma/client";
import { accounts } from "./dbAccess";

export async function fetchAccountInfo(id: number): Promise<Accounts> {
  return <Accounts>await accounts.findFirst({ where: { user: { id: id } } });
}
