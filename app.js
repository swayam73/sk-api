'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
require('./controllers/registerFlowRoutes/registerUsers')(app);
require('./controllers/registerFlowRoutes/registerCandidate')(app);
require('./controllers/getFacts/industry')(app);
require('./controllers/getFacts/role')(app);
require('./controllers/getFacts/skills')(app);


var cors = require('cors');

  

app.use(cors());
  






module.exports.User = serverless(app);