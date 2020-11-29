const db = require('../db');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const bcrypt = require('bcrypt');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Register', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM food");
    await db.query("DELETE FROM account");
    await db.query("DELETE FROM likes");
  });

  describe('/POST /register', () => {

    let otherUsername = 'def';

    beforeEach(async () => {
      await chai.request(app).post('/register').type('form').send({
        username: otherUsername, password: '87654321'
      });
    });

    it('should add a new account with the right credentials', async () => {
      const username =  'abc';
      const password = '12345678';
      const response = await chai.request(app)
        .post('/register')
        .type('form')
        .send({
          username, password
        });
      response.should.have.status(200);
      const { rows } = await db.query(
        "SELECT * FROM account WHERE username=$1",
        [username]
      ); 
      rows[0].username.should.eql(username);
      const match = await bcrypt.compare(password, rows[0].password_hash);
      match.should.eql(true);
    });

    it('should assign a username cookie', async () => {
      const response = await chai.request(app).post('/register').type('form')
        .send({
          username: 'abc', password: '12345678'
        });
      response.should.have.status(200);
      expect(response).to.have.cookie('username');
    });

    it('should fail if the user already exists', async () => {
      const response = await chai.request(app).post('/register').type('form')
        .send({
          username: otherUsername, password: '12345678'
        });
      response.should.have.status(409);
    });

    it('should fail if the required inputs are not supplied', async () => {
      const res1 = await chai.request(app).post('/register').type('form')
        .send({});
      res1.should.have.status(400);
      const res2 = await chai.request(app).post('/register').type('form')
        .send({username: 'abc'});
      res2.should.have.status(400);
      const res3 = await chai.request(app).post('/register').type('form')
        .send({password: '12345678'});
      res3.should.have.status(400);
    });

    it('should fail on bad inputs', async () => {
      const f = o => chai.request(app).post('/register').type('form').send(o);
      const responses = await Promise.all([
        f({
          username: 'ab',
          password: '12345678',
        }),
        f({
          username: 'abc',
          password: '1234567',
        }),
        f({
          username: 'abc asdf',
          password: '12345678',
        }),
        f({
          username: 'abc$',
          password: '12345678',
        }),
        f({
          username: "'DELETE FROM account;",
          password: '12345678',
        }),
      ]);
      responses.forEach(r => r.should.have.status(400));
    });

  });

});
