export default {
  env: "dev",
  jsonwebtoken: {
    encryption: "super-secret",
    expiration: 10000,
  },
  server: {
    port: 3000,
  },
};
