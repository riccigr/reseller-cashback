const app = require('./src/config/express')();
const properties = require('./src/config/properties.js').properties;

app.listen(properties.express.port, () => {
    console.log('API running...');
});

module.exports = app;