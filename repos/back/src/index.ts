import * as express from "express";
import * as bodyParser from "body-parser";
import { cadastrar, RegisterData } from "./cadastro";
import { login } from "./login";

const app = express();

app.use(bodyParser.json());

app.post("/cadastro", (req, res) => {
  try {
    cadastrar(req.body as RegisterData);
    res.send("success");
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(422);
      res.send(ex.message);
    }
  }
});

app.get("/login", (req, res) => {
  try {
    const jwtPayload = login(req.body);
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

app.listen(3000, () => console.log("Listen on port 3000"));
