
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
    user.resendVerfication(req["query"].userName,randNum,function(result){
      email.sendVerificationEmail(req["query"].userName,randNum,function(result){

        console.log(result,"result")
        res.send("pass")
      })
      
    })
  })

  app.get('/register/recruiterVerify', function (req, res) {
     console.log(req.query.code,"verify call");
     user.findUserWithVerifyCode(req.query.code,function(status){
        if(status){
          res.send('worked')
        }else{
          res.status(600).send("Failed")
        }
     })
      
  })





    app.post('/users/createCandidate', function (req, res) {
        // context.callbackWaitsForEmptyEventLoop = false;
        if(validate.createCandidateValidate(req.query)){
          user.createCandidate(req.query,function(result){
            if(result === "PASS"){
      
              res.send('Created Candidate')
            }else{
              res.send('Create Candidate FAILED')
            }
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