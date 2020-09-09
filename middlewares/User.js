const db  = require ('../helpers/db_connect');


// function createCandidate(data,randNum,callback){
//     //let sql = "INSERT INTO `sk_dev`.`candidate`(`firstName`,`lastName`,`email`,`contactNumber`,`password`,`linkdinUrl`)" +
//     //    "VALUES ( '" + data.first_name + "','" + data.last_name + "','" + data.email + "','" + data.mobile_phone + "','" + data.password + "','" + data.linkedin_url + "');";
//     let sql = "CALL createCandidate" +
//         "( '" + data.first_name + "','" + data.last_name + "','" + data.email+ "','" + data.mobile_phone + "','" + randNum + "','" + data.password + "');";
//     console.log(sql);
//     db.QueryDB(sql,function(queryResult,err){
//         console.log(queryResult);
//         if (queryResult[0][0]["email"]){
//             callback(queryResult[0][0])
//         }else if (queryResult[0][0]["Candidate EXISTS"]){
//             callback("Candidate EXISTS")
//         }else{
//             console.log(sql,"sql",queryResult,err)
//             callback("Query Failed")
//         }
//     })
// }

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
        if(queryResult[0] && (queryResult[0]['orgEmail'] !== undefined || queryResult[0]['orgEmail'] !== null )){
            callback(true);
        }else{callback(false)}
        
    })
}


function resendVerfication(userName,code,callback){
    console.log(userName,"userName")
    let sql ="CALL createNewVerificationCode('"+userName+"','"+code+"')";
    console.log(sql,"sql resendVerfication")
    db.QueryDB(sql,function(queryResult){
        if(queryResult[0] && queryResult[0][0] && (queryResult[0][0]['orgEmail'] !== undefined && queryResult[0][0]['orgEmail'] !== null )){
            console.log(queryResult,"result for resendVerfication")
        console.log(queryResult[0][0]['orgEmail'],queryResult[0][0],"1result for resendVerfication")
        
            callback(true);
        }else{callback(false)}
        
    })
}

function isUser(userName,randNum,callback){
    let sql ="CALL isUser('"+userName+"','"+randNum+"')";
    db.QueryDB(sql,function(queryResult){
        if(queryResult[0] && queryResult[0][0] && (queryResult[0][0]['verifiedUser'] !== undefined && queryResult[0][0]['verifiedUser'] === 1 )){
            console.log(queryResult,"result for resendVerfication")
        console.log(queryResult[0][0]['orgEmail'],queryResult[0][0],"1result for resendVerfication")
        
            callback(true);
        }else if(queryResult[0] && queryResult[0][0] && (queryResult[0][0]['verifiedUser'] !== undefined && queryResult[0][0]['verifiedUser'] === 0)){
            callback('Not Valid user')
        }else{callback(false)}
        
    })
}

function resetPass(userName,code,pass,callback){
    let sql ="CALL resetPass('"+userName+"','"+code+"','"+pass+"')";
    
    db.QueryDB(sql,function(queryResult){
        console.log(sql,"stuff")
        if(queryResult[0] && queryResult[0][0] && (queryResult[0][0]['result'] !== undefined && queryResult[0][0]['result'] !== 'USER NOT FOUND' )){
            console.log('we good') 
            callback(true);
        }else{callback(false)}
        
    })
}

module.exports = {resetPass,isUser,resendVerfication,createRecruiter,updateRecruiterCompany,findUserWithVerifyCode}