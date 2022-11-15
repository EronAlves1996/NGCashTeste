import { RegisterData } from "./cadastro";
import { readByUsernameAndPassword } from "./usersDAO";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
dotenv.config();

export function login(user: RegisterData) {
  const userFinded = readByUsernameAndPassword(user.username, user.password);
  if (userFinded) {
    const payload = {
      accountId: userFinded.accountId,
      username: userFinded.username,
    };
    return jwt.sign(payload, <string>process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
  throw new Error("User not found");
}
