'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
require('./controllers/registerFlowRoutes/registerUsers')(app);
require('./controllers/getFacts/industry')(app);
require('./controllers/getFacts/role')(app);
require('./controllers/getFacts/skills')(app);


var cors = require('cors');

app.use(cors());


app.options('/users/createRecruiter', function (req, res,next) {

    res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,last_name,first_name,org_email,contact,contact_number');
      res.header('Access-Control-Allow-Origin', '*');
      next();
    })
  
  

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  






module.exports.User = serverless(app);