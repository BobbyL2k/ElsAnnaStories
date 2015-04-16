var fs = require('fs');
var data = JSON.parse(fs.readFileSync('../assets/data.json', 'utf8')).data;
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

result = '';
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

for(var c=0; c<data.length; c++){
	for(var c2=0; c2<list.length; c2++){
		result += check(  data[c][ list[c2] ]  , list[c2] );
		if(c2!=list.length-1){
			result += '|';
		}
	}
	result += '\n';
}

fs.writeFile("output.txt", result, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});