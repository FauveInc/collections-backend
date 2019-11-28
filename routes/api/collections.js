const express = require('express');

const router = express.Router();

// @route GET /api/collections/test
// @desc Test new route for server deploys
// @access Public
router.get('/test', async(req, res) => {
    console.log('Test route hit');
    res.json({
        success: true,
        message: 'Test route hit'
    });
});

module.exports = router;