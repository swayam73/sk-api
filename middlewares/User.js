const db  = require ('../helpers/db_connect');


function createCandidate(data,callback){
    let sql = "INSERT INTO `sk_dev`.`candidate`(`first_name`,`last_name`,`email`,`mobile_phone`,`password`,`linkedin_url`)" +
        "VALUES ( '" + data.first_name + "','" + data.last_name + "','" + data.email + "','" + data.mobile_phone + "','" + data.password + "','" + data.linkedin_url + "');";
    db.QueryDB(sql,function(queryResult){
        if (queryResult.affectedRows==1){
            callback("PASS")
        }else{

        }
    })
}
function createRecruiter(data,randNum,callback){
    let sql = "CALL createRecruiter" +
        "( '" + data.first_name + "','" + data.last_name + "','" + data.org_email + "','" + data.contact_number + "','" + randNum + "','" + data.password + "');";
    
    db.QueryDB(sql,function(queryResult,err){
        if (queryResult[0][0]["orgEmail"]){
            callback(queryResult[0][0])
        }else if (queryResult[0][0]["USER EXISTS"]){
            callback("USER EXISTS")
        }else{
            console.log(sql,"sql",queryResult,err)
            callback("Query Failed")
        }
    })
}


    
function updateRecruiterCompany(data,callback){
    let sql = "CALL UpdateRecruiterCompany ('"+data.recruiterEmail+"','"+data.companyName+"','"+data.companyDescription+"','"+data.companyWebsite+"');"

    db.QueryDB(sql,function(queryResult){
        console.log(queryResult,"udpated company")
        if (queryResult[0][0]["orgEmail"]){
            callback(queryResult[0][0])
        }else{
            callback("FAIL")
        }
    })
} 



function findUserWithVerifyCode(code,callback){
    let sql ="CALL verifyRecruiter('"+code+"')";
    console.log(sql,"sql verifyRecruiter")
    db.QueryDB(sql,function(queryResult){
        console.log(queryResult,"result for verify")
        callback(true);
        
    })
}


function resendVerfication(userName,code,callback){
    console.log(userName,"userName")
    let sql ="CALL createNewVerificationCode('"+userName+"','"+code+"')";
    console.log(sql,"sql resendVerfication")
    db.QueryDB(sql,function(queryResult){
        console.log(queryResult,"result for resendVerfication")
        callback(true);
        
    })
}

module.exports = {resendVerfication,createRecruiter,createCandidate,updateRecruiterCompany,findUserWithVerifyCode}