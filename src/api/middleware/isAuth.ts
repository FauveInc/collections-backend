import jwt from "express-jwt";
import config from "../../config";

const getTokenFromHeader = (req) => {
    if (
        (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token") ||
        (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

const isAuth = jwt({
    getToken: getTokenFromHeader,
    secret: config.jwtSecret,
    userProperty: "token",
});

export default isAuth;
