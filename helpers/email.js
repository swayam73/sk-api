
const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: 'us-west-2' });


function sendVerificationEmail(result){
    console.log(result,"reuslt",result["orgEmail"])
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Thank you for registering with Skipped!</h1>
        <p> Please click <a href="https://www.w3schools.com/">here</a> to verify your account</p></body>
    </html>
  `;
  const fromBase64 = Buffer.from('bharath.ram89@gmail.com').toString('base64');
  const sesParams = {
    Destination: {
      ToAddresses: [result["orgEmail"]],
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
        Data: 'Test Email SES',
      },
    },
    ReplyToAddresses: ['bharath.ram89@gmail.com'],
    Source: `=?utf-8?B?${fromBase64}?= <bharath.ram89@gmail.com>`,
  };

  return SES.sendEmail(sesParams).promise();
}
           
module.exports={sendVerificationEmail}