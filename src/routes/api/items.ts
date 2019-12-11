import express from "express";
import { ILooseObject } from "../../lib/types";

export const router = express.Router();

import { createDetailRecord, createItem } from "../../lib/queries";

router.post("/create", async (req: ILooseObject, res) => {
    // tslint:disable-next-line:no-console
    console.log("Create item route");
    const body = req.body;
    body.owner = req.user.sub;
    const itemResult = await createItem(body);
    if (!itemResult.success) {
        res.json({
            message: itemResult.error,
            success: false,
        });
    }
    const itemData = itemResult.data[0];
    const detailResult = await createDetailRecord(itemData, req.body);
    if (detailResult.success) {
        res.json({
            message: detailResult.data,
            success: true,
        });
    }
    res.json({
        message: detailResult.error,
        success: false,
    });
});
