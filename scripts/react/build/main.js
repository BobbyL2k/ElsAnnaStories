var index=null,
	tableData=null;

getJSON('assets/data.json',function(data) {
	tableData = data.data;
	start();
});
getJSON('assets/model.json',function(data) {
	index = data.model;
	start();
});

function start() {
	if(index && tableData){
		React.initializeTouchEvents(true);
		React.render(
			React.createElement(ArkTableWithFilter, {index: index, content: tableData}),
			document.getElementById('fiction-table')
		);
	}
}
