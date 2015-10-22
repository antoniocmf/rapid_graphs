var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
			  
			  //var data = JSON.stringify(jsonObj);
			  //app.set('dados', {value: chartData2});
			  //var chartData =  app.get('dados').value;
			  console.log('Em index.js');
			  
			  res.render('index', { chartData: JSON.stringify(jsonObj) });		
			  
		  }

		});
		connection.end();
	
	
	
	
  
});

module.exports = router;
