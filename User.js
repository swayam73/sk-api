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
function createRecruiter(data,callback){
    let sql = "CALL createRecruiter" +
        "( '" + data.header.first_name + "','" + data.header.last_name + "','" + data.header.org_email + "','" + data.header.contact_number + "','" + data.header.password + "');";
    console.log(sql,"sql",data)
    QueryDB(sql,function(queryResult){
        if (queryResult[0][0]["orgEmail"]){
            callback(queryResult[0][0])
        }else if (queryResult[0][0]["USER EXISTS"]){
            callback("FAIL")
        }
    })
}


    
function updateRecruiterCompany(data,callback){
    let sql = "CALL UpdateRecruiterCompany ('"+data.recruiterEmail+"','"+data.companyName+"','"+data.companyDescription+"','"+data.companyWebsite+"');"

    QueryDB(sql,function(queryResult){
        console.log(queryResult,"udpated company")
        if (queryResult[0][0]["orgEmail"]){
            callback(queryResult[0][0])
        }else{
            callback("FAIL")
        }
    })
} 

module.exports = {createRecruiter,createCandidate,updateRecruiterCompany}