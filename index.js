const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
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

// router
app.use('/api/collections', jwtCheck, collections);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});