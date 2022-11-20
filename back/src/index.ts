import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import guardedRoutes from "./routes/GuardedRoutes";
import unguardedRoutes from "./routes/UnguardedRoutes";
import { routeGuard } from "./utils/routeGuard";
import * as path from "path";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authentication"],
    origin: process.env.ALLOWED_URL,
  })
);

app.use(unguardedRoutes);

app.use("/api", routeGuard);

app.use(guardedRoutes);

if (!process.argv.some((arg) => arg === "--decoupled")) {
  app.use(express.static("public"));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname.replace("bin", "public/index.html")));
  });
} else {
  console.log("Now running on decoupled mode");
}

app.listen(3000, () => console.log("Listen on port 3000"));
