import { Router } from "express";
import { cadastrar } from "./cadastro";
import { login, unencodeCredentials } from "./login";
import * as usersDAO from "./usersDAO";
import * as accountsDAO from "./accountsDAO";
import { makeTransaction } from "./makeTransaction";
import * as transactionsDAO from "./transactionsDAO";
import { RegisterData } from "../../types";

const router = Router();

/**
 * Set unguarded routes. Any person can access these endpoints
 */
export function unguardedRoutes(): void {
  /**
   * Set route for registering a new user.
   */
  router.post("/cadastro", (req, res) => {
    try {
      cadastrar(req.body as RegisterData);
      res.status(201);
      res.send("success");
    } catch (ex) {
      if (ex instanceof Error) {
        res.status(422);
        res.send({ message: ex.message });
      }
    }
  });

  /**
   * Set route for login.
   */
  router.get("/login", (req, res) => {
    const authentication: string = req.headers.authentication as string;
    try {
      const processedLogin = login(authentication);
      res.cookie("jwt-auth", processedLogin.jwt, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200);
      res.send(processedLogin.user);
    } catch (ex) {
      if (ex instanceof Error) {
        res.status(400);
        res.set("WWW-Authenticate", "Basic Login with username and password");
        res.send({
          errorMessage: ex.message,
        });
      }
    }
  });
}

export type TransactionData = {
  transferFrom: string;
  transferTo: string;
  value: number;
};

export function guardedRoutes() {
  router.get("/validate", (req, res) => {
    res.status(200);
    res.send(usersDAO.readById(res.locals.id));
  });

  router.get("/accountinfo", (req, res) => {
    const user = usersDAO.readById(res.locals.accountId);
    const account = accountsDAO.readById(user.accountId);
    res.status(200);
    res.send({ ...account, balance: account.balance.getMoney() });
  });

  router.post("/transferir", (req, res) => {
    const transaction: TransactionData = {
      ...req.body,
      transferFrom: res.locals.username,
    };
    try {
      makeTransaction(transaction);
      res.status(200);
      res.send({ message: "Sucessfull transaction" });
    } catch (ex) {
      if (ex instanceof Error) {
        res.status(400);
        res.send({ message: ex.message });
      }
    }
  });

  router.get("/transacoes", (req, res) => {
    const id = res.locals.accountId;
    const transactions = transactionsDAO.readById(id);
    let final = transactions;

    if (req.query.date) {
      const date = new Date(`${req.query.date?.toString()}T00:00`);

      final = final.filter((transaction) => {
        const year = transaction.createdAt.getFullYear();
        const month = transaction.createdAt.getMonth();
        const day = transaction.createdAt.getDate();
        return (
          year === date.getFullYear() &&
          month === date.getMonth() &&
          day == date.getDate()
        );
      });
    }

    if (req.query.type)
      final = final.filter((transaction) =>
        req.query.type!.toString() === "in"
          ? transaction.creditedAccount === id
          : transaction.debitedAccount === id
      );

    res.send(200);
    res.send(final);
  });
}
