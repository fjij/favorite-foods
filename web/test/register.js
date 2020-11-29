const db = require('../db');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Register', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM food");
    await db.query("DELETE FROM account");
    await db.query("DELETE FROM likes");
  });

  describe('/POST /register', () => {

    it('should add a new account with the right credentials', async () => {
      throw new Error('test not implemented');
    });

    it('should add a new account to the database', async () => {
      throw new Error('test not implemented');
    });

    it('should fail if the user already exists', async () => {
      throw new Error('test not implemented');
    });

    it('should fail if the required inputs are not supplied', async () => {
      throw new Error('test not implemented');
    });

  });

});
