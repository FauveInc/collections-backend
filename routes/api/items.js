const express = require('express');

const router = express.Router();

const { createItem, createDetailRecord } = require('../../lib/queries');

router.post('/create', async(req, res) => {
    console.log('Create item route');
    const body = req.body;
    body.owner = req.user.sub;
    const itemResult = await createItem(body);
    if (!itemResult.success) {
        res.json({
            success: false,
            message: itemResult.error
        });
    }
    const itemData = itemResult.data[0];
    const detailResult = await createDetailRecord(itemData, req.body);
    if (detailResult.success) {
        res.json({
            success: true,
            message: detailResult.data
        });
    }
    res.json({
        success: false,
        message: detailResult.error
    });
});

module.exports = router;