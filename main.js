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

function start(inJSON){

	var DataObj,IndexObj;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
	    if (xmlhttp.readyState==4 && xmlhttp.status==200){
			// var obj = JSON.parse(xmlhttp.responseText);
			// console.log(document.getElementById('googleSpreadSheet').contentWindow.document.body.innerHTML);
			DataObj = inJSON['feed']['entry'];
			IndexObj = JSON.parse(xmlhttp.responseText);
	        loadTableData(DataObj);
	    }
	}
	xmlhttp.open("GET","index.json",true);
	xmlhttp.send();

	function loadTableData(JsonData){
		var result = "";
		for(var c=0; c<JsonData.length; c++){
			var objc = JsonData[c];
			function getStoryData(index){
				indexX = 'gsx$'+index.toLowerCase();
				var prefix='',postfix='';
				if(index in IndexObj['prefix'])
					prefix = IndexObj['prefix'][index];
				if(index in IndexObj['postfix'])
					postfix = IndexObj['postfix'][index];
				if(indexX in objc && objc[indexX]['$t'].length>0){
					if(index in IndexObj['enum']){
						if(typeof IndexObj['enum'][index][objc[indexX]['$t']] == 'undefined')
							return 'error';
						return prefix+IndexObj['enum'][index][objc[indexX]['$t']]+postfix;
					}
					return prefix+objc[indexX]['$t']+postfix;
				}
				return 'n/a';
			}
			result += '<tr><td>{0}</td><td>'.format(
					getStoryData('Title')
				);
			if(objc['gsx$detail']['$t'].length > 0){
				result+= '<div class="hshow"><div>i</div><div class="textBlock">{0}</div></div>'.format(getStoryData('Detail'));
			}
			if(objc['gsx$ff']['$t'].length > 0){
				result+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">F</a></div><div>FanFiction.net</div></div>'.format(getStoryData('FF'));
			}
			if(objc['gsx$ao3']['$t'].length > 0){
				result+= '<div class=\"hshow\"><div><a href=\"{0}\" target="_blank">A</a></div><div>ArchiveOfOurOwn.org</div></div>'.format(getStoryData('AO3'));
			}
			if(objc['gsx$other']['$t'].length > 0){
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

	function DataObjCmp(key,revert){
		return function(a,b){
			function x(x){ return typeof x=='string'?x.toLowerCase():x; }
			if(x(a[key]['$t']) < x(b[key]['$t']))
				return revert?  1 : -1;
			if(x(a[key]['$t']) > x(b[key]['$t']))
				return revert? -1 :  1;
			if(a['gsx$title']['$t'].toLowerCase() < b['gsx$title']['$t'].toLowerCase())
				return -1;
			if(a['gsx$title']['$t'].toLowerCase() > b['gsx$title']['$t'].toLowerCase())
				return  1;
			console.log('Auto Database Check: detected a duplicate of the story',a['gsx$'+'Title']);
			return 0;
		}
	}

	var justSort = 'Title';

	$(document).ready(function(){
		$('.sortable').click(function(){
			// console.log('sort',this.innerHTML);
			var indexX = 'gsx$'+this.innerHTML.toLowerCase();
			loadTableData(DataObj.sort(DataObjCmp(indexX,justSort==this.innerHTML)));
			justSort = justSort==this.innerHTML?'':this.innerHTML;
			$('.sortable').removeAttr('style');
			$(this).attr('style','background-color: #008fdf;');
		});
	});

}