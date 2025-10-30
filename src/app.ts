import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://your-production-frontend.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // required for cookies, authorization headers, etc.
  })
);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true, // important: allows cookies
//   })
// );

// origin: [
//     "https://wasim-akram.vercel.app", // frontend
//      "http://localhost:3000", // for local dev
//    ],

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System Backend!",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
