const express = require('express');

const router = express.Router();

const { testCollections, createCollection, getUserCollections } = require('../../lib/queries');

// @route GET /api/collections/test
// @desc Test new route for server deploys
// @access Authenticated
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
        })
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