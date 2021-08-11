const endpoint = process.env.PUSH_URL || 'http://localhost:9100/echo';
const logFolder = process.env.LOG_FOLDER || "/tmp/logs";
const logFile = process.env.LOG_FILE || `${logFolder}/report.log`;

const Config = {
    endpoint: endpoint,
    logFolder: logFolder,
    logFile: logFile,
};

module.exports = Config;