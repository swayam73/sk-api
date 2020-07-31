var mysql = require('mysql');
var config = require('./config.json');
var pool = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbname
});


exports.handler = (event, context, callback) => {
    //prevent timeout from waiting event loop
    console.log(event, "eventMethod 12345")
    context.callbackWaitsForEmptyEventLoop = false;
    if (event.context["http-method"] === "GET") {
        pool.getConnection(function(err, connection) {
            if (err) return err;
            // Use the connection
            connection.query('SELECT * from sk_dev.recruiter where id=1', function(error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) {
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify({ failedReason: error }),
                    };
                    callback(response);

                } else {

                    const response = {
                        statusCode: 200,
                        body: { personalInfo: results[0] },
                    };
                    callback(null, response);
                }

            });
        });
    } else if (event.context["http-method"] === "POST") {
        const response = {
            statusCode: 200,
            body: "Update ifno",
        };
        callback(null, response);
    } else if (event.context["http-method"] === "PUT") {
        if (event.params.querystring.action && event.params.querystring.values && event.params.querystring.action == "addnewRecruiter" && userValidation(event.params.querystring.values)) {
            let data = JSON.parse(event.params.querystring.values);
            let sql = "INSERT INTO `sk_dev`.`recruiter`(`first_name`,`last_name`,`org_email`,`mobile_phone`,`password`,`industry`,`org_id`)" +
                "VALUES ( " + data.first_name + data.last_name + data.org_email + data.mobile_phone + data.password + "," + data.industry + "," + 2 + ");";

            pool.getConnection(function(err, connection) {
                if (err) return err;
                // Use the connection
                connection.query(sql, function(error, results, fields) {
                    // And done with the connection.
                    connection.release();
                    // Handle error after the release.
                    if (error) {
                        const response = {
                            statusCode: 200,
                            body: JSON.stringify({ failedReason: error }),
                        };
                        callback(JSON.stringify(response));
                    } else {
                        console.log(results, "put results ssssss")
                        const response = {
                            statusCode: 200,
                            body: { personalInfo: results[0] },
                        };
                        callback(null, response);
                    }
                })
            })
        } else {
            const response = {
                statusCode: 400,
                body: JSON.stringify({ failedReason: "no Action Found SK Custom Error" }),
            };
            callback(null, response);
        }

    }

    function userValidation(data) {
        if (data.first_name && data.last_name && data.org_email && data.mobile_phone && data.password && data.org && data.industry) {
            return true;
        }
        return false;
    }
}