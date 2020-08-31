
const email = require('../../helpers/email.js');
const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');
const user = require('../../middlewares/User.js');

module.exports = function(app){


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
          user.createRecruiter(req['headers'],function(result){
            email.sendVerificationEmail(result).then(data=>{
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