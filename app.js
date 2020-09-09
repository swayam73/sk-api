'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


require('./controllers/registerFlowRoutes/registerUsers')(app);
require('./controllers/getFacts/industry')(app);
require('./controllers/getFacts/role')(app);
require('./controllers/getFacts/skills')(app);
const pool = require('./helpers/db_connect').pool;
const { check, validationResult } = require('express-validator/check');

//authentication packages
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');

var Cryptr = require('cryptr');


var cors = require('cors');

var sessionStore = new MySQLStore({
  checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
  expiration: 86400000,// The maximum age of a valid session; milliseconds.
  createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
  schema: {
      tableName: 'sessions',
      columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
      }
  }
}, pool);

  

app.use(cors());
  

//registers candidate

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(session({
    name : 'JSESSION',
    secret : 'secretskippedsession',
    resave : true,
    saveUninitialized : true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 600000 // Time is in miliseconds
    },
    store: sessionStore
}))

app.use(passport.initialize());
app.use(passport.session());

// Handle candidate GET route for all candidate
app.get('/users/candidate/', (req, res) => {
  const query = 'SELECT * FROM candidate'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const candidates = [...results]
    const response = {
      data: candidates,
      message: 'All candidates successfully retrieved.',
    }
    res.send(response)
  })
})

// Handle candidate GET route for specific candidate
app.get('/users/candidate/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT * FROM candidate WHERE candidateID=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const candidate = results[0]
    const response = {
      data: candidate,
      message: `Candidate ${candidate.firstName} successfully retrieved.`,
    }
    res.status(200).send(response)
  })
})

function isEmailInUse(email){
    return new Promise((resolve, reject) => {
        pool.query('SELECT COUNT(*) AS total FROM candidate WHERE email = ?', [email], function (error, results, fields) {
            if(!error){
                console.log("EMAIL COUNT : "+results[0].total);
                return resolve(results[0].total > 0);
            } else {
                return reject(new Error('Database error!!'));
            }
          }
        );
    });
}

// Handle candidate POST route
app.post('/users/candidate/', [
    check('firstName').exists().isLength({ min: 3 }),
    check('lastName').exists().isLength({ min: 3 }),
    check('linkedInUrl').isURL(),
    check('email')
        .exists()
        .isLength({ min: 6, max: 100 })
        .isEmail()
        .normalizeEmail()
        .trim()
        .custom(async email => {
            const value = await isEmailInUse(email);
                if (value) {
                    throw new Error('Email is already exists!!!');
                }
            })
        .withMessage('Invalid email address!!!'),
    check('totalYearsExperience').isNumeric(),
    check('contactNumber').exists().isMobilePhone(),
    check('password')
        .exists()
        .isLength({ min: 6, max: 16 })
        .escape()
        .trim()
        .withMessage('Invalid password!!!'),
    check('rePassword').exists().custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('The passwords is not same!!!');
            }    
            return true;
    })
  ],(req, res) => {

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }else{
        console.log("----->START USER REGISTRATION");
        const { firstName, lastName, email, contactNumber,linkedInUrl,password,rePassword,totalYearsExperience } = req.body
        var encryptedString = cryptr.encrypt(password);
        const query = `INSERT INTO candidate (firstName, lastName, email, contactNumber,linkdinUrl,password,totalYearsExperience) VALUES ('${firstName}', '${lastName}', '${email}', 
       '${contactNumber}','${linkedInUrl}','${encryptedString}','${totalYearsExperience}')`

        pool.query(query, (err, results, fields) => {

        if (err) {
            const response = { data: null, message: err.message, }
            res.send(response)
        }
        console.log("results:"+results);
        const { insertId } = results
        const candidate = { candidateID: insertId, firstName, lastName,email, contactNumber, linkedInUrl,totalYearsExperience}
        const response = {
            data: candidate,
            message: `Candidate ${firstName} successfully added.`,
        }
        res.status(201).send(response)
        })
    }
})




module.exports.User = serverless(app);