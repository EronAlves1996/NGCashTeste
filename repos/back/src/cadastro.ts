import * as accountsDAO from "./accountsDAO";
import * as usersDAO from "./usersDAO";
import { sha256 } from "js-sha256";

export type RegisterData = {
  username: string;
  password: string;
};

let accountId = 0;
let userId = 0;

export function cadastrar(data: RegisterData) {
  if (data.username.length < 3) {
    throw new Error("Username must have at least 3 characters");
  }

  if (usersDAO.verifyItExistsByUsername(data.username)) {
    throw new Error("Username already exists");
  }

  if (
    data.password.length < 8 ||
    !data.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[^ ]+$/)
  ) {
    throw new Error(
      "Too short password(at least 8 characters) or must have number and uppercase char"
    );
  }

  const account: accountsDAO.Account = {
    id: ++accountId,
    balance: new accountsDAO.Money(100),
  };
  const user: usersDAO.User = {
    id: ++userId,
    accountId: accountId,
    password: sha256(data.password),
    username: data.username,
  };

  usersDAO.create(user);
  accountsDAO.create(account);
}
