import axios from "axios";
import express from "express";
import { generateUUID, hashPassword } from "../../lib/auth";
import { createUser, getAllUsers } from "../../lib/queries";
import { rollbar } from "../../lib/rollbar";

export const router = express.Router();

router.post("/login", async (req: express.Request, res: express.Response) => {
    rollbar.info("Login route hit");
    // tslint:disable-next-line:no-console
    console.log(req.body);

    res.json({
        message: "This is just a test",
    });
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        rollbar.error("Invalid input params (register)");
        res.json({
            error: "Invalid input",
            success: false
        });
    }
    try {
        const hashedPassword = await hashPassword(password);
        const userId = generateUUID();
        const data = {
            email,
            password: hashedPassword,
            userId
        };
        const userResult = await createUser(data);
        res.json({
            data: userResult.data,
            success: true
        });
    } catch (err) {
        rollbar.error(err);
        res.json({
            error: err,
            success: false
        });
    }
});

// TODO: this endpoint definitely needs authentication
router.get("/list", async (req, res) => {
    try {
        const result = await getAllUsers();
        res.json({
            data: result.data,
            success: true,
        });
    } catch (err) {
        rollbar.error(err);
        res.json({
            error: err,
            success: true,
        });
    }
});
