const Mocha = require('mocha');
const fs = require('fs');
const config = require("./config");
const execProcess = require('child_process').execSync;

const {EVENT_SUITE_END} = Mocha.Runner.constants;

class Statistics {
    constructor() {
        this.tests = [];
    }

    addTest(test) {
        this.tests.push(test)
    }

    summarise() {
        let failedTests = [];
        let total = this.tests.length;
        this.tests.forEach(t => {
            console.log(t.suite + " " + t.title + " " + t.duration + " " + t.state);
            if (t.state === "failed") {
                failedTests.push(t);
            }
        });
        console.log("total tests " + total + ", failed: " + failedTests.length);
        let results = JSON.stringify({tests: failedTests});
        console.log(results);
        if (!fs.existsSync(config.logFolder)) {
            fs.mkdirSync(config.logFolder);
        }
        fs.writeFileSync(config.logFile, results, "utf-8");
    }
}

const stats = new Statistics();

class SummaryReporter {
    constructor(runner) {
        runner.on(EVENT_SUITE_END, (suite) => {
            if (suite.tests.length !== 0) {
                suite.tests.map(test => {
                    const data = {
                        "suite": suite.title,
                        "title": test.title ? test.title : test.parent.title,
                        "duration": test.duration,
                        "state": test.state,
                    }
                    stats.addTest(data);
                });
            }
        });
    }
}

process.on('exit', () => {
    console.log("send summary data");
    stats.summarise();
    execProcess('node cypress/reporters/push-to-server.js');
});

module.exports = SummaryReporter;