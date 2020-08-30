
const role = require('../../middlewares/Role.js');
const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');


module.exports = function(app){



    app.get('/role/getRoles', function (req, res) {
        role.getRoles(function(data){
          let parsedData  = parse.parseRoles(data)
          res.send(parsedData)
        })
      })
      
    //other routes..
}

