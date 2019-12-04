const express = require('express');

const router = express.Router();

router.post('/create', async(req, res) => {
    console.log('Create item route');
    res.json({
        success: true,
        message: 'Not implemented yet'
    });
});

module.exports = router;