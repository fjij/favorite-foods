const db = require('../db');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Login', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM food");
    await db.query("DELETE FROM account");
    await db.query("DELETE FROM likes");
  });

  describe('/POST /login', () => {

    it('should give a username cookie on successful login', async () => {
      await chai.request(app).post('/register').type('form').send({
        username: 'abc', password: '12345678'
      });
      const res = await chai.request(app).post('/login').type('form').send({
        username: 'abc', password: '12345678'
      });
      res.should.have.status(200);
      expect(res).to.have.cookie('username');
    });

    it('should fail on incorrect username', async () => {
      const res = await chai.request(app).post('/login').type('form').send({
        username: 'dne', password: '12345678'
      });
      res.should.have.status(401);
    });

    it('should fail on incorrect password', async () => {
      await chai.request(app).post('/register').type('form').send({
        username: 'def', password: 'secret123'
      });
      const res = await chai.request(app).post('/login').type('form').send({
        username: 'def', password: 'guess123'
      });
      res.should.have.status(401);
    });

  });

});
