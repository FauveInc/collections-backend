const express = require('express');

const router = express.Router();

const { createCollection, getUserCollections } = require('../../lib/queries');

// @route POST /api/collections/create
// @desc Route to create new collection
// @access Authenticated
// TODO: this try/catch is clunky; look up better ways to handle await calls (should have no errors logged though)
router.post('/create', async(req, res) => {
    console.log('Create route hit');    // TODO: remove this line when function is finished
    const values = {
        ...req.body,
        owner: req.user.sub
    };
    try {
        const result = await createCollection(values);
        if (result.success) {
            res.json({
                success: true,
                message: result.data
            });
        } else {
            res.json({
                success: true,
                message: result.error
            })
        }
    } catch(err) {
        // TODO: implement utility function that sends res.json with whatever json payload (data and errors should be separate)
        res.json({
            success: false,
            message: err
        });
    }
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