let prometheus_url= Cypress.env("PROM_URL");

context("prometheus",  () => {
    it("should display search page",  () => {
        cy.log("start prometheus page", prometheus_url);
        cy.visit(`${prometheus_url}`); 
        cy.get("#expr0").type("prometheus_build_info{enter}");
        let executeButton = cy.get("#graph_wrapper0 > form > div.form-inline > input");
        executeButton.click();
        cy.wait(1000);
        cy.get("#console0 > table > tbody > tr > td:nth-child(1)").contains('prometheus_build_info{branch="HEAD",goversion="go1.14.6",instance="localhost:9090",job="prometheus",revision="983ebb4a513302315a8117932ab832815f85e3d2",version="2.20.1"}');

    });
});

