//imports
const express = require('express');
const app = express();
const ip = require('ip');

//routes
const mainRoutes = require('./routes/mainRoutes')

//middleware
app.use('/', mainRoutes);
app.use('/', express.static('public'));

//run server
app.listen(80, ip.address(), function() {
    console.log("server online!")
});