const mysql = require('mysql');

//DataBase Connection
const db = mysql.createConnection({

    host: '127.0.0.1',
    user: 'root',
    password: '7253MHG7253mhg@!',
    database: 'ViolationDB'
}) ;

db.connect ((err) => {
    if (err) { 
        console.error('Error: Config not connecting to the database:', err);
    }
    else {
        console.log('Config is Connected to the database!');
    }
});
module.exports = db;