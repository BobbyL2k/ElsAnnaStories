var fs = require('fs');
var wikiJson = JSON.parse(fs.readFileSync('reddit-wiki.json', 'utf8'));
var model = JSON.parse(fs.readFileSync('../assets/model.json', 'utf8')).model;

var contentMd = wikiJson.data.content_md;

var contentMdLine = contentMd.split('\r\n');
var columnName = contentMdLine[0].split('|');

console.log(columnName);

var stories = [];

	function getStory (mdLine) {
		var column = mdLine.split('|');
		var story = {};
		for(var c=0; c<columnName.length; c++){
			if(column[c])
				story[columnName[c]] = column[c];
		}
		return story;
	}

for(var c=2; c<contentMdLine.length; c++){
	stories[stories.length] = getStory(contentMdLine[c]);
}

for(var c=0; c<10; c++){
	console.log(stories[c]);
}