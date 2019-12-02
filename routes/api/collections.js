const express = require('express');

const router = express.Router();

const { testCollections, createCollection } = require('../../lib/queries');

// @route GET /api/collections/test
// @desc Test new route for server deploys
// @access Public
router.get('/test', async(req, res) => {
    console.log('Updated test route hit');
    const result = await testCollections();
    if (result.success) {
        res.json({
            success: true,
            message: result.data
        });
    } else {
        res.json({
            success: false,
            message: 'An error occurred'
        });
    }
});

router.post('/create', async(req, res) => {
    console.log('Create route hit');
    const values = req.body;
    values.owner = req.user.sub;
    const result = await createCollection(values);
    if (result.success) {
        res.json({
            success: true,
            message: result.data
        })
    }
    res.json({
        success: false,
        message: result.error
    });
});

module.exports = router;