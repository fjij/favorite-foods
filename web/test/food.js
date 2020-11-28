const db = require('../db');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

const { mockFood, mockAccounts, mockLikes } = require('./mocking');

chai.use(chaiHttp);



describe('Food', () => {
  beforeEach(async () => {
    await db.query("DELETE FROM food");
    await db.query("DELETE FROM account");
    await db.query("DELETE FROM likes");
  });
  describe('/GET api/food', () => {
    it('should give nothing by default', async () => {
      const res = await chai.request(app).get('/api/food');
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
    it('should return mocked food', async () => {
      const food = await mockFood();
      const expectedFood = food.map(e => ({...e, popularity: 0}));
      const res = await chai.request(app).get('/api/food');
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(3);
      expectedFood.forEach(item => {
        res.body.should.deep.include(item);
      });
    });
    describe('Popularity', () => {
      let food;
      let pop;
      beforeEach(async () => {
        food = await mockFood();
        pop = { pizza: 3, pasta: 2, 'cheese whiz': 0 }
        await mockAccounts();
        await mockLikes();
      });
      it('should calculate popularity', async () => {
        const expectedFood = food.map(f => ({...f, popularity: pop[f.name]}));
        const res = await chai.request(app).get('/api/food');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        expectedFood.forEach(item => {
          res.body.should.deep.include(item);
        });
      });
      it('should sort by popularity', async () => {
        const expectedFood = food.map(f => ({...f, popularity: pop[f.name]}))
          .sort((a, b) => b.popularity - a.popularity);
        const res = await chai.request(app).get('/api/food');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        expectedFood.forEach(item => {
          res.body.should.deep.include(item);
        });
      });
    });
    describe('Pagination', () => {
      let food;
      beforeEach(async () => {
        food = [];
        for (var i = 0; i < 20; i ++) {
          food.push({name: i.toString(), emoji: ''});
        }
        const usernames = [];
        for (var i = 0; i < 20; i ++) {
          usernames.push(i.toString());
        }
        await Promise.all([mockFood(food), mockAccounts(usernames)]);
        // Give likes by index
        const likes = [];
        for (var i = 0; i < 20; i ++) {
          const name = food[i].name;
          for (var j = 0; j < i; j ++) {
            likes.push({name, username: usernames[j]});
          }
        }
        await mockLikes(likes);
        food.forEach((element, idx) => { element.popularity = idx });
        food.reverse();
      });
      it('should paginate', async () => {
        const res = await chai.request(app).get('/api/food');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(10);
        res.body.should.be.deep.eql(food.slice(0, 10));
      });
      it('should offset pages', async () => {
        const res = await chai.request(app)
          .get('/api/food').query({page: 2});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(10);
        res.body.should.be.deep.eql(food.slice(10, 20));
      });
      it('should use limit', async () => {
        const res = await chai.request(app)
          .get('/api/food').query({limit: 5});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        res.body.should.be.deep.eql(food.slice(0, 5));
      });
      it('should use limit + page', async () => {
        const res = await chai.request(app)
          .get('/api/food').query({limit: 5, page: 3});
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        res.body.should.be.deep.eql(food.slice(10, 15));
      });
    });
  });
});
