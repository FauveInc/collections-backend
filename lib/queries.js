const _ = require('lodash');
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}?ssl=true`
});

const getUserCollections = async function(userID) {
    const text = 'SELECT * FROM collections WHERE owner = $1';
    const values = [userID];
    try {
        const res = await pool.query(text, values);
        return {
            success: true,
            data: res.rows
        };
    } catch(err) {
        console.log(err);
        return {
            success: false,
            error: err
        };
    }
}

const createCollection = async function(values) {
    const text = 'INSERT INTO collections (name, type, visibility, owner) VALUES($1, $2, $3, $4) RETURNING *';
    // check values
    const confirmedVals = {};
    confirmedVals.name = _.get(values, 'name', "");
    if (confirmedVals.name.length === 0 || confirmedVals.name.length > 50) {
        return {
            success: false,
            error: 'Invalid name'
        };
    }
    confirmedVals.type =_.get(values, 'type', "").toUpperCase();
    if (!['BOOKS', 'RECORDS'].includes(confirmedVals.type)) {
        return {
            success: false,
            error: 'Invalid type'
        };
    }
    confirmedVals.visibility = _.get(values, 'visibility', "").toUpperCase();
    if (!['PRIVATE', 'PUBLIC', 'NETWORK'].includes(confirmedVals.visibility)) {
        return {
            success: false,
            error: 'Invalid visibility'
        };
    }
    confirmedVals.owner = _.get(values, 'owner', "");
    if (confirmedVals.owner.length === 0 || confirmedVals.owner.length > 50) {
        return {
            success: false, 
            error: 'Invalid owner'
        };
    }
    try {
        const sqlValues = [
            confirmedVals.name,
            confirmedVals.type,
            confirmedVals.visibility,
            confirmedVals.owner
        ];
        const res = await pool.query(text, sqlValues);
        return {
            success: true,
            data: res.rows
        };
    } catch(err) {
        console.log(err);
        return {
            success: false,
            error: err
        };
    }
}

module.exports = {
    createCollection,
    getUserCollections
}