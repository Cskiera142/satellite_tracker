const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Server API", () => {
  const testPort = 3001;

  before((done) => {
    done();
  });

  after((done) => {
    done();
  });

  it("should return altitude statistics", (done) => {
    chai
      .request(app)
      .get("/stats")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("minAltitude");
        expect(res.body).to.have.property("maxAltitude");
        expect(res.body).to.have.property("averageAltitude");
        done();
      });
  });

  it("should return health status", (done) => {
    chai
      .request(app)
      .get("/health")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
