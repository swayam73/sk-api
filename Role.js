var mysql = require('mysql');
var config = require('./config.json');
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

function getRoles(callback){
    let sql = "select rt.roleTypeName,r.roleName from role r JOIN roleType rt on r.roleTypeID = rt.roleTypeID Order By rt.roleTypeName;"
    QueryDB(sql,function(queryResult){
        callback(queryResult)
    })
}

module.exports = {getRoles}