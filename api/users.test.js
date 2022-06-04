const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('./users');

describe('GET /v2/users/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll( () => {
    const User = require('./models/user');
    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        id: 1212,
        username: 'Ivan'
      };
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });
  
  test('GET /v2/users/me with no token should return 401', async () => {
    const response = await request(app).get('/v2/users/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /v2/users/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/v2/users/me?token=123456');
    expect(response.statusCode).toBe(403);
  });

  // create a valid token
  var payload = {
    email: 'John@mail.com'
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
  test('GET /v2/users/me?token=<valid> should return 200', async () => {
    expect.assertions(1);
    const response = await request(app).get('/v2/users/me?token='+token);
    expect(response.statusCode).toBe(200);
  });

  test('GET /v2/users/me?token=<valid> should return user information', async () => {
    expect.assertions(2);
    const response = await request(app).get('/v2/users/me?token='+token);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.email).toBe('John@mail.com');
  });
});