const request = require('supertest');
const jwt = require('jsonwebtoken');
const app= require('./index');
const mongoose = require('mongoose');
let connection;
let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTAyOTU5MDM4MzM3MTMwMDIwNjUzIiwiZGlzcGxheU5hbWUiOiJOaWNvbGEgWmlsaW8iLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJaaWxpbyIsImdpdmVuTmFtZSI6Ik5pY29sYSJ9LCJlbWFpbHMiOlt7InZhbHVlIjoibmljb2xhLnppbGlvLTFAc3R1ZGVudGkudW5pdG4uaXQiLCJ2ZXJpZmllZCI6dHJ1ZX1dLCJwaG90b3MiOlt7InZhbHVlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKd1hQY0o3X3pCMkcyeTBJMVNhNnNuV1hJVGRqbjNKeFJQUEdWZlU9czk2LWMifV0sInByb3ZpZGVyIjoiZ29vZ2xlIiwiX3JhdyI6IntcbiAgXCJzdWJcIjogXCIxMDI5NTkwMzgzMzcxMzAwMjA2NTNcIixcbiAgXCJuYW1lXCI6IFwiTmljb2xhIFppbGlvXCIsXG4gIFwiZ2l2ZW5fbmFtZVwiOiBcIk5pY29sYVwiLFxuICBcImZhbWlseV9uYW1lXCI6IFwiWmlsaW9cIixcbiAgXCJwaWN0dXJlXCI6IFwiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKd1hQY0o3X3pCMkcyeTBJMVNhNnNuV1hJVGRqbjNKeFJQUEdWZlVcXHUwMDNkczk2LWNcIixcbiAgXCJlbWFpbFwiOiBcIm5pY29sYS56aWxpby0xQHN0dWRlbnRpLnVuaXRuLml0XCIsXG4gIFwiZW1haWxfdmVyaWZpZWRcIjogdHJ1ZSxcbiAgXCJsb2NhbGVcIjogXCJpdFwiLFxuICBcImhkXCI6IFwic3R1ZGVudGkudW5pdG4uaXRcIlxufSIsIl9qc29uIjp7InN1YiI6IjEwMjk1OTAzODMzNzEzMDAyMDY1MyIsIm5hbWUiOiJOaWNvbGEgWmlsaW8iLCJnaXZlbl9uYW1lIjoiTmljb2xhIiwiZmFtaWx5X25hbWUiOiJaaWxpbyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp3WFBjSjdfekIyRzJ5MEkxU2E2c25XWElUZGpuM0p4UlBQR1ZmVT1zOTYtYyIsImVtYWlsIjoibmljb2xhLnppbGlvLTFAc3R1ZGVudGkudW5pdG4uaXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibG9jYWxlIjoiaXQiLCJoZCI6InN0dWRlbnRpLnVuaXRuLml0In19LCJpYXQiOjE2NTQ1MjI5MzEsImV4cCI6MTY1NDYwOTMzMX0.tIHgpU2lyw3ZiIqVBY17ufZUhy7_DcI5Mk1aVD7OOqM"    

