var xmlhttp;
if (window.XMLHttpRequest){
    xmlhttp=new XMLHttpRequest();
}
else{// for IE6, IE5 ***NOT TESTED***
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
        loadTableData(xmlhttp.responseText);
    }
}
xmlhttp.open("GET","data.json",true);
xmlhttp.send();

function loadTableData(JsonData){
	var obj = JSON.parse(JsonData);
	var result = "";
	for(var c=0; c<obj['data'].length; c++){
		var objc = obj['data'][c];
		// First, checks if it isn't implemented yet.
		if (!String.prototype.format) {
			String.prototype.format = function() {
				var args = arguments;
				return this.replace(/{(\d+)}/g, function(match, number) { 
					return typeof args[number] != 'undefined'
					? args[number]
					: match
					;
				});
			};
		}
		function getStoryData(index){
			if(index in obj['index']['enum']){
				return obj['index']['enum'][index][objc[index]];
			}
			return objc[index];
		}
		result += '<tr><td>{0}</td><td>'.format(
				getStoryData('Title')
			);
		if('Detail' in objc){
			result+= '<div class="hshow"><div>i</div><div class="textBlock">{0}</div></div>'.format(getStoryData('Detail'));
		}
		if('FF' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\">F</a></div><div>FanFiction.net</div></div>'.format(getStoryData('FF'));
		}
		if('AO3' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\">A</a></div><div>ArchiveOfOurOwn.org</div></div>'.format(getStoryData('AO3'));
		}
		if('Other' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\">O</a></div><div>Other</div></div>'.format(getStoryData('Other'));
		}
		result += '</td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td><td>{11}</td><td>{12}</td></tr>'.format(
				getStoryData('Author'),
				getStoryData('Length'),
				getStoryData('Type'),
				getStoryData('Complete'),
				getStoryData('Setting'),
				getStoryData('Elsa'),
				getStoryData('Anna'),
				getStoryData('Powers'),
				getStoryData('Sisters'),
				getStoryData('Rating'),
				getStoryData('Smut'),
				getStoryData('Added'),
				getStoryData('Published')
			);
	}
	var table = document.getElementById('content-table');
	table.innerHTML = result;
}