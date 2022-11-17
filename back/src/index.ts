import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as jwt from "jsonwebtoken";
import * as cors from "cors";
import { guardedRoutes, unguardedRoutes } from "./routes";

const app = express();
const routeGuard: express.RequestHandler = (req, res, next) => {
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
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authentication"],
    origin: process.env.ALLOWED_URL,
  })
);

unguardedRoutes();

app.use(routeGuard);

guardedRoutes();

app.listen(3000, () => console.log("Listen on port 3000"));
