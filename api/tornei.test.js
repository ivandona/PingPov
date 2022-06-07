const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');
const jestConfig = require('../jest/jest.config');
const mongoose = require('mongoose');
const { deleteOne } = require('./models/user');
let connection;
beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_TEST_URL, {useNewUrlParser: true, useUnifiedTopology: true});
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

test('GET /v2/tornei should return 200', async () => {
    return await request(app).get('/v2/tornei')    
        .expect(200)
});


test('POST /v2/tornei con valori corretti', () => {
    return request(app)
        .post('/v2/tornei')
        .set('token', token)
        .set('Accept', 'application/json')
        //.send({ nome_torneo: 'prova jest', data: '2022-06-04T10:51:00.000+00:00', sede: 'Povo0', numero_partecipanti: 16, admin_gioca: true })
        .send({ nome_torneo: "prova jest", data: "2023-06-08T10:51:00.000+00:00", sede: "Povo0", numero_partecipanti: 16, admin_gioca: true  })
        .expect(200)

})

test('POST /v2/tornei con valori vuoti', () => {
    return request(app)
        .post('/v2/tornei')
        .set('token', token)

        .expect(400)

})
test('POST /v2/tornei con valori mancanti', () => {
    return request(app)
        .post('/v2/tornei')
        .set('token', token)
        .send({ nome_torneo: 'prova jest', data: '2022-06-04T10:51:00.000+00:00', numero_partecipanti: 16, admin_gioca: true })

        .expect(400)

})


test('DELETE /v2/iscrizione-torneo con parametri corretti', () => {
    return request(app)
        .delete('/v2/iscrizione-torneo/629f3df8fbaeaff8a3332884')
        .set('token', token)
        .expect(200)
})
test('DELETE /v2/iscrizione-torneo con utente non iscritto', () => {
    return request(app)
        .delete('/v2/iscrizione-torneo/629f3968fa62d907de51b88e')
        .set('token', token)
        .expect(403)

})

test('POST /v2/iscrizione-torneo', async() => {
        return await request(app)
        .post('/v2/iscrizione-torneo/629f3df8fbaeaff8a3332884')
        .set('token', token).expect(201);
})
test('DELETE /v2/iscrizione-torneo con id inesistente', () => {
    jest.setTimeout(1000); 
    return request(app)
        .delete('/v2/iscrizione-torneo/fjds')
        .set('token', token)
        .expect(400)
})



test('GET /v2/tornei/:id con id torneo giusto should return 200', () => {
    return request(app)
        .get('/v2/tornei/629f3df8fbaeaff8a3332884')
        .set('token', token)
        .expect(200)

})

test('GET /v2/tornei/:id with wrong id should return 400', () => {
    return request(app)
        .get('/v2/tornei/FFFFFFF')
        .expect(400);
})


test('DELETE /v2/tornei/:id con utente non organizzatore should return 401', () => {
    return request(app)
        .delete('/v2/tornei/629f3df8fbaeaff8a3332884')
        .set('token', token)
        .expect(401);
    
})
test('DELETE /v2/tornei/:id with wrong id should return 400', () => {
    return request(app)
        .delete('/v2/tornei/vvvj')
        .set('token', token)
        .expect(400);


})

test('GET /v2/risultati-torneo/:id con parametri corretti should return 200', () => {
    return request(app)
        .get('/v2/risultati-torneo/629f3df8fbaeaff8a3332884')
        .expect(200);


})
test('GET /v2/risultati-torneo/:id con id sbagliato should return 400', () => {
    return request(app)
        .get('/v2/risultati-torneo/fdsfs')
        .expect(400);


})
test('POST /v2/risultati-torneo/:id con body incompleto should return 400', () => {
    return request(app)
        .post('/v2/risultati-torneo/629f3a1dae4f6f11ef0eb46f')
        .set('token', token)
        .send({player1 : 'Nicola Zilio', player2: 'Davide Nardi', score2: 2 })

        .expect(400);
})

