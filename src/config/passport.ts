import {
    Strategy as JwtStrategy,
    ExtractJwt,
    StrategyOptionsWithoutRequest,
    VerifiedCallback,
} from "passport-jwt";
import { UserSchema } from "../models/usersModel";

const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PUBLIC_KEY!.replace(/\\n/g, "\n") as string,
    algorithms: ["RS256"],
};

function verifyJWT(jwtPayload: { id: string }, done: VerifiedCallback) {
    UserSchema.getUserById(jwtPayload.id)
        .then((user) => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch((err) => {
            return done(err, false);
        });
}

export const passportJwtStrategy = new JwtStrategy(options, verifyJWT);
