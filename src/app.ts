import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envVars } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { router } from "./routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "https://runner-courier.vercel.app",
//     credentials: true, // important: allows cookies
//   })
// );

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System Backend!",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
