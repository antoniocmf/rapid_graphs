
AmCharts.addInitHandler(function(chart) {

  // check if export to table is enabled
  if (chart.dataTableId === undefined)
    return;

  // get chart data
  //chart.dataProvider = data2;
  var data = chart.dataProvider;
  
  // create a table
  var holder = document.getElementById(chart.dataTableId);
  var table = document.createElement("table");
  holder.appendChild(table);
  var tr, td;

  // add first row
  for (var x = 0; x < chart.dataProvider.length; x++) {
    // first row
    if (x == 0) {
      tr = document.createElement("tr");
      table.appendChild(tr);
      td = document.createElement("th");
      td.innerHTML = chart.categoryAxis.title;
      tr.appendChild(td);
      for (var i = 0; i < chart.graphs.length; i++) {
        td = document.createElement('th');
        td.innerHTML = chart.graphs[i].title;
        tr.appendChild(td);
      }
    }

    // add rows
    tr = document.createElement("tr");
    table.appendChild(tr);
    td = document.createElement("td");
    td.className = "row-title";
    td.innerHTML = chart.dataProvider[x][chart.categoryField];
    tr.appendChild(td);
    for (var i = 0; i < chart.graphs.length; i++) {
      td = document.createElement('td');
      td.innerHTML = chart.dataProvider[x][chart.graphs[i].valueField];
      tr.appendChild(td);
    }
  }

}, ["serial"]);