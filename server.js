const express = require("express");
require("dotenv").config();
const graphqlHTTP = require("express-graphql");
const Schema = require("./Schema");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const db = mongoose.connection;
const getDbUri = require("./getDbUri");

console.log(`in the server, process.env.NODE_ENV = ${process.env.NODE_ENV}`);
// Connect to the Mongo DB
const MONGODB_URI =
  process.env.MONGODB_URI || getDbUri(process.env.NODE_ENV || "development");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Set up connection to GraphQL

app.use(
  "/",
  graphqlHTTP({
    schema: Schema,
    // graphiql: process.env.NODE_ENV === "development"
    graphiql: true
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    // graphiql: process.env.NODE_ENV === "development"
    graphiql: true
  })
);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log(`Connected successfully to mongo db.`);
  app.listen(PORT, () => {
    console.log(`🌎 ==> A GraphQL Server now running on port ${PORT}!`);
  });
});
