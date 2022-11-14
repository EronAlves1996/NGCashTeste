import * as express from "express";
import * as bodyParser from "body-parser";
import { cadastrar } from "./cadastro";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/cadastro", (req, res) => {
  const newReq: { username: string; password: string } = req.body;
  const { username, password } = newReq;
  try {
    cadastrar({ username, password });
    res.send("success");
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(422);
      res.send(ex.message);
    }
  }
});

app.listen(3000, () => console.log("Listen on port 3000"));
