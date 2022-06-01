const fetch = require("node-fetch")
const url = "http://localhost:4000"
it('works with get', async () => {
    expect.assertions(1)
    expect((await fetch(url)).status).toEqual(200)
})

it('works with get /v2/tornei', async () => {
    const response = await fetch(url+'/v2/tornei');
    const tornei = await response.json();
    console.log(tornei);
})
it('works with post /v2/tornei/creaTorneo', async () => {
    const response = await fetch(url+'/v2/tornei/creaTorneo');
    const tornei = await response.json();
    console.log(tornei);
})



