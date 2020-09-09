'use strict';

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const validate = require('./validate');
const user = require('./middlewares/User');
const role = require('./Role.js');
const parse = require('./Parse.js');
const skill = require('./Skill.js');
const industry = require('./Industry.js');
var cors = require('cors');


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors());


app.get('/users/getRecruiter', function (req, res) {
  res.send('Get Recruiter!')
})

app.get('/users/getCandidate', function (req, res) {
  res.send('Get Candidate!')
})


app.get('/role/getRoles', function (req, res) {
  role.getRoles(function(data){
    let parsedData  = parse.parseRoles(data)
    res.send(parsedData)
  })
})

app.get('/industry/getIndustry', function (req, res) {
  industry.getIndustry(function(data){
    let parsedData  = parse.parseIndustry(data)
    res.send(parsedData)
  })
})

app.get('/skill/getSkills', function (req, res) {
  skill.getSkills(function(data){
    let parsedData  = parse.parseSkills(data)
    res.send(parsedData)
  })
})

app.options('/users/createCandidate', function (req, res,next) {

  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.post('/users/createCandidate', function (req, res) {
  // context.callbackWaitsForEmptyEventLoop = false;
  if(validate.createCandidateValidate(req.query)){
    console.log(JSON.parse(req['body'].toString('utf8')),"request info",req)
    user.createCandidate(JSON.parse(req['body'].toString('utf8')),function(result){
      console.log(result,"handler result createCandidate")
      if(result["email"]){
        res.send(result)
      }else{
        res.send('Create Candidate FAILED')
      }
    })
  }else{
    res.send('Create Candidate FAILED VALIDATION')
  }
})

app.options('/users/createRecruiter', function (req, res,next) {

  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    next();
  })


app.post('/users/createRecruiter', function (req, res) {
  // context.callbackWaitsForEmptyEventLoop = false;
  if(validate.createRecruiterValidate(req.query)){
    console.log(JSON.parse(req['body'].toString('utf8')),"request info",req)
    user.createRecruiter(JSON.parse(req['body'].toString('utf8')),function(result){
      console.log(result,"hanlder result")
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


// Handle in-valid route
app.all('*', function(req, res) {
  const response = { data: null, message: 'Route not found!!' }
  res.status(400).send(response)
})

// wrap express app instance with serverless http function
module.exports.User = serverless(app);