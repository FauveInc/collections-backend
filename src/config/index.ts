import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export default {
    // secrets should go here

    /**
     * API config
     */
    api: {
        prefix: "/api",
    },

    /**
     * JWT config
     */
    jwtSecret: process.env.JWT_SECRET,
};
