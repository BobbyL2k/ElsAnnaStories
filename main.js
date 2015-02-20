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

var DataObj,IndexObj;

var xmlhttp;
if (window.XMLHttpRequest){
    xmlhttp=new XMLHttpRequest();
}
else {
	console.log('error: not supported XMLHttpRequest');
}
xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
		var obj = JSON.parse(xmlhttp.responseText);
		DataObj = obj['data'];
		IndexObj = obj['index'];
        loadTableData(DataObj);
    }
}
xmlhttp.open("GET","data.json",true);
xmlhttp.send();

function loadTableData(JsonData){
	var result = "";
	for(var c=0; c<JsonData.length; c++){
		var objc = JsonData[c];
		function getStoryData(index){
			var prefix='',postfix='';
			if(index in IndexObj.prefix)
				prefix = IndexObj.prefix[index];
			if(index in IndexObj.postfix)
				postfix = IndexObj.postfix[index];
			if(index in objc){
				if(index in IndexObj.enum){
					if(typeof IndexObj.enum[index][objc[index]] == 'undefined')
						return 'error';
					return prefix+IndexObj.enum[index][objc[index]]+postfix;
				}
				return prefix+objc[index]+postfix;
			}
			return 'n/a';
		}
		result += '<tr><td>{0}</td><td>'.format(
				getStoryData('Title')
			);
		if('Detail' in objc){
			result+= '<div class="hshow"><div>i</div><div class="textBlock">{0}</div></div>'.format(getStoryData('Detail'));
		}
		if('FF' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">F</a></div><div>FanFiction.net</div></div>'.format(getStoryData('FF'));
		}
		if('AO3' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">A</a></div><div>ArchiveOfOurOwn.org</div></div>'.format(getStoryData('AO3'));
		}
		if('Other' in objc){
			result+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">O</a></div><div>Other</div></div>'.format(getStoryData('Other'));
		}
		result += '</td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td><td>{11}</td><td>{12}</td></tr>'.format(
				getStoryData('Author'),
				getStoryData('Words'),
				getStoryData('Type'),
				getStoryData('Complete'),
				getStoryData('Setting'),
				getStoryData('Elsa'),
				getStoryData('Anna'),
				getStoryData('Powers'),
				getStoryData('Sisters'),
				getStoryData('Rated'),
				getStoryData('Smut'),
				getStoryData('Added'),
				getStoryData('Published')
			);
	}
	var content = document.getElementById('table-content');
	content.innerHTML = result;
}

SortSetting = [{key:'Title',revert:false}];
function getSortSetting(toSort){
	if(SortSetting[SortSetting.length-1].key == toSort)
		SortSetting[SortSetting.length-1].revert = !SortSetting[SortSetting.length-1].revert;
	else{
		for(var c=SortSetting.length-2;c>=0;c--){
			if(SortSetting[c].key == toSort){
				SortSetting = SortSetting.slice(0,c).concat(SortSetting.slice(c+1,SortSetting.length));
			}
		}
		SortSetting.push({key:toSort,revert:false});
	}
	return SortSetting;
}

function DataObjCmp(SortSetting){
	return function(a,b){
		if(typeof a[SortSetting[SortSetting.length-1].key] == 'undefined')
			return 1;
		if(typeof b[SortSetting[SortSetting.length-1].key] == 'undefined')
			return -1;
		function normalize(x){ return typeof x=='string'?x.toLowerCase():x; }
		for(var c=SortSetting.length-1;c>=0;c--){
			if(normalize(a[SortSetting[c].key]) < normalize(b[SortSetting[c].key]))
				return SortSetting[c].revert?  1 : -1;
			if(normalize(a[SortSetting[c].key]) > normalize(b[SortSetting[c].key]))
				return SortSetting[c].revert? -1 :  1;
		}
		console.log('Auto Database Check: detected a duplicate of the story',a['Title']);
		return 0;
	}
}

$(document).ready(function(){
	$('.sortable').click(function(){
		// console.log('sort',this.innerHTML);
		loadTableData(DataObj.sort(DataObjCmp(getSortSetting(this.innerHTML))));
		$('.sortable').removeAttr('style');
		$(this).attr('style','background-color: #008fdf;');
	});
});


