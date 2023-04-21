export default () => ({
  nist: {
    uri: process.env.GATEWAY_NIST_URI
  },
  cargo: {
    uri: process.env.GATEWAY_CARGO_URI
  },
  auth: {
    uri: process.env.AUTH_URI
  }
});
