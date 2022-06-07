const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');
const jestConfig = require('../jest/jest.config');
const mongoose = require('mongoose');
const { deleteOne } = require('./models/user');
let connection;

beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_TEST_URL);
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
});

afterAll(() => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
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
    .then(response=>{
        expect(response.statusCode).toBe(200);
        done();
    })
});

test('POST /v2/match con data sbagliata', ()=>{
    return request(app)
    .post('/v2/match')
    .set('x-access-token',token)
    .set({data: '2010-06-04T10:51:00.000+00:00'})
    .set('Accept', 'applicaion/json')
    .then(response=>{
        expect(response.statusCode).toBe(403);
        done()

    })
});


test('POST /v2/match con modalità sbagliata', ()=>{
    return request(app)
    .post('/v2/match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({modalità: 'Prova'})
    .expect(403, "Modalità specificata diversa tra quelle disponibili (Singolo,Doppio)")
});

test('POST /v2/match con sede sbagliata', ()=>{
    return request(app)
    .post('/v2/match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({sede: 'Prova'})
    .expect(403, "Sede specificata diversa tra quelle disponibili (Povo0,Povo1)")
});
test('POST /v2/match con dati corretti', ()=>{
    return request(app)
    .post('/v2/match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({data : '2022-06-04T13:27:00.000+00:00', sede:'Povo0', modalità:'Singolo'})
    .expect(200)
});

test('GET /v2/match/i-miei-match con match non presenti',()=>{
    return request(app)
    .get('/v2/match/i-miei-match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .expect(404)
})

test('GET /v2/match/i-miei-match con match presenti',()=>{
    return request(app)
    .get('/v2/match/i-miei-match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .expect(200)
})
test('DELETE /v2/match/:id con match non presenet', ()=>{
    return request(app)
    .delete('/v2/match/:id')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({id: 'whathever'})
    .expext(404)
})
test('DELETE /v2/match/:id con username sbaglaito', ()=>{
    return request(app)
    .delete('/v2/match/:id')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({id: 'whathever', displayName : 'aaa'})
    .expext(401)
})
test('DELETE /v2/match/:id con username valori corretti', ()=>{
    return request(app)
    .delete('/v2/match/:id')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({id: 'whathever', displayName : 'user'})
    .expext(200)
})
test('GET /v2/match/cronologia-match con match inesistenti', ()=>{
    return request(app)
    .delete('/v2/match/cronologia-match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({displayName : 'aaa'})
    .expext(404)
})
test('GET /v2/match/cronologia-match con match esistenti', ()=>{
    return request(app)
    .delete('/v2/match/cronologia-match')
    .set('x-access-token',token)
    .set('Accept', 'applicaion/json')
    .send({displayName : 'user'})
    .expext(200)
})





