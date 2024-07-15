const mysql2 = require('mysql2');
const dotenv = require('dotenv');

let conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

conn.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('DB is Connected')
})

module.exports = conn;
