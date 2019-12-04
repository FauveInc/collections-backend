const express = require('express');

const router = express.Router();

const { createCollection, getUserCollections } = require('../../lib/queries');

// @route POST /api/collections/create
// @desc Route to create new collection
// @access Authenticated
router.post('/create', async(req, res) => {
    console.log('Create route hit');
    const values = req.body;
    values.owner = req.user.sub;
    const result = await createCollection(values);
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

// @route GET /api/collections/user/:userID
// @desc Get the collections for a user
// @access Authenticated
router.get('/user/:userID', async(req, res) => {
    console.log('Collection route hit');
    const userID = req.params.userID;
    if (userID != req.user.sub) {
        res.json({
            success: false,
            message: 'Invalid user'
        });
    }
    const result = await getUserCollections(userID);
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