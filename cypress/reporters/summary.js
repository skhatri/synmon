const Mocha = require('mocha');

const { EVENT_SUITE_BEGIN, EVENT_SUITE_END, EVENT_RUN_END } = Mocha.Runner.constants;

class SummaryReporter {
  constructor(runner) {
    const stats = runner.stats;
    runner
      .on(EVENT_SUITE_END, (suite) => {
        if (suite.tests.length !== 0) {
          let states = new Map();
          let duration = 0;
          let total = 0;
          suite.tests.map(test => {
            states[test.state] = (states[test.state] || 0) + 1;
            duration += test.duration;
            total += 1;
          });
          let passed = states["passed"] || 0;
          let failed = states["failed"] || 0;
          let status = states["passed"] === total ? "NORMAL": "FAILED";
          const data = {
            "item": suite.title,
            "duration": duration,
            "status": status,
            "passes": passed,
            "failures": failed,
            "total": total
          };
          console.log(data);
        }
      })      
      .once(EVENT_RUN_END, () => {
        console.log("send summary data");
      });
  }
}

module.exports = SummaryReporter;