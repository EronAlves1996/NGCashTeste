import * as accountsDAO from "./accountsDAO";
import * as usersDAO from "./usersDAO";

export type registerData = {
  username: string;
  password: string;
};

let accountId = 0;
let userId = 0;

export function cadastrar(data: registerData) {
  if (data.username.length < 3) {
    throw new Error("Username must have at least 3 characters");
  }

  if (usersDAO.verifyItExistsByUsername(data.username)) {
    throw new Error("Username already exists");
  }

  const account: accountsDAO.Account = {
    id: ++accountId,
    balance: new accountsDAO.Money(100),
  };
  const user: usersDAO.User = {
    id: ++userId,
    accountId: accountId,
    password: data.password,
    username: data.username,
  };

  usersDAO.create(user);
  accountsDAO.create(account);
}
