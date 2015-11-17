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
		  database : 'sistema2'
		});

		connection.connect();
		
		
		//select pra vendas por dia da semana 
		connection.query('select  DAYNAME(dt_venda) as dia, sum(vl_venda) as soma from tb_vendas group by DAYNAME(dt_venda) order by DAYOFWEEK(dt_venda) asc;', function(err, rows, fields) {
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
				connection.query('select sum(vl_venda) as soma, MONTHNAME(dt_venda) as mes from tb_vendas group by MONTHNAME(dt_venda) order by MONTH(dt_venda) asc;', function(err, rows, fields) {
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
						  
						  
						//select vendas por tipo de caixa
							connection.query('select ds_tipo_caixa, sum(vl_venda) as porcentagem  from tb_vendas group by ds_tipo_caixa order by porcentagem asc;', function(err, rows, fields) {
								  if (err) throw err;
								  else {
									  //console.log('The solution is: ', rows );
									  var jsonObj3 = [];
									  for(var i in rows){
										  item = {};
										  item["porcentagem"] = rows[i].porcentagem;
										  item["tipo_caixa"] = rows[i].ds_tipo_caixa;
										  jsonObj3.push(item);
									  }  
									  res.render('index', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2), chartData3: JSON.stringify(jsonObj3)  });		
								  }
								});
							    connection.end();[]
					  }
					});
					
		  }
		});
});

//render da pagina produto
router.get('/produto.jade', function(req, res, next) {
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			  host     : 'localhost',
			  user     : 'root',
			  password : 'root',
			  database : 'sistema2'
			});

			connection.connect();
			
			
			//select pra vendas por linha 
			connection.query('select ds_linha as linha, vl_produto*count(nm_produto) as soma, count(tb_produto_id_produto) as produtos from tb_cat_produto inner join tb_produto on(id_cat_produto = tb_cat_produto_id_cat_produto) inner join tb_vendas_id on(id_produto = tb_produto_id_produto) inner join tb_vendas on(tb_vendas_id_venda = id_venda) group by ds_linha order by soma asc;', function(err, rows, fields) {
			  if (err) throw err;
			  else {
				  var jsonObj = [];
				  for(var i in rows){
					  item = {};
					  item["valor_total"] = rows[i].soma;
					  item["dia"] = rows[i].linha;
					  item["produtos"] = rows[i].produtos;
					  jsonObj.push(item);
				  }
				  
				//select pra ver vendas por area
					connection.query('select ds_setor as area, vl_produto*count(nm_produto) as soma, count(tb_produto_id_produto) as produtos from tb_cat_produto inner join tb_produto on(id_cat_produto = tb_cat_produto_id_cat_produto) inner join tb_vendas_id on(id_produto = tb_produto_id_produto) inner join tb_vendas on(tb_vendas_id_venda = id_venda) group by ds_setor order by soma asc;', function(err, rows, fields) {
						  if (err) throw err;
						  else {
							  //console.log('The solution is: ', rows );
							  var jsonObj2 = [];
							  for(var i in rows){
								  item = {};
								  item["valor_total"] = rows[i].soma;
								  item["dia"] = rows[i].area;
								  item["produtos"] = rows[i].produtos;
								  jsonObj2.push(item);
							  }  
							  
							  
							  //produtos mais vendidos
								connection.query('select nm_produto as nome, vl_produto*count(nm_produto) as soma, count(tb_produto_id_produto) as produtos from tb_produto inner join tb_vendas_id on(id_produto = tb_produto_id_produto) inner join tb_vendas  on(tb_vendas_id_venda = id_venda) group by nm_produto order by soma asc limit 10; ', function(err, rows, fields) {
									  if (err) throw err;
									  else {
										  //console.log('The solution is: ', rows );
										  var jsonObj3 = [];
										  for(var i in rows){
											  item = {};
											  item["valor_total"] = rows[i].soma;
											  item["dia"] = rows[i].nome;
											  item["produtos"] = rows[i].produtos;
											  jsonObj3.push(item);
										  }  
									  
											//produtos para vencer
											connection.query('select nm_produto as nome, dt_validade as data_validade from tb_produto where dt_validade between date_sub(now(),INTERVAL 1 WEEK) and now() order by dt_validade asc;', function(err, rows, fields) {
												  if (err) throw err;
												  else {
													  //console.log('The solution is: ', rows );
													  var jsonObj4 = [];
													  for(var i in rows){
														  item = {};
														  item["data_validade"] = rows[i].data_validade;
														  item["nome"] = rows[i].nome;
														  jsonObj4.push(item);
													  }
		
													  res.render('produto.jade', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2), chartData3: JSON.stringify(jsonObj3), chartData4: jsonObj4 });
													  
												  }
												});
												connection.end();[]									  
									  
									  }
									});
						  }
						});
						
			  }
			});
			
	});


