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
		loadDataObj(obj['data']);
		loadIndexObj(obj['index']);
		loadTabelID('table-content');
		sortTableBy('Title');
    }
}
xmlhttp.open("GET","data.json",true);
xmlhttp.send();

$(document).ready(function(){
	$('.sortable').click(function(){
		// console.log('sort',this.innerHTML);
		sortTableBy(this.innerHTML);
		$('.sortable').removeAttr('style');
		$(this).attr('style','background-color: #008fdf;');
	});
});


