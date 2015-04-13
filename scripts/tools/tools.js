function getJSON (url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    var data = JSON.parse(request.responseText);
	    if(callback)
	    	callback(data);
	  } else {
	    console.log("We reached our target server, but it returned an error");
	  }
	};

	request.onerror = function() {
	  console.log("There was a connection error of some sort");
	};

	request.send();
}

function ifExistString (argument) {
	if(argument) return argument;
	else return '';
}