const Mocha = require('mocha');
const axios = require('axios').default;

let gateway_url = process.env.CYPRESS_GATEWAY_URL || "http://localhost:9091";

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS
} = Mocha.Runner.constants;

class MetricKey {
  constructor(name, labels, labelData, typeInfo) {
    this.name = name
    this.labels = labels
    this.labelData = labelData 
    this.typeInfo = typeInfo
  }

  serialise(value) {
    let labelData = this.labelData
    let attr = this.labels.map(label => `${label}="${labelData[label]}"`).join(",")
    let data = [`${this.name}{${attr}} ${value}`]
    return data.map(d => d +"\n").join("")
  }

}

class Metrics {

  constructor(){
    this.metrics = {};
    this.metricInfo = {};
  }

  addMetric(metricName, labels, labelData, value, typeInfo){
    let key = new MetricKey(metricName, labels, labelData, typeInfo)
    this.metrics[metricName] = this.metrics[metricName] || [];
    this.metrics[metricName].push({key: key, value: value});
    this.metricInfo[metricName] = typeInfo;
  }

  getMetricNames() {
    return Object.keys(this.metrics);
  }
  getMetrics(metricName) {
    return this.metrics[metricName];
  }
  getMetricInfo(metricName){
    return this.metricInfo[metricName];
  }

}

class MetricsReporter {
  constructor(runner) {
    const stats = runner.stats;
    this.metrics = new Metrics();
    runner
      .once(EVENT_RUN_BEGIN, () => {
      })
      .on(EVENT_TEST_PASS, test => {
        this.testStats(test)
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        this.testStats(test)
      })
      .once(EVENT_RUN_END, async () => {
        let names = this.metrics.getMetricNames();
        let serialisedMetric = names.flatMap(k => {
          let metricList = this.metrics.getMetrics(k);
          let typeInfo = this.metrics.getMetricInfo(k);
          let lines = [`# HELP ${k} ${typeInfo.hint}`, `# TYPE ${k} ${typeInfo.type}`]
          lines = [...lines, ...metricList.map(m => {
            return m["key"].serialise(m["value"]);
          })];
          return lines;
        }).join("\n");
        let url = `${gateway_url}/metrics/job/statuspage/instance/platforms`
        try {
          let resp = await axios({
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
              "Content-Length": serialisedMetric.length
            },
            data: serialisedMetric,
            url,
          });
          console.log("push status", resp.status);  
        } catch(err){
          console.error(err);
        }
      });
  }

  testStats(test) {
    if (test.title === undefined) {
      return;
    }
    const group = test.parent.title.replaceAll(" ", "_");
    const title = test.title.replaceAll(" ", "_");
    const state = test.state;
    const duration = test.duration || 0;
    const stateValue = state === "passed" ? 1 : 0;
    this.metrics.addMetric("report_test_status", ["group", "title", "status"], { group: group, title: title, status: state }, stateValue, {
      "type": "gauge",
      "hint": "test status for group"
    });
    this.metrics.addMetric("report_test_duration", ["group", "title"], { group: group, title: title }, duration, {
      "type": "gauge",
      "hint": "test duration"
    });
  }
  

}

module.exports = MetricsReporter;