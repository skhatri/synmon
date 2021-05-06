import promise from './../../support/promise';


/*
This is an example test to upload multipart form data. Note this is a post structure which
should work with basic http client.

Step 1: Run a file upload server
docker run -p 8199:8199 -dt skhatri/multipart-file-upload

Step 2: Verify the upload manually
curl -X POST -H "Content-Type: multipart/form-data; boundary=123-UPLOAD-SEPARATOR" \
-d '--123-UPLOAD-SEPARATOR
Content-Disposition: form-data; name="file"; filename="test.txt"
Content-Type: text/plain

test
--123-UPLOAD-SEPARATOR--
' "http://localhost:8199"


Step 3: upload through cy post
 */
let gateway_url='http://localhost:8199';

let uploadFile = async() => {
    let status_url = `${gateway_url}`;
    cy.log("upload file data", status_url);
    return promise({
        url: status_url,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data; boundary=123-UPLOAD-SEPARATOR"
        },
        body: '--123-UPLOAD-SEPARATOR\n' +
            'Content-Disposition: form-data; name="file"; filename="test.txt"\n' +
            'Content-Type: text/plain\n' +
            '\n\n'+
            'test\n'+
            '--123-UPLOAD-SEPARATOR--\n'
    });
};

describe("upload-file", async () => {
    it("should be able to upload file data", async () => {
        cy.log("start upload");
        let fileOutput = await uploadFile();
        cy.log("response", fileOutput);
        expect("test.txt").to.equal(JSON.parse(fileOutput.body).filename);
        expect(200).to.equal(fileOutput.status);
    });

});
