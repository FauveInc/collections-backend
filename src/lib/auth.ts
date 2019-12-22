import bcrypt from "bcryptjs";
import { rollbar } from "../lib/rollbar";

const SALTROUNDS = 10;

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALTROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return {
            hash,
            success: true
        };
    } catch (err) {
        rollbar.error(err);
        return {
            error: err,
            success: false
        };
    }
};
