const express = require('express');

const router = express.Router();

const { createItem } = require('../../lib/queries');

router.post('/create', async(req, res) => {
    console.log('Create item route');
    const body = req.body;
    body.owner = req.user.sub;
    const result = await createItem(body);
    if (result.success) {
        res.json({
            success: true,
            message: result.data
        });
    }
    res.json({
        success: false,
        message: result.error
    });
});

module.exports = router;