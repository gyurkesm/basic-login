import express from "express";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();
import errorHandler from "./middleware/errorMiddleware";

const app = express();
const port = process.env.PORT || 3000;

// responses middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("*.js", function (req, res, next) {
  res.set("content-type", "application/javascript");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Csá");
});

// Error handler should be last before listen
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
