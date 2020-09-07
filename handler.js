'use strict';

const serverless = require('serverless-http');
var createError = require('http-errors');
const express = require('express');
const app = express();
const validate = require('./helpers/validate');
const user = require('./middlewares/User');
const role = require('./middlewares/Role.js');
const parse = require('./helpers/Parse.js');
const skill = require('./middlewares/Skill.js');
const industry = require('./middlewares/Industry.js');
const env = require("dotenv").config();
const path = require("path");
const db = require("./helpers/db_connect");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');


var cors = require('cors');

// if (!process.env.jwtPrivateKey) {
//   console.error("FATAL ERROR: jwtPrivateKey is not defined");
//   process.exit(1);
// }

const expressValidator = require('express-validator');
console.debug(expressValidator)
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//express validators 

app.use(expressValidator());
app.use(cookieParser());


var sessionStore = new MySQLStore(db);

app.use(session({
  secret: 'jhjjdddjjdhbeubvbrufbvjfjswirfiuh',
  resave: false,
  saveUninitialized: true,
  store:sessionStore
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
  res.locals.isAuthenticated  = req.isAuthenticated();
  next();
});
// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register',registerRouter);
app.use('/login',loginRouter);

passport.use(new LocalStrategy(
  function(username, password, done) {

      db.query('select email,password from candidate WHERE email=?',[username],
        function(err,results,fields){
          if(err){
            done(err);
          };

          if(results.length === 0){

            done(null,false);

          }else {
            const hash = results[0].password.toString();

             bcrypt.compare(password,hash,(err,res)=>{

                if(res == true){
                    return done(null,{user_id:results[0].id});
                }else {
                  return done(null,false);
                }

            });
          }
          
      });   
  }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


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

// Setting up the server
app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

module.exports = app;
module.exports.User = serverless(app);
