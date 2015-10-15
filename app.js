
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//iniciar a var export
var exports = module.exports = {};

//conexão com o DB 
var mysql      = require('mysql');
var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'sistema'
	});

	connection.connect();

	connection.query('SELECT * from produto ', function(err, rows, fields) {
	  if (err) throw err;
	  else {
		  //console.log('The solution is: ', rows );
		  var jsonObj = [];
		  for(var i in rows){
			  item = {};
			  item["id"] = rows[i].id_produto;
			  item["valor"] = rows[i].valor_produto;
			  jsonObj.push(item);
		  }
		  //console.log(JSON.stringify(jsonObj));
		  var chartData2 = JSON.stringify(jsonObj);
		  exports.chartData2;
		  //console.log(chartData2);
		  
	  }

	});
	 
	connection.end();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


