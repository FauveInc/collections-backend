import jwt from "express-jwt";
import jwks from "jwks-rsa";

export const jwtCheck = jwt({
    algorithms: ["RS256"],
    audience: "https://collectionsapp.herokuapp.com",
    issuer: "https://collectionsapp.auth0.com/",
    secret: jwks.expressJwtSecret({
        cache: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://collectionsapp.auth0.com/.well-known/jwks.json",
        rateLimit: true,
    }),
});
