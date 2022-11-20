import { AccountExposed } from "../../../types";
import { findAccountById } from "./dbAccess";

export async function fetchAccountInfo(id: number): Promise<AccountExposed> {
  const account = await findAccountById(id);
  return {
    balance: account?.balance.toNumber()!,
    id: account?.id,
  };
}
