const app = require('./index')
app.listen(process.env.PORT || 4000, () => {
    console.log('server started!');
});