import { Request, Response, Router } from "express";
const route = Router();

export default (app: Router) => {
    app.use("/users", route);

    // TODO: This needs middleware and an actual user response
    route.get("/me", (req: Request, res: Response) => {
        return res.json({ user: "current user" }).status(200);
    });
};
