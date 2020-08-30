
const skill = require('../../middlewares/Skill.js');
const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');



module.exports = function(app){



    app.get('/skill/getSkills', function (req, res) {
        skill.getSkills(function(data){
          let parsedData  = parse.parseSkills(data)
          res.send(parsedData)
        })
      })
    //other routes..
}