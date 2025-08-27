import express from "express";
import cors from "cors";
import router from "./app/routes";
import http from "http";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { noRouteFound } from "./app/utils/serverTool/noRouteFound";
import cookieParser from "cookie-parser";
import path from "path";
import { limiter } from "./app/utils/serverTool/rateLimite";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app = express();

const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://157.245.9.24:5173",
    "http://157.245.9.24:5174",
    "http://157.245.9.24:5175",

    "https://ticket.dmrdrones.com",

    "*",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(helmet());
app.use(morgan("combined"));
app.use(compression());
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World! This app name is Customer ticket support.");
});

app.use(express.static(path.join(process.cwd(), "uploads")));

app.use(globalErrorHandler);
app.use(noRouteFound);
const server = http.createServer(app);

export default server;
