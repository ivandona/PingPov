const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');
const jestConfig = require('../jest/jest.config');
const mongoose = require('mongoose');
const { deleteOne } = require('./models/user');
let connection;

beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_TEST_URL,{useNewUrlParser: true, useUnifiedTopology: true});
    //return connection; // Need to return the Promise db connection?
});

afterAll(() => {
    mongoose.connection.close(true);
});

let token;

test('Autenticazione', async()=>{
    await request(app).post('/v2/autenticazione')
        .send({
            email:'John@mail.com',
            password: 'aaa'
        })
        .expect(200)
        .then((res)=>{  
            token = res.body.token;    
        })
    return;
})

test('GET /v2/match should return 200', ()=>{
    return request(app)
    .get('/v2/match')
    .expect(200);
});



test('POST /v2/match con modalità sbagliata', ()=>{
    return request(app)
    .post('/v2/match')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .send({data: '2010-06-04T10:51:00.000+00:00',sede:"Povo0",modalità:'aaa'})
    .expect(403)
});

test('POST /v2/match con sede sbagliata', ()=>{
    return request(app)
    .post('/v2/match')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .send({data: '2010-06-04T10:51:00.000+00:00',sede:"aaa",modalità:'Singolo'})
    .expect(403)
});
test('POST /v2/match con dati corretti', ()=>{
    return request(app)
    .post('/v2/match')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .send({data :'2023-06-04T13:27:00.000+00:00', sede:'Povo0', modalità:'Singolo'})
    .expect(201)
});

test('GET /v2/match/i-miei-match con match non presenti',()=>{
    return request(app)
    .get('/v2/match/i-miei-match')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .expect(404)
})


test('DELETE /v2/match/:id con match non presenet', ()=>{
    return request(app)
    .delete('/v2/match/sdadsa')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .expect(400)
})

test('DELETE /v2/match/:id con username sbaglaito', ()=>{
    return request(app)
    .delete('/v2/match/629f526839e819151007605b')
    .set('token',token)
    .set('Accept', 'applicaion/json')
    .expect(401)
})

test('GET /v2/cronologia-match con match esistenti', ()=>{
    return request(app)
    .get('/v2/cronologia-match')
    .set('token',token)
    .expect(200)
})





