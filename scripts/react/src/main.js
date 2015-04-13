var index,content;

getJSON('assets/data.json',function(data) {
	content = data.data;
	start();
});
getJSON('assets/model.json',function(data) {
	index = data.model;
	start();
});

function start() {
	if(index && content){
		React.render(
			<ArkTable index={index} content={content} />,
			document.getElementById('fiction-table')
		);
	}
}
