'use strict';

const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/users/getRecruiter', function (req, res) {
  res.send('Get Recruiter!')
})

app.get('/users/getCandidate', function (req, res) {
  res.send('Get Candidate!')
})


app.post('/users/createRecruiter', function (req, res) {
  res.send('Create Recruiter!')
})

app.post('/users/createCandidate', function (req, res) {
  console.log(req,"data",req.query,req.query.first_name)
  res.send('Create Candidate!')
})


module.exports.User = serverless(app);
