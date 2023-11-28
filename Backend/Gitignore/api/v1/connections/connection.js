const mysql = require('mysql');
require('dotenv').config();


// This is for connect
// const connectionEasifi = mysql.createConnection({
// host: process.env.DB_HOST_v1,
// user: process.env.DB_USER_v1,
// password: process.env.DB_PASS_v1, 
// database: process.env.DB_DATABASE_v1
// });


// This is for pool connect
const connectionEasifi = mysql.createPool({
    connectionLimit: 500,
    host: process.env.DB_HOST_v1,
    user: process.env.DB_USER_v1,
    password: process.env.DB_PASS_v1,
    database: process.env.DB_DATABASE_v1
});


// Use only testing time
const connectionEasifiTesting = mysql.createPool({
    connectionLimit: 500,
    host: "localhost",
    user: "root",
    password: "",
    database: "easifi"
});


module.exports = {
    connectionEasifiMYSQL: connectionEasifi,
    // connectionEasifiMYSQL: connectionEasifiTesting
}