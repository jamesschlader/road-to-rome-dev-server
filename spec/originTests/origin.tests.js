const origin = require("../../utilities/origin");

describe("origin.js", () => {
  it("should return the string 'grea' when passed a number between 21 and 40", () => {
    const result = origin(25);
    expect(result).toBe("grea");
  });
});

describe("origin.js", () => {
  it("should return the string 'afr' when passed a number between 41 and 60", () => {
    const result = origin(50);
    expect(result).toBe("afr");
  });
});

describe("origin.js", () => {
  it("should return the string 'anci' when passed a number between 61 and 70", () => {
    const result = origin(65);
    expect(result).toBe("anci");
  });
});

describe("origin.js", () => {
  it("should return the string 'cop' when passed a number between 71 and 76", () => {
    const result = origin(73);
    expect(result).toBe("cop");
  });
});

describe("origin.js", () => {
  it("should return the string 'gal' when passed a number between 76 and 80", () => {
    const result = origin(78);
    expect(result).toBe("gal");
  });
});

describe("origin.js", () => {
  it("should return the string 'gmca' when passed a number between 81 and 85", () => {
    const result = origin(83);
    expect(result).toBe("gmca");
  });
});

describe("origin.js", () => {
  it("should return the string 'heb' when passed a number between 86 and 90", () => {
    const result = origin(88);
    expect(result).toBe("heb");
  });
});

describe("origin.js", () => {
  it("should return the string 'occ' when passed a number between 91 and 95", () => {
    const result = origin(93);
    expect(result).toBe("occ");
  });
});

describe("origin.js", () => {
  it("should return the string 'scaa' when passed a number between 96 and 100", () => {
    const result = origin(98);
    expect(result).toBe("scaa");
  });
});

describe("origin.js", () => {
  it("should return the string 'roma' when passed a number below 21", () => {
    const result = origin(20);
    expect(result).toBe("roma");
  });
});

describe("origin.js", () => {
  it("should return the string 'roma' when passed a number greater than 100", () => {
    const result = origin(101);
    expect(result).toBe("roma");
  });
});
