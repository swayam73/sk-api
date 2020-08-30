const db  = require ('../helpers/db_connect');

function getIndustry(callback){
    let sql = "select industryName from industry;"
    db.QueryDB(sql,function(queryResult){
        callback(queryResult)
    })
}

module.exports = {getIndustry}