//render da pagina funcionario
router.get('/funcionario.jade', function(req, res, next) {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'sistema2'
		});

		connection.connect();
		
		
		//funcionario caixa normal
		connection.query('SELECT tb_funcionario_id_funcionario as funcionario, vl_venda as soma FROM tb_vendas WHERE ds_tipo_caixa = "normal" group by funcionario order by soma asc;', function(err, rows, fields) {
		  if (err) throw err;
		  else {
			  var jsonObj = [];
			  for(var i in rows){
				  item = {};
				  item["valor_total"] = rows[i].soma;
				  item["dia"] = rows[i].funcionario;
				  jsonObj.push(item);
			  }
			  
			//funcionario caixa rapido
				connection.query('SELECT tb_funcionario_id_funcionario as funcionario, vl_venda as soma FROM tb_vendas WHERE ds_tipo_caixa = "rapido" group by funcionario order by soma asc;', function(err, rows, fields) {
					  if (err) throw err;
					  else {
						  //console.log('The solution is: ', rows );
						  var jsonObj2 = [];
						  for(var i in rows){
							  item = {};
							  item["valor_total"] = rows[i].soma;
							  item["mes"] = rows[i].funcionario;
							  jsonObj2.push(item);
						  }
						  
						  
						  //media de vendas por funcionario
							connection.query('select AVG (vl_venda) as soma, tb_funcionario_id_funcionario as funcionario from tb_vendas group by tb_funcionario_id_funcionario order by soma desc;', function(err, rows, fields) {
								  if (err) throw err;
								  else {
									  //console.log('The solution is: ', rows );
									  var jsonObj3 = [];
									  for(var i in rows){
										  item = {};
										  item["media"] = rows[i].soma;
										  item["funcionario"] = rows[i].funcionario;
										  jsonObj3.push(item);
									  }  
									  res.render('funcionario.jade', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2), chartData3: JSON.stringify(jsonObj3)  });		
								  }
								});
							    connection.end();[]
					  }
					});
					
		  }
		});
});




//render da pagina fornecedor
router.get('/fornecedor.jade', function(req, res, next) {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'sistema2'
		});

		connection.connect();
		
		
		//vendas por fornecedor
		connection.query('select nm_fornecedor as nome, count(nm_fornecedor) as produtos, vl_produto*count(nm_fornecedor) as soma  from tb_fornecedor inner join tb_produto on tb_fornecedor.id_fornecedor = tb_produto.tb_fornecedor_id_fornecedor inner join tb_vendas_id on tb_produto.id_produto = tb_vendas_id.tb_produto_id_produto group by nm_fornecedor order by soma asc;', function(err, rows, fields) {
		  if (err) throw err;
		  else {
			  var jsonObj = [];
			  for(var i in rows){
				  item = {};
				  item["valor_total"] = rows[i].soma;
				  item["nome"] = rows[i].nome;
				  item["produtos"] = rows[i].produtos;
				  jsonObj.push(item);
			  }
			  res.render('fornecedor.jade', { chartData: JSON.stringify(jsonObj)});		
		  }
			
		});
		
		connection.end();[]
	
});

//render da pagina de gastos 
router.get('/gastos.jade', function(req, res, next) {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'sistema2'
		});

		connection.connect();
		
		
		//select gastos por tipo
		connection.query('select (sum(vl_conta)) as porcentagem, ds_tipo_conta as tipo_de_conta from tb_contas_cont group by tipo_de_conta;', function(err, rows, fields) {
		  if (err) throw err;
		  else {
			  var jsonObj = [];
			  for(var i in rows){
				  item = {};
				  item["porcentagem"] = rows[i].porcentagem;
				  item["gasto"] = rows[i].tipo_de_conta;
				  jsonObj.push(item);
			  }
			  
			//evolucao dos gastos
				connection.query('select sum(vl_conta) as soma, MONTHNAME(dt_conta) as mes from tb_contas_cont group by month(dt_conta) asc;', function(err, rows, fields) {
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
						  res.render('gastos.jade', { chartData: JSON.stringify(jsonObj) , chartData2: JSON.stringify(jsonObj2) });		
					  }
					});
					connection.end();[]
		  }
		});
});


//pagina de login
router.get('/login.jade', function(req, res, next) {
	  res.render('login.jade', { title: 'Express' });
	});


module.exports = router;
