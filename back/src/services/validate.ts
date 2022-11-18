import { UserExposed } from "../../../types";
import { users } from "./dbAccess";

export async function validate(id: number): Promise<UserExposed> {
  const user = await users.findFirst({ where: { id: id } });

  return {
    accountId: user?.account_id as number,
    id: user?.id,
    username: user?.username as string,
  };
}
