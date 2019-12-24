import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { IUserInputDTO } from "../../interfaces/Iuser";
const route = Router();

export default (app: Router) => {
    app.use("/auth", route);

    route.post(
        "/register",
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            // TODO: log to rollbar
            try {
                const authServiceInstance = Container.get(AuthService);
                const { user, token } = await authServiceInstance.Register(req.body as IUserInputDTO);
                return res.status(201).json({ user, token });
            } catch (err) {
                // TODO: log error to rollbar
                return next(err);
            }
        },
    );
};
