const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const testCollections = async function() {
    try {
        const res = await pool.query('SELECT * FROM collections_test');
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
    testCollections
}