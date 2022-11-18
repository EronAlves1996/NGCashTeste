import { Router } from "express";
import { register } from "./services/register";
import { login } from "./services/login";
import { makeTransaction } from "./services/makeTransaction";
import { RegisterDataExposed, TransactionDataExposed } from "../../types";
import { validate } from "./services/validate";
import { fetchAccountInfo } from "./services/fetchAccountInfo";
import * as dotenv from "dotenv";
import { fetchTransactions } from "./services/fetchTransactions";
dotenv.config();

const PREFIX = process.env.API_PREFIX;
const router = Router();

/**
 * Exporting a function that is used to register the routes that are guarded by the JWT token.
 *
 * @function
 * @name registerGuardedRoutes
 * @kind function
 * @returns {void}
 * @exports
 */
export function registerGuardedRoutes() {}
