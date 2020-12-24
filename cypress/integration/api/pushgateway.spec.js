import promise from './../../support/promise';

let gateway_url=Cypress.env("GATEWAY_URL");

let metricsRequest = async() => {
    let metrics_url = `${gateway_url}/metrics`;
    cy.log("metrics request", metrics_url);
    return promise({
        url: metrics_url,
        method: "GET",
    });
};

let statusRequest = async() => {
    let status_url = `${gateway_url}/api/v1/status`;
    cy.log("status request", status_url);
    return promise({
        url: status_url,
        method: "GET"
    });
};

describe("push-gateway", async () => {
    it("should get metrics data", async () => {
        cy.log("start push gateway test");
        let metrics = await metricsRequest();
        cy.log("response", metrics);
        expect(200).to.equal(metrics.status);
    });

    it("web admin api is enabled", async() => {
        let response = await statusRequest();
        cy.log("status response", response);
        expect(200).to.equal(response.status);
        expect('true').to.equal(response.body.data.flags["web.enable-admin-api"]);
    });

    it("web admin", async() => {
        let req = {url: `${gateway_url}`, method:"GET"}
        let web = await promise(req);
        expect(200).to.equal(web.status);
    });
});
