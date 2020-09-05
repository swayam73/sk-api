
const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: 'us-west-2' });

//https://zaj3gxtv1m.execute-api.us-west-1.amazonaws.com/dev/register/recruiterVerify
function sendVerificationEmail(email,randNum){
    console.log(email,"reuslt")
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
      ToAddresses: [email],
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
           
function sendResetPasswordEmail(email,code){
    console.log(email,"reuslt")
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Oh oh Did you Loose your password?</h1>
        <p> Click <a href="http://localhost:4200/resetPass?code=`+code+`&userName=`+email+`">here</a> to reset your password</p>
        
      </body>
    </html>
  `;
  const fromBase64 = Buffer.from('goskipped@gmail.com').toString('base64');
  const sesParams = {
    Destination: {
      ToAddresses: [email],
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
        Data: 'Skipped.io Reset Password',
      },
    },
    ReplyToAddresses: ['goskipped@gmail.com'],
    Source: `=?utf-8?B?${fromBase64}?= <goskipped@gmail.com>`,
  };

  return SES.sendEmail(sesParams).promise();
}
           
module.exports={sendVerificationEmail,sendResetPasswordEmail}