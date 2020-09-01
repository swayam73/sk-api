
const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: 'us-west-2' });


function sendVerificationEmail(result,randNum){
    console.log(result,"reuslt",result["orgEmail"])
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Thank you for registering with Skipped!</h1>
        <p> Your Verification Code: `+randNum+`</p>
        
        <p>Use this verification after you <a href="https://www.skipped.io">Sign in</a></p>
      </body>
    </html>
  `;
  const fromBase64 = Buffer.from('goskipped@gmail.com').toString('base64');
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
        Data: 'Skipped.io Registration Email',
      },
    },
    ReplyToAddresses: ['goskipped@gmail.com'],
    Source: `=?utf-8?B?${fromBase64}?= <goskipped@gmail.com>`,
  };

  return SES.sendEmail(sesParams).promise();
}
           
module.exports={sendVerificationEmail}