// .env files are loaded only in dev mode. Create a ".env" file in the root
// of the project and enter the connection string there. Example:
//
//      connectionString=mongodb://user:password@devservers
//
// Since the demo application is hosted on Heroku, the NODE_ENV variable
// is automatically set to "production" when the app is deployed.

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//MOdels import
const Counter = require('./models/Counter');
const Url = require('./models/Url');


// App variable initialization
//
// Note the connectionString is initialized from an environment variable
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const mongoose = require('mongoose'),


connectionString = process.env.connectionString,
port = process.env.PORT || 4234;



// ExpressJS server start
http.listen(port, function() {
    console.log(`Server started and listening on port ${port}`);
});

// ExpressJS middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

//HTML rendering
const ejs = require("ejs");
app.use(express.static('public'));
app.set( "view engine", 'ejs');

//Load Route
const routes = require('./routes/routes');

// Use Route
app.use('/', routes);

// Connect to the MongoDB instance
mongoose.connect(connectionString,{
  useNewUrlParser: true,
  useUnifiedTopology: true
  }).then( db => {
    console.log('Mongo Connected');
  }).catch(error => console.log(error))


// Reset the app to default values when starting the server
//
// WARNING: Do this only when you want a fresh instance of the application else
// comment the code.

// 
// promise.then(function(db) {
//     var URL = new Url()
//     console.log('APP: Connected to MongoDB');
//     URL.remove({}, function() {
//         console.log('APP: URL collection emptied');
//     })
//     Counter.remove({}, function() {
//         console.log('APP: Counter collection emptied');
//         console.log('APP: Initializing Counter collection with a default value');
//         var counter = new Counter({_id: 'url_count', count: Math.random(10000, 90000) });
//         counter.save(function(err) {
//             if(err) {
//                 console.error('APP: Error while initializing counter');
//                 return console.error(err);
//             }
//             console.log('APP: Counter has been initialized');
//         });
//     });
// });
