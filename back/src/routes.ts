import { Router } from "express";
import { register } from "./services/register";
import { login } from "./services/login";
import { makeTransaction } from "./services/makeTransaction";
import { RegisterData, TransactionData } from "../../types";
import { validate } from "./services/validate";
import { fetchAccountInfo } from "./services/fetchAccountInfo";
import * as dotenv from "dotenv";
import { fetchTransactions } from "./services/fetchTransactions";
dotenv.config();

const PREFIX = process.env.API_PREFIX;
const router = Router();

/**
 * Exporting a function that is used to register the routes that are not guarded by the JWT token.
 *
 * @function
 * @name registerUnguardedRoutes
 * @kind function
 * @returns {void}
 * @exports
 */
export function registerUnguardedRoutes(): void {
  /**
   * Create a route for the 'cadastro' endpoint.
   * This takes the username and password and attempt to send it to
   * a function to deal with registering a new user
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.post(PREFIX + "cadastro", (req, res) => {
    try {
      register(req.body as RegisterData);
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
   * Set 'login' endpoint as a GET method and validate
   * the header 'authentication' and send to a function to validadet
   * the credentials
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.get(PREFIX + "login", (req, res) => {
    try {
      if (!req.headers.authentication)
        throw new Error("Por favor envie autenticação válida");
      const authentication: string = req.headers.authentication as string;
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
        res.set(
          "WWW-Authenticate",
          "Basic Login deve ser feito com username e senha válidos"
        );
        res.send({
          errorMessage: ex.message,
        });
      }
    }
  });
}

/**
 * Exporting a function that is used to register the routes that are guarded by the JWT token.
 *
 * @function
 * @name registerGuardedRoutes
 * @kind function
 * @returns {void}
 * @exports
 */
export function registerGuardedRoutes() {
  /**
   * This is a route that is guarded by the JWT token.
   * It is used to validate the token and return the user data.
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.get(PREFIX + "validar", (req, res) => {
    res.status(200);
    res.send(validate(res.locals.id));
  });

  /**
   * Getting the account info from the user and sending it to the client
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.get(PREFIX + "informacaoConta", async (req, res) => {
    res.status(200);
    res.send(await fetchAccountInfo(res.locals.id));
  });

  /**
   * Create a route that takes a transaction, validates,
   * and realize it
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.post(PREFIX + "transferir", (req, res) => {
    const transaction: TransactionData = req.body;
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

  /**
   * A route that is guarded by the JWT token. It is used to get the transactions from the user and send it to the client.
   *
   * @constant
   * @name router
   * @type {Router}
   */
  router.get(PREFIX + "transacoes", (req, res) => {
    res.send(200);
    res.send(
      fetchTransactions(
        res.locals.id,
        req.query.date?.toString(),
        req.query.type?.toString()
      )
    );
  });
}
