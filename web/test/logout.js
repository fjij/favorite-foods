const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;
const { resetDb } = require('./testUtils');

chai.use(chaiHttp);

describe('Logout', () => {

  beforeEach(resetDb);

  after(resetDb);

  describe('/POST /logout', () => {

    let agent;

    beforeEach(async () => {
      agent = chai.request.agent(app);
      await agent.post('/register').type('form').send({
        username: 'abc', password: '12345678'
      });
    });

    afterEach(async () => {
      agent.close();
    });

    it('should clear the username cookie if it exists', async () => {
      const res = await agent.post('/logout');
      res.should.have.status(200);
      expect(res).to.have.cookie('username', '');
    })

    it('should clear the username cookie if it does not exist', async () => {
      const res = await chai.request(app).post('/logout');
      res.should.have.status(200);
      expect(res).to.have.cookie('username', '');
    })

  });

});
