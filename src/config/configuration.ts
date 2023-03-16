export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nist'
  },
  auth: {
    publicKeyUrl: process.env.AUTH_PUBLIC_KEY_URL
  },
  cargo: {
    uri: process.env.CARGO_URI
  }
});
