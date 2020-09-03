
const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: 'us-west-2' });

//https://zaj3gxtv1m.execute-api.us-west-1.amazonaws.com/dev/register/recruiterVerify
function sendVerificationEmail(result,randNum){
    console.log(result,"reuslt")
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Thank you for registering with Skipped!</h1>
        <p> Click <a href="https://zaj3gxtv1m.execute-api.us-west-1.amazonaws.com/dev/register/recruiterVerify?code=`+randNum+`">here</a> to verify your account</p>
        
      </body>
    </html>
  `;
  const fromBase64 = Buffer.from('goskipped@gmail.com').toString('base64');
  const sesParams = {
    Destination: {
      ToAddresses: [result],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Skipped.io Registration Email',
      },
    },
    ReplyToAddresses: ['goskipped@gmail.com'],
    Source: `=?utf-8?B?${fromBase64}?= <goskipped@gmail.com>`,
  };

  return SES.sendEmail(sesParams).promise();
}
           
module.exports={sendVerificationEmail}