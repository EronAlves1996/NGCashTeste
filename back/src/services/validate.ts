import { UserExposed } from "../../../types";
import * as usersDAO from "../dbAccess/usersDAO";

export function validate(id: number): UserExposed {
  const user = usersDAO.readById(id);

  return {
    accountId: user.accountId,
    id: user.id,
    username: user.username,
  };
}
