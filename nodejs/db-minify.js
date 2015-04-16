var fs = require('fs');
var data = JSON.parse(fs.readFileSync('../assets/data.json', 'utf8')).data;
var model = JSON.parse(fs.readFileSync('../assets/model.json', 'utf8')).model;

for(var c=0;c<data.length; c++){
	function getFFid(url){
		if(url.indexOf('fanfiction')>-1){
			var content = url.split('/');
			for(var c=0;c<content.length;c++){
				if(content[c] == 's' && c+1 < content.length){
					return content[c+1];
				}
			}
		}
		console.log('error can not read FF url of ' + url);
		return null;
	};
	function getAO3id(url){
		if(url.indexOf('archiveofourown')>-1){
			var content = url.split('/');
			for(var c=0;c<content.length;c++){
				if(content[c] == 'works' && c+1 < content.length){
					return content[c+1];
				}
			}
		}
		console.log('error can not read FF url of ' + url);
		return null;
	};

	if(data[c].FF){
		if(getFFid(data[c].FF)){
			data[c].FF = getFFid(data[c].FF);
		}
		else{
			data[c]['Other'] = data[c].FF;
			delete data[c].FF;
		}
	}
	if(data[c].AO3){
		if(getAO3id(data[c].AO3)){
			data[c].AO3 = getAO3id(data[c].AO3);
		}
		else{
			data[c]['Other'] = data[c].AO3;
			delete data[c].AO3;
		}
	}
}

var result = JSON.stringify({data:data});

result = result.split(',"').join(',\n    "');

result = result.split('},{').join('\n  },\n  {\n    ');

fs.writeFile("data.min.json", result, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});