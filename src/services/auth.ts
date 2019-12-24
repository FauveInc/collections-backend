import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import uuidv4 from "uuid/v4";
import config from "../config";
import { IUser, IUserInputDTO } from "../interfaces/Iuser";

export default class AuthService {
    public async Register(userInputDTO: IUserInputDTO): Promise<{ user: IUser, token: string }> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(userInputDTO.password, salt);
            const uuid = uuidv4();
            // use sequelize to create new user in the database
            // generate token
            const token = this.generateToken({ _id: "12345" });
            // dispatch welcome email
            // dispatch register event
            // get user object
            return { user: { _id: "test"}, token };
        } catch (err) {
            // TODO: log error to rollbar
            throw err;
        }
    }

    private generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign(
            {
                _id: user._id,
            },
            config.jwtSecret,
        );
    }
}
