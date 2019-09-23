const mongoose = require("mongoose");
const getDbUri = require("../../getDbUri");

describe("getDbUri.js", () => {
  it("should return DEVELOPMENT mongoDb connection string from .env file when env = development", () => {
    const uri = getDbUri("development");
    expect(uri).toContain("DEVELOPMENT");
  });
});

describe("getDbUri.js", () => {
  it("should return PRODUCTION mongoDb connection string from .env file when env = production", () => {
    const uri = getDbUri("production");
    expect(uri).toContain("PRODUCTION");
  });
});

describe("getDbUri.js", () => {
  it("should return TEST mongoDb connection string from .env file when env = production", () => {
    const uri = getDbUri("test");
    expect(uri).toContain("TEST");
  });
});

describe("the development db should be reachable", () => {
  it("should return a non-null db when the env = development", async () => {
    const uri = getDbUri("development");
    const db = mongoose.connection;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const open = await db.once("open", () => {});
    expect(open.user).toBeDefined("admin");
  });
});

describe("the production db should be reachable", () => {
  it("should return a non-null db when the env = production", async () => {
    const uri = getDbUri("production");
    const db = mongoose.connection;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const open = await db.once("open", () => {});
    expect(open.user).toBeDefined("admin");
  });
});

describe("the test db should be reachable", () => {
  it("should return a non-null db when the env = test", async () => {
    const uri = getDbUri("test");
    const db = mongoose.connection;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const open = await db.once("open", () => {});

    expect(open.user).toEqual("admin");
  });
});

describe("will not connect to db if env is not correct", () => {
  it("should throw an error if env is !== production || development || test", async () => {
    const uri = getDbUri("foo");

    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
