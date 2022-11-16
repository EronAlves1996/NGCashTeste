import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { cadastrar, RegisterData } from "./cadastro";
import { login } from "./login";
import { sha256 } from "js-sha256";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as usersDAO from "./usersDAO";
import * as accountsDAO from "./accountsDAO";
import * as transactionsDAO from "./transactionsDAO";
import { makeTransaction } from "./makeTransaction";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/cadastro", (req, res) => {
  try {
    cadastrar(req.body as RegisterData);
    res.status(201);
    res.send("success");
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(422);
      res.send(ex.message);
    }
  }
});

app.get("/login", (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Basic")) {
    res.status(400);
    res.send({
      errorMessage:
        "Please check the validation method for this authentication",
    });
  }

  const credentials = atob(<string>authorization?.split(" ")[1]).split(":");
  const auth: RegisterData = {
    username: credentials![0],
    password: sha256(credentials![1]),
  };

  try {
    const jwtPayload = login(auth);
    res.cookie("jwt-auth", jwtPayload, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200);
    res.send({ status: "Successfully logged in" });
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(401);
      res.send({ status: ex.message });
    }
  }
});

app.use((req, res, next) => {
  try {
    const auth = req.cookies["jwt-auth"];
    const verify = jwt.verify(auth, <string>process.env.JWT_SECRET);
    const payload: { accountId: number; username: string } = verify as {
      accountId: number;
      username: string;
    };
    res.locals.accountId = payload.accountId;
    res.locals.username = payload.username;
    next();
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(401);
      res.send({ status: "Unauthorized access" });
    }
  }
});

export type TransactionData = {
  transferFrom: string;
  transferTo: string;
  value: number;
};

app.get("/accountinfo", (req, res) => {
  const user = usersDAO.readById(res.locals.accountId);
  const account = accountsDAO.readById(user.accountId);
  res.status(200);
  res.send({ ...account, balance: account.balance.getMoney() });
});

app.post("/transferir", (req, res) => {
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

app.get("/transacoes", (req, res) => {
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

app.listen(3000, () => console.log("Listen on port 3000"));
