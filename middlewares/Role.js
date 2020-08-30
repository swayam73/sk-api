const db  = require ('../helpers/db_connect');

function getRoles(callback){
    let sql = "select rt.roleTypeName,r.roleName from role r JOIN roleType rt on r.roleTypeID = rt.roleTypeID Order By rt.roleTypeName;"
    db.QueryDB(sql,function(queryResult){
        callback(queryResult)
    })
}

module.exports = {getRoles}