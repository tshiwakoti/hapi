'use strict';

const Hapi      = require('hapi');
const mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/books');
var db          = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

// Create a server wth a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: 3000,
    routes: {
        cors: true
    }
});

//Connect to db
// server.app.db = mongoose.connect('mongodb://localhost/test');

//Load plugins and start server
server.register([
    require('./routes/posts'),
    // require('./routes/users')
], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('API Server is running at:', server.info.uri);
    });

});