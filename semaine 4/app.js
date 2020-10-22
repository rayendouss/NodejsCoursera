const express = require('express'),
    http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const hostname = 'localhost';
const port = 3000;
const morgan = require('morgan');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var favouriteRouter = require('./routes/favoriteRouter');
const index = require('./routes/index')
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
app.use(passport.initialize());
app.use(passport.session());

var config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
const uploadRouter = require('./routes/uploadRouter');
app.use('/imageUpload',uploadRouter);
app.use('/', index);
app.use('/users', usersRouter);
app.use(passport.initialize());



connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });
app.use('/',index);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/favorites', favouriteRouter);
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
