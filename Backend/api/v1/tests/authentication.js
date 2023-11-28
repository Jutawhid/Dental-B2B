const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect
chai.use(chaiHttp)
let { app } = require('../../../server');

let res;

describe("POST /Login", async () => {

    let loginData = {
        user_name: "isheiblu",
        password: "123456"
    }

    before(async () => {
        res = await chai
        .request(app)
        .post('/api/v1/authentication/login')
        .send(loginData);
    })


    it("Status should be 200", () => {
        expect(res.status).to.equal(200);
    }).timeout(10000);


    it("Formate must be Json Object", () => {
        expect(res.body).to.be.an('object');
    }).timeout(10000);


    it("Success must be True", () => {
        expect(res.body.success).to.equal(true);
    }).timeout(10000);



    afterEach(() => {
        // done();
    })
});





// -- Run commend -- 
// mocha authentication