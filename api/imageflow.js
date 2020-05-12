const { Steps, FromStream, FromBuffer } = require("@imazen/imageflow");
const qs = require("querystring");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.IMAGEFLOW_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.IMAGEFLOW_AWS_ACCESS_SECRET_KEY,
});

module.exports = async (req, res) => {
  const [_, region, bucket, ...path] = req.query.imageflow_path.split("/");
  AWS.config.update({ region });
  let s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const data = await s3
    .getObject({ Bucket: bucket, Key: path.join("/") })
    .promise();
  await new Steps().executeCommand(
    qs.stringify(req.query),
    new FromBuffer(data.Body),
    new FromStream(res)
  );
  res.end();
};
