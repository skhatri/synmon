const axios = require('axios').default;
const fs = require('fs');
const config = require("./config");
const endpoint = config.endpoint;
const logFile = config.logFile;

class PushClient {
    async push() {
        if (!fs.existsSync(logFile)) {
            console.error(`log file [${logFile}] does not exist`);
            return;
        }
        const data = fs.readFileSync(logFile, {encoding: "utf-8"});
        let res = await axios({
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            data: data,
            url: endpoint
        });
        console.log(`push response ${res.status}`);
    }
}

const client = new PushClient();
client.push();
