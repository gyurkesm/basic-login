import express, { Request, Response } from "express";
import userRoutes from "./users";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Home page");
});

router.use("/users", userRoutes);

export default router;
