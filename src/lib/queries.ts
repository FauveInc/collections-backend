import * as _ from "lodash";
import { Pool } from "pg";
import { rollbar } from "../lib/rollbar";
import { ILooseObject } from "../lib/types";
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}?ssl=true`,
});

export const getAllUsers = async () => {
    const text = "SELECT * FROM users";
    try {
        const res = await pool.query(text);
        return {
            data: res.rows,
            success: true,
        };
    } catch (err) {
        rollbar.error(err);
        return {
            error: err,
            success: false,
        };
    }
};

export const createUser = async ({ userId, email, password }) => {
    const text = "INSERT INTO users (user_id, email, password) VALUES ($1, $2, $ 3) RETURNING *";
    const values = [userId, email, password];
    const res = await pool.query(text, values);
    return {
        data: res.rows,
        success: true,
    };
};

export const getUserCollections = async (userID: string) => {
    const text = "SELECT * FROM collections WHERE owner = $1";
    const values = [userID];
    const res = await pool.query(text, values);             // TODO: should we catch this error or handle on top call
    return {
        data: res.rows,
        success: true,
    };
};

export const createItem = async (values) => {
    const text = "INSERT INTO items (collection_id, current_possession, status) VALUES($1, $2, $3) RETURNING *";
    // check values
    const confirmedVals: ILooseObject = {};
    confirmedVals.collection_id = _.get(values, "collection_id", "");
    if (confirmedVals.collection_id.length === 0 || confirmedVals.collection_id.length > 50) {
        return {
            error: "Invalid collection id",
            success: false,
        };
    }
    confirmedVals.status = _.get(values, "status", "VISIBLE").toUpperCase();
    if (confirmedVals.status.length === 0 || confirmedVals.status.length > 50) {
        return {
            error: "Invalid status",
            success: false,
        };
    }
    confirmedVals.current_possession = _.get(values, "owner", "");
    if (confirmedVals.current_possession.length === 0 || confirmedVals.current_possession.length > 50) {
        return {
            error: "Invalid owner",
            success: false,
        };
    }
    try {
        const sqlValues = [
            confirmedVals.collection_id,
            confirmedVals.current_possession,
            confirmedVals.status,
        ];
        const res = await pool.query(text, sqlValues);
        return {
            data: res.rows,
            success: true,
        };
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return {
            error: err,
            success: false,
        };
    }
};

export const createDetailRecord = async (itemData, reqBody) => {
    const type = _.get(reqBody, "type", "").toUpperCase();
    if (type === "BOOK") {
        try {
            const res = await createBook(itemData, reqBody);
            return {
                data: res.data,
                success: true,
            };
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
            return {
                error: err,
                success: false,
            };
        }
    }
    if (type === "RECORD") {
        try {
            const res = await createRecord(itemData, reqBody);
            return {
                data: res.data,
                success: true,
            };
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
            return {
                error: err,
                success: false,
            };
        }
    }
    return {
        error: "Invalid detail type",
        success: false,
    };
};

const createRecord = async (itemData, reqBody) => {
    const text = "INSERT INTO record_details (item_id, album_name, artist, condition, genre, year) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    // check values
    const confirmedVals: ILooseObject = {};
    confirmedVals.item_id = _.get(itemData, "id", null);
    if (confirmedVals.item_id == null) {
        return {
            error: "Invalid item_id",
            success: false,
        };
    }
    confirmedVals.album_name = _.get(reqBody, "album_name", "");
    confirmedVals.artist = _.get(reqBody, "artist", "");
    confirmedVals.condition = _.get(reqBody, "condition", "");
    confirmedVals.genre = _.get(reqBody, "genre", "");
    confirmedVals.year = _.get(reqBody, "year", null);
    try {
        const sqlValues = [
            confirmedVals.item_id,
            confirmedVals.album_name,
            confirmedVals.artist,
            confirmedVals.condition,
            confirmedVals.genre,
            confirmedVals.year,
        ];
        const res = await pool.query(text, sqlValues);
        return {
            data: res.rows,
            success: true,
        };
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return {
            error: err,
            success: false,
        };
    }
};

const createBook = async (itemData, reqBody) => {
    const text = "INSERT INTO book_details (item_id, title, author, condition, genre, year) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    // check values
    const confirmedVals: ILooseObject = {};
    confirmedVals.item_id = _.get(itemData, "id", null);
    if (confirmedVals.item_id == null) {
        return {
            error: "Invalid item_id",
            success: false,
        };
    }
    confirmedVals.title = _.get(reqBody, "title", "");
    confirmedVals.author = _.get(reqBody, "author", "");
    confirmedVals.condition = _.get(reqBody, "condition", "");
    confirmedVals.genre = _.get(reqBody, "genre", "");
    confirmedVals.genre = _.get(reqBody, "year", null);
    try {
        const sqlValues = [
            confirmedVals.item_id,
            confirmedVals.title,
            confirmedVals.author,
            confirmedVals.condition,
            confirmedVals.genre,
            confirmedVals.year,
        ];
        const res = await pool.query(text, sqlValues);
        return {
            data: res.rows,
            success: true,
        };
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return {
            error: err,
            success: false,
        };
    }
};

export const createCollection = async (values) => {
    const text = "INSERT INTO collections (name, type, visibility, owner) VALUES($1, $2, $3, $4) RETURNING *";
    // check values
    const confirmedVals: ILooseObject = {};
    confirmedVals.name = _.get(values, "name", "");
    if (confirmedVals.name.length === 0 || confirmedVals.name.length > 50) {
        return {
            error: "Invalid name",
            success: false,
        };
    }
    confirmedVals.type = _.get(values, "type", "").toUpperCase();
    if (!["BOOKS", "RECORDS"].includes(confirmedVals.type)) {
        return {
            error: "Invalid type",
            success: false,
        };
    }
    confirmedVals.visibility = _.get(values, "visibility", "").toUpperCase();
    if (!["PRIVATE", "PUBLIC", "NETWORK"].includes(confirmedVals.visibility)) {
        return {
            error: "Invalid visibility",
            success: false,
        };
    }
    confirmedVals.owner = _.get(values, "owner", "");
    if (confirmedVals.owner.length === 0 || confirmedVals.owner.length > 50) {
        return {
            error: "Invalid owner",
            success: false,
        };
    }
    try {
        const sqlValues = [
            confirmedVals.name,
            confirmedVals.type,
            confirmedVals.visibility,
            confirmedVals.owner,
        ];
        const res = await pool.query(text, sqlValues);
        return {
            data: res.rows,
            success: true,
        };
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return {
            error: err,
            success: false,
        };
    }
};
