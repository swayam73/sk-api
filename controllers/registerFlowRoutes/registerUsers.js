
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
      
      // app.options('/users/createRecruiter', function (req, res,next) {
      
      //   res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
      //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      //     res.header('Access-Control-Allow-Origin', '*');
      //     next();
      //   })
      
      
      app.post('/users/createRecruiter', function (req, res) {
        // context.callbackWaitsForEmptyEventLoop = false;
        if(validate.createRecruiterValidate(req.query)){
          console.log("request info",req['headers'])
          user.createRecruiter(req['headers'],function(result){
            console.log(result,"hanlder result",result["orgEmail"],result[0])
            if(result["orgEmail"]){
              res.send(result)
            }else{
              res.send('Create Recruiter FAILED')
            }
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