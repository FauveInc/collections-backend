import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as _ from "lodash";
import routes from "./api";
import config from "./config";
import "./env";
import { rollbar } from "./lib-OLD/rollbar";

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server running on port ${port}`);
    rollbar.info(`Server started on port ${port}`);
});
