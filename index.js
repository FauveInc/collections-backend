const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const _ = require('lodash');
const { jwtCheck } = require('./middleware/authentication');

const app = express();

// bodyParser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// cors middleware
app.use(cors());

// load routes
const collections = require('./routes/api/collections');
const items = require('./routes/api/items');

// router
app.use('/api/collections', jwtCheck, collections);
app.use('/api/items/', jwtCheck, items);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});