require("dotenv").config();

const getDbUri = env => {
  console.log(`NODE_ENV = ${env}`);
  console.log(`process.env.DATABASE_URL = ${process.env.DATABASE_URL}`);
  console.log(
    `process.env.DEVELOPMENT_DB_DSN = ${process.env.DEVELOPMENT_DB_DSN}`
  );
  console.log(
    `process.env.PRODUCTION_DB_DSN= ${process.env.PRODUCTION_DB_DSN}`
  );
  console.log(`process.env.TEST_DB_DSN = ${process.env.TEST_DB_DSN}`);
  switch (env) {
    case "development":
      return process.env.DEVELOPMENT_DB_DSN || process.env.MLAB_DB_URI;
    case "production":
      return process.env.PRODUCTION_DB_DSN || process.env.MLAB_DB_URI;
    case "test":
      return process.env.TEST_DB_DSN || process.env.MLAB_DB_URI;
    default:
      return "";
  }
};

module.exports = getDbUri;
