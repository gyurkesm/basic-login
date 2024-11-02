import express, { NextFunction, Request, Response } from "express";
import { IUser, UserSchema } from "../models/usersModel";
import hashPassword, { comparePassword } from "../utilities/login/hashPassword";
import { AppError } from "../types/status";
import { validateToken, verifyUser } from "../utilities/login/jwtUtils";
import { body, validationResult } from "express-validator";
import passport from "passport";

const router = express.Router();

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
    res.send("Login page");
});

router.post(
    "/login",
    body("username")
        .trim()
        .escape()
        .toLowerCase()
        .notEmpty()
        .withMessage("Add meg a felhasználónevet!"),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Add meg a jelszót!"),
    async (req: Request, res: Response, next: NextFunction) => {
        const validResult = validationResult(req);
        if (!validResult.isEmpty()) {
            res.send({ errors: validResult.array() });
        }
        try {
            // Get and validate data
            const { username, password } = req.body;

            const userID = await checkUser(username, password);

            // Assign token
            const token = await verifyUser(userID);

            res.send({ status: "success", token });
        } catch (err) {
            next(err);
        }
    }
);

router.get(
    "/auth",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response, next: NextFunction) => {
        /*         const { authorization } = req.headers;
        if (!authorization) {
            throw new AppError("No authorization header", "Forbidden");
        }

        const token = authorization.split(" ");
        const user = validateToken(token[1]); */
        const user = req.user! as IUser;
        res.send(
            `This is an authenticated page and you are ${user.firstName} ${user.lastName}`
        );
    }
);

router.post(
    "/register",
    body([
        "username",
        "password",
        "confirmpassword",
        "email",
        "firstName",
        "lastName",
    ])
        .trim()
        .notEmpty()
        .escape(),
    body("email").isEmail(),
    body("password")
        .isStrongPassword()
        .withMessage("Nem elég bonyolult jelszó"),
    async (req: Request, res: Response, next: NextFunction) => {
        const validResult = validationResult(req);
        if (!validResult.isEmpty()) {
            res.status(400).send({ errors: validResult.array() });
        }
        try {
            // Get and validate data
            const {
                username,
                password,
                confirmpassword,
                email,
                firstName,
                lastName,
            } = req.body;

            if (password !== confirmpassword) {
                throw new AppError("Confirm password Error", "Bad Request");
            }

            // Hash password
            const securePassword = await hashPassword(password);

            // Create database entry
            const result = await UserSchema.createUser({
                username,
                password: securePassword,
                email,
                firstName,
                lastName,
            });

            if (!result[0]) {
                res.status(400).send(result[1] || "Error happened");
                return;
            }
            res.status(201).send("Created");
        } catch (err) {
            next(err);
        }
    }
);

router.put(
    "/change-password",
    body(["username", "oldpassword", "password", "confirmpassword"])
        .trim()
        .escape()
        .isEmpty(),
    body("username").toLowerCase(),
    body("password")
        .isStrongPassword()
        .withMessage("Nem elég bonyolult jelszó"),
    async (req: Request, res: Response, next: NextFunction) => {
        const validResult = validationResult(req);
        if (!validResult.isEmpty()) {
            res.send({ errors: validResult.array() });
        }
        try {
            // Get and validate data
            const { username, oldpassword, password, confirmpassword } =
                req.body;

            if (password !== confirmpassword) {
                throw new AppError("Confirm password Error", "Bad Request");
            }
            // Check oldpassword
            await checkUser(username, oldpassword);

            // Hash password
            const securePassword = await hashPassword(password);

            const result = await UserSchema.changePassword({
                username,
                password: securePassword,
            });

            if (result !== true) {
                res.status(400).send("Error happened");
                return;
            }
            res.status(201).send("Updated");
        } catch (err) {
            next(err);
        }
    }
);

async function checkUser(username: string, password: string) {
    try {
        // Get database entry
        const result = await UserSchema.getUserByName(username);

        // Validate user
        const isValidPassword = await comparePassword(
            password,
            result.password
        );
        if (!isValidPassword) {
            throw new AppError(
                "Username or Password does not match",
                "Unauthorized"
            );
        }
        return result.ID;
    } catch (err) {
        return err;
    }
}

export default router;
