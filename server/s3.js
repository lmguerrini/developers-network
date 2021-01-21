const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod. the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    //filename = 24 (32) car genereted string-for-img
    const { filename, mimetype, size, path } = req.file;
    console.log("S3 Upload req.file: ", req.file);

    const promise = s3
        .putObject({
            Bucket: "lorenzoimageboardbucket", // our aws bucket's name created for this project
            ACL: "public-read", // public available
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // this makes it return a promise

    promise
        .then(() => {
            console.log("(s3-promise/then): image upload to AWS complete!");
            next();
            // optional clean up:
            fs.unlink(path, () => {});
            //this is called a "noop (no operation) function"
        })
        .catch((err) => {
            console.log("Something went wrong in uploading to S3!: ", err);
            res.sendStatus(404);
        });
};

module.exports.delete = (req, res, next) => {
    console.log("from s3 delete filname: ", req.body.image.substr(49));
    const filename = req.body.image.substr(49);

    const promise = s3
        .deleteObject({
            Bucket: "lorenzoimageboardbucket", // our aws bucket's name
            Key: filename,
        })
        .promise(); // this makes it return a promise

    promise
        .then(() => {
            console.log("(s3-promise/then): image deletion from AWS complete!");
            next();
            // optional clean up:
            //fs.unlink(path, () => {});
            //this is called a "noop (no operation) function"
        })
        .catch((err) => {
            console.log("Something went wrong in deleting from S3!: ", err);
            res.sendStatus(404); // (?)
        });
};
