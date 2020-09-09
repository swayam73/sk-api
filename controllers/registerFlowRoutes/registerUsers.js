
const email = require('../../helpers/email.js');
const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');
const user = require('../../middlewares/User.js');
const { send } = require('process');

module.exports = function(app){

  app.get('/register/resendVerificationCode',function(req,res){

    res.header('Access-Control-Allow-Origin', '*');
    console.log("resend",req["query"].userName);

    var randNum = Math.floor(Math.random()*90000) + 10000;
    user.resendVerfication(req["query"].userName,randNum,function(dbUpdated){
      if(dbUpdated){
        email.sendVerificationEmail(req["query"].userName,randNum).then(result=>{
          console.log(result,"result")
          res.send("pass")
        })
      }else{
        res.status(555).send("Failed")
      }
      
      
    })
  })

  app.get('/register/recruiterVerify', function (req, res) {
     console.log(req.query.code,"verify call");
     user.findUserWithVerifyCode(req.query.code,function(status){
        if(status){
          res.redirect('http://localhost:4200/acntVerified')
        }else{
          res.status(600).send("Failed")
        }
     })
      
  })

  app.get('/register/forgotPass', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.query.userName,"forgotPass call",req);
    var randNum = Math.floor(Math.random()*90000) + 10000;
    user.isUser(req.query.userName,randNum,function(isUser){
      if(isUser){
        email.sendResetPasswordEmail(req.query.userName,randNum).then(emailRes=>{
          res.send("Pass:Reset password Email Sent")
        })
      }else{
        res.status(555).send("Failed")
      }
    })
 })

  app.post('/register/resetPass', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');

    if(validate.resetPassValidate(req.query)){
      console.log("request info",req['headers'])

      user.resetPass(req['headers'].username,req['headers'].code,req['headers'].pass,function(result){
        // result
        if(result){
          res.send('Pass')
        }else{
          res.status(555).send('Fail')
        }
        
        // email.sendVerificationEmail(result["orgEmail"]).then(data=>{
        //   console.log(data," send email data")
        //   console.log(result,"hanlder result",result["orgEmail"],result[0])
        //   if(result["orgEmail"] !== undefined){
        //     console.log('in here')
        //     return res.status(200).send(result["orgEmail"])
        //   }else{
        //     res.send('Create Recruiter FAILED')
        //   }
        // })
      })
    }else{
      res.send('Create Recruiter FAILED VALIDATION')
    }
    // user.findUserWithVerifyCode(req.query.code,function(status){
    //    if(status){
    //      res.redirect('http://localhost:4200/acntVerified')
    //    }else{
    //      res.status(600).send("Failed")
    //    }
    // })
     
 })


    app.post('/users/createCandidate', function (req, res) {
      res.header('Access-Control-Allow-Origin', '*');
      // context.callbackWaitsForEmptyEventLoop = false;
      if(validate.createCandidateValidate(req.query)){
        console.log("request info",req['headers'])

        var randNum = Math.floor(Math.random()*90000) + 10000;
        user.createCandidate(req['headers'],randNum,function(result){
          email.sendVerificationEmail(result["email"],randNum).then(data=>{
            console.log(data," send email data")
            console.log(result,"handler result",result["email"],result[0])
            if(result["email"] !== undefined){
              console.log('in here')
              return res.status(200).send(result["email"])
            }else{
              res.send('Create Candidate FAILED')
            }
          })
        })
      }else{
        res.send('Create Candidate FAILED VALIDATION')
      }
   
      })
      
      app.post('/users/createRecruiter', function (req, res) {
        
      res.header('Access-Control-Allow-Origin', '*');
        // context.callbackWaitsForEmptyEventLoop = false;
        if(validate.createRecruiterValidate(req.query)){
          console.log("request info",req['headers'])

          var randNum = Math.floor(Math.random()*90000) + 10000;
          user.createRecruiter(req['headers'],randNum,function(result){
            email.sendVerificationEmail(result["orgEmail"],randNum).then(data=>{
              console.log(data," send email data")
              console.log(result,"hanlder result",result["orgEmail"],result[0])
              if(result["orgEmail"] !== undefined){
                console.log('in here')
                return res.status(200).send(result["orgEmail"])
              }else{
                res.send('Create Recruiter FAILED')
              }
            })
          })
        }else{
          res.send('Create Recruiter FAILED VALIDATION')
        }
      })
      
      app.post('/users/updateRecruiterCompany', function (req, res) {
        // context.callbackWaitsForEmptyEventLoop = false;
        if(validate.updateRecruiterCompany(req.query)){
          user.updateRecruiterCompany(req.query,function(result){
            if(result["orgEmail"]){
              res.send(result)
            }else{
              res.send('Update Recruiter Company Info FAILED')
            }
          })
        }else{
          res.send('Update Recruiter Company Info FAILED VALIDATION')
        }
      })
      

    //other routes..
}