import * as express from "express";
import * as bodyParser from "body-parser";
import { cadastrar, RegisterData } from "./cadastro";
import { login } from "./login";
import { sha256 } from "js-sha256";

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

app.listen(3000, () => console.log("Listen on port 3000"));
