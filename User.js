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

function createRecruiter(data,callback){
    let sql = "INSERT INTO `sk_dev`.`recruiter`(`first_name`,`last_name`,`org_email`,`contact_number`,`password`,`linkedin_url`,`org_id`)" +
        "VALUES ( '" + data.first_name + "','" + data.last_name + "','" + data.org_email + "','" + data.contact_number + "','" + data.password + "','" + data.linkedin_url + "'," + 2 + ");";
    
    QueryDB(sql,function(queryResult){
        if (queryResult.affectedRows==1){
            callback("PASS")
        }else{

        }
    })
}


function createCandidate(data,callback){
    let sql = "INSERT INTO `sk_dev`.`candidate`(`first_name`,`last_name`,`email`,`mobile_phone`,`password`,`linkedin_url`)" +
        "VALUES ( '" + data.first_name + "','" + data.last_name + "','" + data.email + "','" + data.mobile_phone + "','" + data.password + "','" + data.linkedin_url + "');";
    QueryDB(sql,function(queryResult){
        if (queryResult.affectedRows==1){
            callback("PASS")
        }else{

        }
    })
}
    
 

module.exports = {createRecruiter,createCandidate}