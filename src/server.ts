import express, { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import passport from "passport";
import errorHandler from "./middleware/errorMiddleware";
import { AppError } from "./types/status";
import routes from "./router/index";
import { passportJwtStrategy } from "./config/passport";

const app = express();
const port = process.env.PORT || 3000;

// responses middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("*.js", function (req: Request, res: Response, next: NextFunction) {
    res.set("content-type", "application/javascript");
    next();
});
app.use(cookieParser());
app.use(passport.initialize());
passport.use(passportJwtStrategy);

app.use("/", routes);

app.get("/", (req: Request, res: Response) => {
    res.cookie("auth", "token", { maxAge: 60 * 1000 });
    res.send("Csá");
});

app.get("/test-error", (req: Request, res: Response) => {
    throw new AppError("Ez egy error route", "Bad Request", "Béla");
    res.send("Csá");
});

app.get("/test-error1", (req: Request, res: Response) => {
    throw new AppError("Ide be kell jelentkezned", "Unauthorized");
    res.send("Csá");
});

app.get("/test-error2", (req: Request, res: Response) => {
    throw new Error("Teszt Error");
    res.send("Csá");
});

// Error handler (last middleware)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
