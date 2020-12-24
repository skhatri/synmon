import promise from './../../support/promise';
let airflow_url=Cypress.env("AIRFLOW_URL");

let auth = {
    "Authorization": "Basic YWRtaW46YWRtaW4="
};


let dagRunsRequest = async(dagId) => {
    cy.log("DAG", dagId);
    return promise({
        url: `${airflow_url}/api/v1/dags/${dagId}/dagRuns`,
        method: "GET",
        headers: auth
    });
};

let taskInstance = async (dagId, dagRunId) => {
    return promise({
        url: `${airflow_url}/api/v1/dags/${dagId}/dagRuns/${dagRunId}/taskInstances`,
        headers: auth
    });
};

let getDagList = async () => {
    return promise({
        url: `${airflow_url}/api/v1/dags?limit=100`,
        method: "GET",
        headers: auth
    });
};


describe('airflow', async () => {
    it('fetch dags', async () => {
        cy.log("START TEST");
        let dagListResponse = await getDagList();
        cy.log("DagListResponse", dagListResponse);
        expect(200).to.equal(dagListResponse.status);
        cy.log(JSON.stringify(dagListResponse.body));
        dagListResponse.body.dags.forEach(async dag => {
            let dagRuns = await dagRunsRequest(dag.dag_id);
            expect(200).to.equal(dagRuns.status);
            cy.log(`dag_id=${dagId}, dag_runs=${dagRuns.body.dag_runs.length}`);
            dagRuns.body.dag_runs.forEach(async dagRun => {
                cy.log(`dag_id=${dag.dag_id}, dag_run_id=${dagRun.dag_run_id}`);
                let dagTaskInstances = await taskInstance(dag.dag_id, dagRun.dag_run_id);
                expect(200).to.equals(dagTaskInstances.status);
                cy.log(JSON.stringify(dagTaskInstances.body));
            });
        });
    });
});
