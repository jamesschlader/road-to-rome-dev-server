require("dotenv").config();

const getDbUri = env => {
  console.log(`NODE_ENV = ${env}`);
  console.log(`process.env.DATABASE_URL = ${process.env.DATABASE_URL}`);
  switch (env) {
    case "development":
      return (
        process.env.DEVELOPMENT_DB_DSN ||
        "mongodb://localhost:27017/road-to-rome-react"
      );
    case "production":
      return (
        process.env.PRODUCTION_DB_DSN ||
        "mongodb+srv://admin:p9b2p7SzQ%23FgsAc@cluster0-ducdn.mongodb.net/ROAD_TO_ROME_DEVELOPMENT?retryWrites=true&w=majority"
      );
    case "test":
      return (
        process.env.TEST_DB_DSN ||
        "mongodb://localhost:27017/road-to-rome-react"
      );
    default:
      return "";
  }
};

module.exports = getDbUri;
