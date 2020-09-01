const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');
const user = require('../../middlewares/User.js');
const conn  = require ('../helpers/db_connect');

const express = require('express')  
const router = express.Router()  
const sql = require('mysql')  
var routes = function () {
    router.route('/users/candidate')
        .get(function (req, res) {
            conn.connect().then(function () {
                var sqlQuery = "SELECT * FROM candidate";
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset) {
                    res.json(recordset.recordset);
                    conn.close();
                })
                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
            })
                .catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
        });

    router.route('/users/candidate')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("firstName", sql.VarChar(50), req.body.firstName)
                    request.input("lastName", sql.VarChar(50), req.body.lastName)
                    request.input("Email", sql.VarChar(50), req.body.Email)
                    request.input("contactNumber", sql.VarChar(10), req.body.contactNumber)
                    request.input("password", sql.VarChar(50), req.body.password)
                    request.execute("createCandidate").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });

    return router;
};
module.exports = routes;