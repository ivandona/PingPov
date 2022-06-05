const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('./index')
//const mongoose = require('./index')

beforeAll( async () => {
  })


test('app module should be defined', () => {
    expect(app).toBeDefined();
});
test('GET /MATCH', () => {
    request(app)
    .get('/v2/match')
    .expect(200);
});
test('GET /TORNEO',  async () => {
    let res = await request(app)
    .get('/v2/tornei')
    console.log(res)
});
test('GET /TORNEI', async () => {
    let res = await request(app)
    .get('/v2/tornei/62960ffc29381cb2ac14c252')
    console.log(res)
});
test('GET /MATCH-ID', async () => {
    await request(app)
    .get('/v2/match/62950074bef232a22ed583b4')
    .expect(200);

});

afterAll( async () => {
    //await mongoose.connection.close();
})
