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

const createItem = async function(values) {
    const text = 'INSERT INTO items (collection_id, current_possession, status) VALUES($1, $2, $3) RETURNING *';
    // check values
    const confirmedVals = {};
    confirmedVals.collection_id = _.get(values, 'collection_id', "");
    if (confirmedVals.collection_id.length === 0 || confirmedVals.collection_id.length > 50) {
        return {
            success: false,
            error: 'Invalid collection id'
        };
    }
    confirmedVals.status = _.get(values, 'status', 'VISIBLE').toUpperCase();
    if (confirmedVals.status.length === 0 || confirmedVals.status.length > 50) {
        return {
            success: false,
            error: 'Invalid status'
        };
    }
    confirmedVals.current_possession = _.get(values, 'owner', '');
    if (confirmedVals.current_possession.length == 0 || confirmedVals.current_possession.length > 50) {
        return {
            success: false,
            error: 'Invalid owner'
        };
    }
    try {
        const sqlValues = [
            confirmedVals.collection_id,
            confirmedVals.current_possession,
            confirmedVals.status
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

const createDetailRecord = async function(itemData, reqBody) {
    const type = _.get(reqBody, 'type','').toUpperCase();
    if (type === 'BOOK') {
        try {
            const res = await createBook(itemData, reqBody);
            return {
                success: true,
                data: res.data
            };
        } catch(err) {
            console.log(err);
            return {
                success: false,
                error: err
            };
        }
    }
    if (type === 'RECORD') {
        try {
            const res = await createRecord(itemData, reqBody);
            return {
                success: true,
                data: res.data
            };
        } catch(err) {
            console.log(err);
            return {
                success: false,
                error: err
            };
        }
    }
    return {
        success: false,
        error: 'Invalid detail type'
    };
}

const createRecord = async function(itemData, reqBody) {
    const text = 'INSERT INTO record_details (item_id, album_name, artist, condition, genre, year) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    // check values
    const confirmedVals = {};
    confirmedVals.item_id = _.get(itemData, 'id', null);
    if (confirmedVals.item_id == null) {
        return {
            success: false,
            error: 'Invalid item_id'
        };
    }
    confirmedVals.album_name = _.get(reqBody, 'album_name', '');
    confirmedVals.artist = _.get(reqBody, 'artist', '');
    confirmedVals.condition = _.get(reqBody, 'condition', '');
    confirmedVals.genre = _.get(reqBody, 'genre', '');
    confirmedVals.year = _.get(reqBody, 'year', null);
    try {
        const sqlValues = [
            confirmedVals.item_id,
            confirmedVals.album_name,
            confirmedVals.artist,
            confirmedVals.condition,
            confirmedVals.genre,
            confirmedVals.year
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

const createBook = async function(itemData, reqBody) {
    const text = 'INSERT INTO book_details (item_id, title, author, condition, genre, year) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    // check values
    const confirmedVals = {};
    confirmedVals.item_id = _.get(itemData, 'id', null);
    if (confirmedVals.item_id == null) {
        return {
            success: false,
            error: 'Invalid item_id'
        };
    }
    confirmedVals.title = _.get(reqBody, 'title', '');
    confirmedVals.author = _.get(reqBody, 'author', '');
    confirmedVals.condition = _.get(reqBody, 'condition', '');
    confirmedVals.genre = _.get(reqBody, 'genre', '');
    confirmedVals.genre = _.get(reqBody, 'year', null);
    try {
        const sqlValues = [
            confirmedVals.item_id,
            confirmedVals.title,
            confirmedVals.author,
            confirmedVals.condition,
            confirmedVals.genre,
            confirmedVals.year
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
    getUserCollections,
    createItem,
    createDetailRecord
}