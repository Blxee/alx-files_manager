import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('app routes', () => {
  it('/status', () => new Promise((done) => {
    chai.request('http://localhost:5000')
      .get('/status')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        chai.expect(bodyJson.redis).to.be.true;
        chai.expect(bodyJson.db).to.be.true;
        done();
      });
  })).timeout(30000);

  it('/stats', () => new Promise((done) => {
    chai.request('http://localhost:5000')
      .get('/stats')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        chai.expect(bodyJson.users).is.not.null;
        chai.expect(bodyJson.files).is.not.null;
        done();
      });
  })).timeout(30000);

  it('/users', () => new Promise((done) => {
    chai.request('http://localhost:5000')
      .post('/users')
      .send({ email: "boob@dylan.com", password: "toto1234!" })
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        chai.expect(bodyJson.id).is.not.null;
        chai.expect(bodyJson.email).to.be('boob@dylan.com');
        done();
      });
  })).timeout(30000);

  let token;
  it('/connect', () => new Promise((done) => {
    chai.request('http://localhost:5000')
      .get('/connect')
      .set('Authorization', 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        token = bodyJson.token;
        chai.expect(bodyJson.token).is.not.null;
        done();
      });
  })).timeout(30000);

  it('/disconnect', () => new Promise((done) => {
    chai.request('http://localhost:5000')
      .get('/disconnect')
      .set('X-Token', token)
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(204);
        done();
      });
  })).timeout(30000);
});
