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

var DATA_OBJ,INDEX_OBJ,TABLE_ID;

var TABLE_ELEMENTS = [];
var NORMALIZED_DATA_OBJ = [];
var TABLE_ORDER = [];

var SORT_SETTING = [];

function loadIndexObj(InputObj){
	INDEX_OBJ = InputObj;
	loadTableData();
}
function loadDataObj(InputObj){
	DATA_OBJ = InputObj;
	loadTableData();
}
function loadTabelID(InputString){
	TABLE_ID = InputString;
}

function loadTableData(){
	if(INDEX_OBJ && DATA_OBJ){
		for(var c=0; c<DATA_OBJ.length; c++){
			TABLE_ORDER[c] = c;

			TABLE_ELEMENTS[c] = '';
			var objc = DATA_OBJ[c];
			function getStoryData(index){
				var prefix='',postfix='';
				if(index in INDEX_OBJ.prefix)
					prefix = INDEX_OBJ.prefix[index];
				if(index in INDEX_OBJ.postfix)
					postfix = INDEX_OBJ.postfix[index];
				if(index in objc){
					if(index in INDEX_OBJ.enum){
						if(typeof INDEX_OBJ.enum[index][objc[index]] == 'undefined')
							return 'error';
						return prefix+INDEX_OBJ.enum[index][objc[index]]+postfix;
					}
					return prefix+objc[index]+postfix;
				}
				return 'n/a';
			}
			TABLE_ELEMENTS[c] += '<tr><td>{0}</td><td>'.format(
					getStoryData('Title')
				);
			if('Detail' in objc){
				TABLE_ELEMENTS[c]+= '<div class="hshow"><div>i</div><div class="textBlock">{0}</div></div>'.format(getStoryData('Detail'));
			}
			if('FF' in objc){
				TABLE_ELEMENTS[c]+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">F</a></div><div>FanFiction.net</div></div>'.format(getStoryData('FF'));
			}
			if('AO3' in objc){
				TABLE_ELEMENTS[c]+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">A</a></div><div>ArchiveOfOurOwn.org</div></div>'.format(getStoryData('AO3'));
			}
			if('Other' in objc){
				TABLE_ELEMENTS[c]+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">O</a></div><div>Other</div></div>'.format(getStoryData('Other'));
			}
			TABLE_ELEMENTS[c] += '</td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><td>{10}</td><td>{11}</td><td>{12}</td></tr>'.format(
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

			
			NORMALIZED_DATA_OBJ[c] = {};
			for(var key in DATA_OBJ[c]){
				NORMALIZED_DATA_OBJ[c][key] = normalize(DATA_OBJ[c][key], key);
			}
		}
	}
}

function updateTable(TableOrder){
	var result = '';
	for(var c=0;c<TableOrder.length;c++){
		result+=TABLE_ELEMENTS[TableOrder[c]];
		// console.log(TableOrder[c]);
	}
	var content = document.getElementById(TABLE_ID);
	content.innerHTML = result;
}


function sortTableBy(KeyToSort){
	// console.log('sort by',KeyToSort);
	TABLE_ORDER.sort(DATA_OBJCmp(getSortSetting(KeyToSort)));
	// console.log(TABLE_ORDER);
	updateTable(TABLE_ORDER);
}

function getSortSetting(toSort){
	if(SORT_SETTING[SORT_SETTING.length-1] && SORT_SETTING[SORT_SETTING.length-1].key == toSort)
		SORT_SETTING[SORT_SETTING.length-1].revert = !SORT_SETTING[SORT_SETTING.length-1].revert;
	else{
		for(var c=SORT_SETTING.length-2;c>=0;c--){
			if(SORT_SETTING[c].key == toSort){
				SORT_SETTING = SORT_SETTING.slice(0,c).concat(SORT_SETTING.slice(c+1,SORT_SETTING.length));
			}
		}
		SORT_SETTING.push({key:toSort,revert:false});
	}
	return SORT_SETTING;
}

function normalize(x, key){ 
	//console.log(key in INDEX_OBJ.dataType, INDEX_OBJ.dataType[key]);
	if(key in INDEX_OBJ.dataType && INDEX_OBJ.dataType[key] == 'date'){
		//console.log('date');
		var temp = x.split('/');
		return parseInt(temp[0]) + parseInt(temp[1])*31 + parseInt(temp[2])*372;
	}
	return typeof x=='string'?x.toLowerCase():x;
}

function DATA_OBJCmp(sortSetting){
	return function(a,b){
		if(typeof NORMALIZED_DATA_OBJ[a][sortSetting[sortSetting.length-1].key] == 'undefined')
			return 1;
		if(typeof NORMALIZED_DATA_OBJ[b][sortSetting[sortSetting.length-1].key] == 'undefined')
			return -1;
		for(var c=sortSetting.length-1;c>=0;c--){
			if(NORMALIZED_DATA_OBJ[a][sortSetting[c].key] < NORMALIZED_DATA_OBJ[b][sortSetting[c].key])
				return sortSetting[c].revert?  1 : -1;
			if(NORMALIZED_DATA_OBJ[a][sortSetting[c].key] > NORMALIZED_DATA_OBJ[b][sortSetting[c].key])
				return sortSetting[c].revert? -1 :  1;
		}
		console.log('Auto Database Check: detected a duplicate of the story',a['Title']);
		return 0;
	}
}