var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var robot = require('./robot');
var database = require('./database/database');
var models = require('./database/models/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', (req, res, next) => {
  res.render("index");
})


app.post('/follow',function(req, res){
  var userid=req.body.user_id;
  var followerNumber=parseInt(req.body.follower_number);
  res.end("yes");
  follow(followerNumber, userid);
});

app.post('/create',function(req, res){
  var followerNumber=parseInt(req.body.user_number);
  res.end("yes");
  createUser(followerNumber);
});

var userDetail = {};
async function createUser(followNumber) {
  var results = await database.get(models.NameItem, {attributes: ['firstName', 'lastName', 'gender', 'bio'], order: models.sequelize.random(), limit: followNumber});
  (async function() {
    for(let i = 0; i < followNumber; i++){
      let randomFirsName = Math.floor(Math.random() * results.length);
      let randomLastName = Math.floor(Math.random() * results.length);
      let randomBio = Math.floor(Math.random() * results.length);
      let generateUser = results[randomFirsName].firstName + results[randomLastName].lastName;
      await robot.createAccount(generateUser, userDetail, results[randomBio].bio, results[randomFirsName].gender);
      if(userDetail.username && userDetail.password){
        await database.create(models.User, userDetail);
      }
    }
  })();
}

async function follow (quantity, userId) {
  var results = await database.get(models.User, {attributes: ['username', 'password'], order: models.sequelize.random(), limit: quantity});
  (async function() {
    for(i of results){
      await robot.follow(userId, i.username, i.password);
    }
  })();
}

robot.uploadImageProfil('parham.we', 'qwert654');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
