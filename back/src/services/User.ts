import { sha256 } from "js-sha256";
import { RegisterDataExposed, UserExposed } from "../../../types";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  createUserAndNewAccount,
  findUserById,
  findUserByUsernameAndPassword,
} from "./dbAccess";

dotenv.config();

export async function validate(id: number): Promise<UserExposed> {
  const user = await findUserById(id);

  return {
    accountId: user?.account_id as number,
    id: user?.id,
    username: user?.username as string,
  };
}

export async function register(data: RegisterDataExposed) {
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

  await createUserAndNewAccount(data.username, data.password);
}

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
  const userFinded = await findUserByUsernameAndPassword(
    credentials.username,
    credentials.password
  );

  if (userFinded) {
    return {
      jwt: jwt.sign(
        {
          accountId: userFinded.id,
          username: userFinded.username,
        },
        <string>process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      ),
      user: {
        accountId: userFinded.account_id,
        username: userFinded.username,
        id: userFinded.id,
      },
    };
  }
  throw new Error("User not found");
}
