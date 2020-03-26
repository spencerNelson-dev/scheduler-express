const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.PG_CONNECT_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})


module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
}