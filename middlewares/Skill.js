const db  = require ('../helpers/db_connect');

function getSkills(callback){
    let sql = "select s.skillName,st.skillTypeName from skill s JOIN skillType st on s.skillTypeID = st.skillTypeID Order By st.skillTypeName;"
    db.QueryDB(sql,function(queryResult){
        callback(queryResult)
    })
}

module.exports = {getSkills}