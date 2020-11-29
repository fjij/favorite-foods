const db = require('../db');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const { mockFood, mockAccounts, mockLikes } = require('./mocking');

chai.use(chaiHttp);

describe('Account', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM food");
    await db.query("DELETE FROM account");
    await db.query("DELETE FROM likes");
  });

  describe('/GET /api/account/:account', () => {

    describe('General', () => {

      let username = 'abc';
      let likedFood;

      beforeEach(async () => {
        const pizza = {name: 'pizza', emoji: '🍕️'};
        const pasta = {name: 'pasta', emoji: '🍝️'};
        const grapes = {name: 'grapes', emoji: 'G'};
        const other = {name: 'other', emoji: ':('};
        await Promise.all([
          mockFood([ pizza, pasta, grapes, other ]),
          mockAccounts([username]),
        ]);
        await mockLikes([ {username, name: 'pizza'}, ]);
        await mockLikes([ {username, name: 'pasta'}, ]);
        await mockLikes([ {username, name: 'grapes'}, ]);
        likedFood = [ grapes, pasta, pizza ];
      });

      it('should fail on an invalid user', async () => {
        const badUsername = 'asdf';
        const res = await chai.request(app).get(`/api/account/${badUsername}`);
        res.should.have.status(404);
      });

      it('should contain a users liked food', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        likedFood.forEach(food => {
          res.body.should.deep.include(food);
        });
      });

      it('should order by recent', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        res.body.should.be.deep.eql(likedFood);
      });

    });

    describe('Pagination', () => {

      let food;
      let username='abc';

      beforeEach(async () => {
        food = [];
        for (var i = 0; i < 20; i ++) {
          food.push({name: i.toString(), emoji: ''});
        }
        await Promise.all([mockFood(food), mockAccounts([username])]);
        for (var i = 0; i < 20; i ++) {
          const name = food[i].name;
          await mockLikes([{name, username}]);
        }
        food.reverse();
      });

      it('should paginate', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(10);
        res.body.should.be.deep.eql(food.slice(0, 10));
      });

      it('should offset pages', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`)
          .query({page: 2});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(10);
        res.body.should.be.deep.eql(food.slice(10, 20));
      });

      it('should use limit', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`)
          .query({limit: 5});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        res.body.should.be.deep.eql(food.slice(0, 5));
      });

      it('should use limit + page', async () => {
        const res = await chai.request(app).get(`/api/account/${username}`)
          .query({limit: 5, page: 3});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        res.body.should.be.deep.eql(food.slice(10, 15));
      });

    });
  });

  describe('/POST /api/account', () => {
    describe('General', () => {

      let agent;
      let username = 'abc';

      beforeEach(async() => {
        agent = chai.request.agent(app);
        await agent.post('/register').type('form').send({
          username, password: '12345678'
        });
        await mockFood([
          {name: 'pizza', emoji: '🍕️'},
          {name: 'cheese whiz', emoji: '🧀️'},
          {name: 'pasta', emoji: '🍝️'},
        ]);
      });

      afterEach(async() => {
        agent.close();
      });

      it('should fail when user is not logged in', async () => {
        const res = await chai.request(app).post('/api/account').type('form')
          .send({
            name: 'pizza'
          });
        res.should.have.status(403);
      });

      it('should add a liked food for a logged in user', async () => {
        const res1 = await agent.post('/api/account').type('form').send({
          name: 'pizza'
        });
        res1.should.have.status(200);
        const res2 = await agent.get(`/api/account/${username}`);
        res2.should.have.status(200);
        res2.body.should.deep.eql([
          {name: 'pizza', emoji: '🍕️'},
        ]);
      });

      it('should fail for a non-existent food', async () => {
        const res = await agent.post('/api/account').type('form').send({
          name: 'imaginary avocado'
        });
        res.should.have.status(400);
      });

      it('should fail if the required inputs are not supplied', async () => {
        const res = await agent.post('/api/account').type('form').send({});
        res.should.have.status(400);
      });

      it('should fail if the food is already liked', async () => {
        await agent.post('/api/account').type('form').send({
          name: 'pizza'
        });
        const res = await agent.post('/api/account').type('form').send({
          name: 'pizza'
        });
        res.should.have.status(409);
      });

    });

  });
});
