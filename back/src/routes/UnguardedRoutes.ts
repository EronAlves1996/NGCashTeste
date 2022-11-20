import { Router } from "express";
import * as dotenv from "dotenv";
import { RegisterDataExposed } from "../../../types";
import { login } from "../services/login";
dotenv.config();
const PREFIX = process.env.API_PREFIX;

const router = Router();

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
  register(req.body as RegisterDataExposed)
    .then((_) => {
      res.status(201);
      res.send({ message: "Successfully registered" });
    })
    .catch((err) => {
      res.status(422);
      res.send({ message: err });
    });
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
router.get(PREFIX + "login", async (req, res) => {
  try {
    if (!req.headers.authentication)
      throw new Error("Por favor envie autenticação válida");
    const authentication: string = req.headers.authentication as string;
    const processedLogin = await login(authentication);
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

export default router;
