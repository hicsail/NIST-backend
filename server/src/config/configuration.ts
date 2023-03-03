export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nist'
  },
  s3: {
    access_key_id: process.env.S3_ACCESS_KEY_ID,
    access_key_secret: process.env.S3_ACCESS_KEY_SECRET,
    region: process.env.S3_REGION || 'us-east-1'
  }
});
