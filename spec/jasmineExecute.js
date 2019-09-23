const Jasmine = require("jasmine");
const jasmine = new Jasmine();

jasmine.loadConfigFile("./support/jasmine.json");
jasmine.configureDefaultReporter({
  showColors: true,
  timer: new jasmine.jasmine.Timer()
});

jasmine.execute();
