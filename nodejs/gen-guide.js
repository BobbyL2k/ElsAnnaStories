var fs = require('fs');
var model = JSON.parse(fs.readFileSync('../assets/model.json', 'utf8')).model;

var list=[
"Title","Author","Words","Type","Complete","Setting","Elsa","Anna","Powers","Sisters","Rated","Smut","Added","Published","Detail","AO3","FF","Other"];

// for(var c=0; c<data.length; c++){

function stringCheck (str) {return str?str:'';}

function check (input , type){
	if (typeof input == 'number'){
		for(var c=0; c<model.length; c++){
			if(model[c].title == type){
				if(model[c].enum){
					return model[c].enum[input];
				}
				break;
			}
		}
	}

	return stringCheck(input);
}

result = '###Guidelines for adding stories to the database\n\n* If the details are **unknown** please **leave that column empty** so someone else can fill it.\n* If the some details are consider **spoiler** please **leave that column empty**.\n* Certain column **must be fill with one of the listed options**, otherwise it will not be display be the site.\n\n';
for(var c=0; c<list.length; c++){
	result += list[c];
	if(c!=list.length-1){
		result += '|'
	}
}
result += '\n';
for(var c=0; c<list.length; c++){
	result += '-';
	if(c!=list.length-1){
		result += '|'
	}
}
result += '\n';

var maxRow = 0;
for(var c=0;c<model.length;c++){
	if(model[c].enum){
		maxRow = Math.max(maxRow, model[c].enum.length);
	}
}

function getModelOfTitle(title){
	for(var c=0;c<model.length;c++){
		if(model[c].title == title){
			return model[c];
		}
	}
	console.log('can not find model with title : ' + title );
	return null;
}

console.log(maxRow);
for(var c=0;c<maxRow;c++){
	for(var c2=0;c2<list.length;c2++){
		var cModel = getModelOfTitle(list[c2]);
		if(cModel && cModel.enum){
			result+=c<cModel.enum.length?cModel.enum[c]:'';
		}
		else if(c==0){
			result+='insert anything';
		}
		if(c2!=list.length-1){
			result+='|';
		}
	}
	result += '\n ';
}

fs.writeFile("guide.txt", result, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});