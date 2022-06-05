const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('./index')

test('app module should be defined', () => {
    expect(app).toBeDefined();
});
test('GET /MATCH', () => {
    return request(app)
    .get('/v2/match')
    .expect(200);
});
test('GET /TORNEO', () => {
    return request(app)
    .get('/v2/tornei')
    .expect(200);
});
test('GET /TORNEO', () => {
    return request(app)
    .get('/v2/tornei/62960ffc29381cb2ac14c252')
    .expect(200);
});
test('GET /MATCH-ID', () => {
    return request(app)
    .get('/v2/match/62950074bef232a22ed583b4')
    .expect(200);
});
