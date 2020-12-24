let promise = async(request) => {
    return new Cypress.Promise((resolve, reject) => {
        cy.request(request).then(result =>  {
            if (result.status >= 400) {
                reject(result);
            } else {
                resolve(result);
            }
        });
    });
};

export default promise;
