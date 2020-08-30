
const industry = require('../../middlewares/Industry.js');
const parse = require('../../helpers/Parse.js');
const validate = require('../../helpers/validate');


module.exports = function(app){

    app.get('/industry/getIndustry', function (req, res) {
        industry.getIndustry(function(data){
          let parsedData  = parse.parseIndustry(data)
          res.send(parsedData)
        })
      })


    //other routes..
}