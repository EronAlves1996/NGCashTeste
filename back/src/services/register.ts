import { sha256 } from "js-sha256";
import { RegisterData } from "../../../types";
import { users } from "./dbAccess";

export async function register(data: RegisterData) {
  if (data.username.length < 3) {
    throw new Error("Username must have at least 3 characters");
  }

  if (
    data.password.length < 8 ||
    !data.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[^ ]+$/)
  ) {
    throw new Error(
      "Too short password(at least 8 characters) or must have number and uppercase char"
    );
  }

  const user = await users.create({
    data: {
      password: sha256(data.password),
      username: data.username,
      account: {
        create: {
          balance: 100,
        },
      },
    },
  });

  console.log(user);
}
