import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as _ from "lodash";
import "./env";
import { jwtCheck } from "./middleware/authentication";

const app = express();

// bodyParser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// cors middleware
app.use(cors());

// load routes
import { router as collections} from "./routes/api/collections";
import { router as items } from "./routes/api/items";

// router
app.use("/api/collections", jwtCheck, collections);
app.use("/api/items/", jwtCheck, items);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server running on port ${port}`);
});
