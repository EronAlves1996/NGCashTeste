import { readByUsernameAndPassword } from "../dbAccess/usersDAO";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { sha256 } from "js-sha256";
import { RegisterData, UserExposed } from "../../../types";
dotenv.config();

function unencodeCredentials(authentication: string): RegisterData {
  if (!authentication?.startsWith("Basic")) {
    throw new Error("Invalid authentication");
  }
  const credentials = atob(<string>authentication?.split(" ")[1]).split(":");
  return {
    username: credentials![0],
    password: sha256(credentials![1]),
  };
}

export function login(auth: string): { jwt: string; user: UserExposed } {
  const credentials = unencodeCredentials(auth);
  const userFinded = readByUsernameAndPassword(
    credentials.username,
    credentials.password
  );
  if (userFinded) {
    const payload = {
      accountId: userFinded.accountId,
      username: userFinded.username,
    };
    return {
      jwt: jwt.sign(payload, <string>process.env.JWT_SECRET, {
        expiresIn: "24h",
      }),
      user: {
        accountId: userFinded.accountId,
        username: userFinded.username,
        id: userFinded.id,
      },
    };
  }
  throw new Error("User not found");
}
