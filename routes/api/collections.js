const express = require('express');

const router = express.Router();

const { testCollections } = require('../../lib/queries');

// @route GET /api/collections/test
// @desc Test new route for server deploys
// @access Public
router.get('/test', async(req, res) => {
    console.log('Test route hit');
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

module.exports = router;