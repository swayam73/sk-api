'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const validate = require('./validate');
const user = require('./User.js');
const role = require('./Role.js');
const parse = require('./Parse.js');
const skill = require('./Skill.js');
const industry = require('./Industry.js');
var cors = require('cors');


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


app.post('/users/createRecruiter', function (req, res) {
  // context.callbackWaitsForEmptyEventLoop = false;
  if(validate.createRecruiterValidate(req.query)){
    user.createRecruiter(req.query,function(result){
      if(result === "PASS"){
        res.send('Created Recruiter')
      }else{
        res.send('Create Recruiter FAILED')
      }
    })
  }else{
    res.send('Create Recruiter FAILED VALIDATION')
  }
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


module.exports.User = serverless(app);
