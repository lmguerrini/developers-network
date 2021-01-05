// ses.js => sibling of server.js

const aws = require("aws-sdk");

let secrets;
// if we're running it on heroku
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in production the secrets are environment variables
} else {
    // if we're running it locally 
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // it depends which region we've choosen on AWS (if it's different we've to update it!)
});

/* 
NB: always "git status" (after adding secrets.json) 
and make sure that secrets.json is NOT there, 
otherwise it will be uploaded when we push it
and someone can use it - and send us the bill to pay!!!
*/

// The SES instance has a method named sendEmail that we can call to send an email.
exports.sendEmail = function (recipient, message, subject) {
    // this will send an Email to the user in order to reset the psw
    return ses
        .sendEmail({
            Source: "Lorenzo Guerrini <lorenzomariaguerrini@gmail.com>", // this should be the AWS's verified email
            Destination: {
                ToAddresses: [recipient], // in an array so we can send email to more person at the same time (and that's why ToAddresses is plural)
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("ses.sendEmail/promise/then => it worked!"))
        .catch((err) =>
            console.error("err in ses.sendEmail/promise/catch: ", err)
        );
};
