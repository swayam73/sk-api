var mysql = require('mysql');
var config = require('../config.json');
const Sequelize = require("sequelize");
var pool = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbname
});

function QueryDB(sql,callback){
    pool.getConnection(function(err, connection) {
        if (err) return err;
        // Use the connection
        console.log("Database connected");
        connection.query(sql, function(error, results, fields) {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error) {
                callback(error);
            } else {
                callback(results);
            }
        })
    })
}
module.exports = {QueryDB};