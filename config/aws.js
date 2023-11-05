const AWS = require("aws-sdk");

// Configure the AWS SDK with your credentials
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function uploadToS3(file, userId) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${file.fieldname}/${Number(new Date())}-${file.originalname}`,
    Body: file.buffer,
    ACL: "public-read",
  };

  const data = await s3.upload(params).promise();
  return { url: data.Location, key: data.Key };
}

module.exports = uploadToS3