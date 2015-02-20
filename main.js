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

$(document).ready(function(){
	$('.sortable').click(function(){
		// console.log('sort',this.innerHTML);
		loadTableData(DataObj.sort(DataObjCmp(getSortSetting(this.innerHTML))));
		$('.sortable').removeAttr('style');
		$(this).attr('style','background-color: #008fdf;');
	});
});


