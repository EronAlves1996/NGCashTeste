import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { sha256 } from "js-sha256";
import { RegisterDataExposed, UserExposed } from "../../../types";
import { users } from "./dbAccess";
dotenv.config();

function unencodeCredentials(authentication: string): RegisterDataExposed {
  if (!authentication?.startsWith("Basic")) {
    throw new Error("Invalid authentication");
  }
  const credentials = atob(<string>authentication?.split(" ")[1]).split(":");
  return {
    username: credentials![0],
    password: sha256(credentials![1]),
  };
}

export async function login(
  auth: string
): Promise<{ jwt: string; user: UserExposed }> {
  const credentials = unencodeCredentials(auth);
  const userFinded = await users.findFirst({
    where: {
      AND: [
        { username: credentials.username },
        { password: credentials.password },
      ],
    },
  });

  if (userFinded) {
    const payload = {
      accountId: userFinded.id,
      username: userFinded.username,
    };
    return {
      jwt: jwt.sign(payload, <string>process.env.JWT_SECRET, {
        expiresIn: "24h",
      }),
      user: {
        accountId: userFinded.account_id,
        username: userFinded.username,
        id: userFinded.id,
      },
    };
  }
  throw new Error("User not found");
}
