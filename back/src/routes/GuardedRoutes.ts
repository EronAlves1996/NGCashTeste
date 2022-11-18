import { Router } from "express";
import * as dotenv from "dotenv";
import { validate } from "../services/validate";
import { fetchAccountInfo } from "../services/fetchAccountInfo";
import { TransactionDataExposed } from "../../../types";
import { makeTransaction } from "../services/makeTransaction";
import { fetchTransactions } from "../services/fetchTransactions";
dotenv.config();

const router = Router();
const PREFIX = process.env.API_PREFIX;
/**
 * This is a route that is guarded by the JWT token.
 * It is used to validate the token and return the user data.
 *
 * @constant
 * @name router
 * @type {Router}
 */
router.get(PREFIX + "validar", async (req, res) => {
  res.status(200);
  res.send(await validate(res.locals.id));
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
  const transaction: TransactionDataExposed = req.body;
  makeTransaction(transaction, res.locals.username)
    .then((_) => {
      res.status(200);
      res.send({ message: "Transação bem sucedida" });
    })
    .catch((err) => {
      if (err instanceof Error) {
        res.status(400);
        res.send({ message: err.message });
      }
    });
});

/**
 * A route that is guarded by the JWT token. It is used to get the transactions from the user and send it to the client.
 *
 * @constant
 * @name router
 * @type {Router}
 */
router.get(PREFIX + "transacoes", async (req, res) => {
  res.status(200);
  res.send(
    await fetchTransactions(
      res.locals.id,
      req.query.date?.toString(),
      req.query.type?.toString()
    )
  );
});

export default router;
