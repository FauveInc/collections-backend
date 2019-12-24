import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as _ from "lodash";
import routes from "./api";
import config from "./config";
import "./env";
import { rollbar } from "./lib/rollbar";
import { jwtCheck } from "./middleware/authentication";

const app = express();

// rollbar
app.use(rollbar.errorHandler());

// bodyParser middleware
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json({
    type: "application/json"
}));

// cors middleware
app.use(cors());

app.use(config.api.prefix, routes());

// load routes
import { router as collections} from "./routes/api/collections";
import { router as items } from "./routes/api/items";
import { router as users } from "./routes/api/users";

// router
app.use("/api/collections", jwtCheck, collections);
app.use("/api/items", jwtCheck, items);
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server running on port ${port}`);
    rollbar.info(`Server started on port ${port}`);
});
