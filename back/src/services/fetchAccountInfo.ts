import * as usersDAO from "../dbAccess/usersDAO";
import * as accountsDAO from "../accountsDAO";
import { Accounts } from "@prisma/client";

export function fetchAccountInfo(id: number): Accounts {
  const user = usersDAO.readById(id);
  const account = accountsDAO.readById(user.accountId);

  return account;
}