beforeAll( async () => {
    jest.setTimeout(5000);
    connection = await  mongoose.connect('mongodb+srv://Hydran00:aaa@cluster0.5c9ts.mongodb.net/test');
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
    test('GET /v2/tornei should return 200', async ()=>{
        return request(app).get('/v2/tornei')
        .set('Accept', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(200)
    });


   /* test('POST /v2/tornei con valori corretti', ()=>{
        request(app)
            .post('/v2/tornei')
            .set('x-access-token', token)
            .send({nome_torneo:'prova jest', data: '2022-06-04T10:51:00.000+00:00', organizzatore:'Nicola Zilio', sede:'Povo0', max_partecipanti:16, risultati: [],admin_gioca:true})
            .then(response=>{
                expect(response.statusCode).toBe(200)
            })
        })
    
    test('POST /v2/tornei con valori vuoti', ()=>{
        request(app)
            .post('/v2/tornei')
            .set('x-access-token', token)
            .then(response=>{
                expect(response.statusCode).toBe(400)
            })
        })
        test('POST /v2/tornei con valori mancanti', ()=>{
            request(app)
                .post('/v2/tornei')
                .set('x-access-token', token)
                .send({nome_torneo:'prova jest', data: '2022-06-04T10:51:00.000+00:00', sede:'Povo0', max_partecipanti:16, risultati: [],admin_gioca:true})
                .then(response=>{
                    expect(response.statusCode).toBe(400)
                })
            })

    
        test('POST /v2/iscrizione-torneo valori corretti', ()=>{
            request(app)
                .post('/v2/iscrizione-torneo')
                .set('x-access-token', token)
                .send({nome_utente : 'Nicola Zilio'})
                .send("id=6291ffb876a3b808adb046e0")
                .then(response=>{
                    expect(response.statusCode).toBe(201)
                })
            })
        test('POST /v2/iscrizione-torneo con id inesistente', ()=>{
            request(app)
                .post('/v2/iscrizione-torneo')
                .set('x-access-token', token)
                .send({nome_utente : 'Nicola Zilio'})
                .send({id:'fjds'})
                .then(response=>{
                    expect(response.statusCode).toBe(400)
                })
            })
        test('POST /v2/iscrizione-torneo con utente già iscritto', ()=>{
            request(app)
                .post('/v2/iscrizione-torneo')
                .set('x-access-token', token)
                .send({nome_utente : 'Nicola Zilio'})
                .send("id:6291fd97e09fc9af6aa7851c")
                .then(response=>{
                    expect(response.statusCode).toBe(403)
                })
            })

        test('DELETE /v2/iscrizione-torneo con parametri corretti', ()=>{
            request(app)
            .delete('/v2/iscrizione-torneo')
            .set('x-access-token', token)
            .send({nome_utente : 'Nicola Zilio'})
            .send("id=6291ffb876a3b808adb046e0")
            .then(response=>{
                expect(response.statusCode).toBe(200)
            })
            })
        test('DELETE /v2/iscrizione-torneo con id inesistente', ()=>{
            request(app)
            .delete('/v2/iscrizione-torneo')
            .set('x-access-token', token)
            .send({nome_utente : 'Nicola Zilio'})
            .send("id=aaa")
            .then(response=>{
                expect(response.statusCode).toBe(400)
            })
            })
        test('DELETE /v2/iscrizione-torneo con utente non iscritto', ()=>{
            request(app)
            .delete('/v2/iscrizione-torneo')
            .set('x-access-token', token)
            .send({nome_utente : 'AAAAAA'})
            .send("id=6291ffb876a3b808adb046e0")
            .then(response=>{
                expect(response.statusCode).toBe(403)
            })
            })

    
        test('GET /v2/tornei/:id con id torneo giusto should return 200', ()=>{
        request(app)
        .get('/v2/tornei/:id')
        .set('x-access-token', token)
        .send('id=6291fd97e09fc9af6aa7851c')
        .then(response=>{
            expect(response.statusCode).toBe(200);
        })

    })
    
    test('GET /v2/tornei/:id with wrong id should return 400',()=>{
        request(app)
         .get('/v2/tornei/:id')
         .set('x-access-token', token)
         .send('id=111')
         .then(response=>{
             expect(response.statusCode).toBe(400);
         })

    })

    test('DELETE /v2/tornei/:id con parametri corretti should return 200',()=>{
        request(app)
         .delete('/v2/tornei/:id')
         .set('x-access-token', token)
         .send({user: "Nicola Zilio"})
         .send('id=6291fd97e09fc9af6aa7851c')
         .then(response=>{
             expect(response.statusCode).toBe(200);
         })

    })

    test('DELETE /v2/tornei/:id con utente non organizzatore should return 401',()=>{
        request(app)
         .delete('/v2/tornei/:id')
         .set('x-access-token', token)
         .send({user: "AAAA"})
         .send('id=6291fd97e09fc9af6aa7851c')
         .then(response=>{
             expect(response.statusCode).toBe(401);
         })

    })
    test('DELETE /v2/tornei/:id with wrong id should return 404',()=>{
        request(app)
         .delete('/v2/tornei/:id')
         .set('x-access-token', token)
         .send('id=111')
         .then(response=>{
             expect(response.statusCode).toBe(404);
         })

    })

    test('GET /v2/risultati-torneo/:id con parametri corretti should return 200',()=>{
        request(app)
         .get('/v2/risultati-torneo/:id')
         .set('x-access-token', token)
         .send({user: "Nicola Zilio"})
         .send('id=6291fd97e09fc9af6aa7851c')
         .then(response=>{
             expect(response.statusCode).toBe(200);
         })

    })
    test('GET /v2/risultati-torneo/:id con id sbagliato should return 500',()=>{
        request(app)
         .get('/v2/risultati-torneo/:id')
         .set('x-access-token', token)
         .send({user: "Nicola Zilio"})
         .send('id=aaa')
         .then(response=>{
             expect(response.statusCode).toBe(500);
         })

    })
    test('POST /v2/risultati-torneo/:id con parametri corretti should return 200',()=>{
        request(app)
         .post('/v2/risultati-torneo/:id')
         .set('x-access-token', token)
         .send({player1:'Nicola Zilio', player2: 'Davide Nardi',score1:11, score2:2})
         .send('id=6297a6374622b8da1b58f6ae')
         .then(response=>{
             expect(response.statusCode).toBe(200);
         })

    })
    test('POST /v2/risultati-torneo/:id con body incompleto should return 400',()=>{
        request(app)
         .post('/v2/risultati-torneo/:id')
         .set('x-access-token', token)
         .send({player1:'Nicola Zilio', player2: 'Davide Nardi', score2:2})
         .send('id=6297a6374622b8da1b58f6ae')
         .then(response=>{
             expect(response.statusCode).toBe(400);
         })

    })
    */

