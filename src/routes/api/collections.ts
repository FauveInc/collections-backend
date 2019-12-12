import express from "express";

export const router = express.Router();

import { createCollection, getUserCollections } from "../../lib/queries";
import { ILooseObject } from "../../lib/types";

// @route POST /api/collections/create
// @desc Route to create new collection
// @access Authenticated
// TODO: this try/catch is clunky; look up better ways to handle await calls (should have no errors logged though)
router.post("/create", async (req: ILooseObject, res) => {
    // tslint:disable-next-line:no-console
    console.log("Create route hit");    // TODO: remove this line when function is finished
    const values = {
        ...req.body,
        owner: req.user.sub,
    };
    try {
        const result = await createCollection(values);
        if (result.success) {
            res.json({
                message: result.data,
                success: true,
            });
        } else {
            res.json({
                message: result.error,
                success: true,
            });
        }
    } catch (err) {
        // TODO: implement utility function that sends res.json with whatever json payload
        // (data and errors should be separate)
        res.json({
            message: err,
            success: false,
        });
    }
});

// @route GET /api/collections/user/:userID
// @desc Get the collections for a user
// @access Authenticated
router.get("/user/:userID", async (req: ILooseObject, res) => {
    // tslint:disable-next-line:no-console
    console.log("Collection route hit");
    const userID = req.params.userID;
    if (userID !== req.user.sub) {
        res.json({
            message: "Invalid user",
            success: false,
        });
    }
    const result = await getUserCollections(userID);
    if (result.success) {
        res.json({
            message: result.data,
            success: true,
        });
    }
    res.json({
        message: result.error,
        success: false,
    });
});
