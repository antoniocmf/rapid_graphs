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
		
		
		//select pra vendas por dia da semana 
		connection.query('select sum(valor_total) as soma, DAYNAME(dt_venda) as dia from vendas group by DAYNAME(dt_venda) order by sum(valor_total) desc;', function(err, rows, fields) {
		  if (err) throw err;
		  else {
			  var jsonObj = [];
			  for(var i in rows){
				  item = {};
				  item["valor_total"] = rows[i].soma;
				  item["dia"] = rows[i].dia;
				  jsonObj.push(item);
			  }
			  
			//select pra ver as vendas por mes 
				connection.query('select sum(valor_total) as soma, MONTHNAME(dt_venda) as mes from vendas group by MONTHNAME(dt_venda) order by MONTH(dt_venda) asc;', function(err, rows, fields) {
					  if (err) throw err;
					  else {
						  //console.log('The solution is: ', rows );
						  var jsonObj2 = [];
						  for(var i in rows){
							  item = {};
							  item["valor_total"] = rows[i].soma;
							  item["mes"] = rows[i].mes;
							  jsonObj2.push(item);
						  }  
						  res.render('index', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2) });		
					  }
					});
					connection.end();[]
					
		  }

		});
		
  
	
});


router.get('/produto.jade', function(req, res, next) {
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			  host     : 'localhost',
			  user     : 'root',
			  password : 'root',
			  database : 'sistema'
			});

			connection.connect();
			
			
			//select pra vendas por dia da semana 
			connection.query('select linha_produto as linha, SUM(qte_produto*valor_produto) as soma from produto inner join detalhes_venda on produto.id_produto = detalhes_venda.produto_id_produto group by linha_produto order by SUM(qte_produto*valor_produto) asc;', function(err, rows, fields) {
			  if (err) throw err;
			  else {
				  var jsonObj = [];
				  for(var i in rows){
					  item = {};
					  item["valor_total"] = rows[i].soma;
					  item["dia"] = rows[i].linha;
					  jsonObj.push(item);
				  }
				  
				//select pra ver as vendas por mes 
					connection.query('select area_produto as area, SUM(qte_produto*valor_produto) as soma from produto inner join detalhes_venda on produto.id_produto = detalhes_venda.produto_id_produto group by area_produto order by sum(qte_produto*valor_produto) asc;', function(err, rows, fields) {
						  if (err) throw err;
						  else {
							  //console.log('The solution is: ', rows );
							  var jsonObj2 = [];
							  for(var i in rows){
								  item = {};
								  item["valor_total"] = rows[i].soma;
								  item["mes"] = rows[i].area;
								  jsonObj2.push(item);
							  }  
							  res.render('produto.jade', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2) });		
						  }
						});
						connection.end();[]
						
			  }

			});
			
			
});

module.exports = router;
