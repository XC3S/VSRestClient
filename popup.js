var authtoken = {
	isset: false,
	token: ""
};

var headerCount = 2;

setInterval(function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {

			if(response && response != ""){
				authtoken.isset = true;
				authtoken.token = response;
			}
			else{
				authtoken.isset = false;
			}
			document.getElementById("cb-sync").checked = authtoken.isset;
		});
	});
},500);

function send(e) {
	var url = document.getElementById("url").value;
	var method = document.querySelector('input[name="method"]:checked').value;
	var headers = [];

	for (var i = 1; i <= headerCount; i++) {
		if (document.getElementById("header-key-" + i).value != "") {
			headers[document.getElementById("header-key-" + i).value] = document.getElementById("header-value-" + i).value;
		}		
	};

	/*
	if (document.getElementById("header-key-1").value != "") {
		headers[document.getElementById("header-key-1").value] = document.getElementById("header-value-1").value;
	}
	if (document.getElementById("header-key-2").value != "") {
		headers[document.getElementById("header-key-2").value] = document.getElementById("header-value-2").value;
	}
	if (document.getElementById("header-key-3").value != "") {
		headers[document.getElementById("header-key-3").value] = document.getElementById("header-value-3").value;
	}
	*/

	if (document.getElementById("cb-inject").checked){
		headers['authentication-token'] = authtoken.token;	
	}

	var injectHeader="";

	for (var key in headers){
	    if (typeof headers[key] !== 'function') {
	   		injectHeader += "xmlhttp.setRequestHeader('" + key + "','" + headers[key] + "');";
	    }
	}

	var preParse = null;

	if (document.getElementById("requestBody").value) {
		preParse = "var reqBody = eval(" + document.getElementById("requestBody").value + ");";
		chrome.tabs.executeScript(null,{code: preParse});
	}
	else {
		chrome.tabs.executeScript(null,{code: 'var reqBody = ""'});
	}

	var injectBody="";

	if (preParse) {
		injectBody = "reqBody";
	};

	chrome.tabs.executeScript(null,{code:"var xmlhttp = new XMLHttpRequest();xmlhttp.open('" + method + "','" + url + "',true);" + injectHeader + "xmlhttp.send(JSON.stringify(" + injectBody + "));"});
}


function addHeader(e){
	headerCount++;

	var newKey = document.createElement("input"); 
	newKey.setAttribute("type","text");
	newKey.setAttribute("id","header-key-" + headerCount);
	newKey.setAttribute("class","w100");
	newKey.setAttribute("tabindex",headerCount * 100);

	var newValue = document.createElement("input"); 
	newValue.setAttribute("type","text");
	newValue.setAttribute("id","header-value-" + headerCount);
	newValue.setAttribute("class","w100");
	newValue.setAttribute("tabindex",headerCount * 100 + 10);

	document.querySelectorAll(".header-keys")[0].insertBefore(newKey,null);
	document.querySelectorAll(".header-values")[0].insertBefore(newValue,null);
}

document.addEventListener('DOMContentLoaded', function () {
	var divs = document.querySelectorAll('#send');
	for (var i = 0; i < divs.length; i++) {
		divs[i].addEventListener('click', send);
	}
});

document.addEventListener('DOMContentLoaded', function () {
	var divs = document.querySelectorAll('#addHeader');
	for (var i = 0; i < divs.length; i++) {
		divs[i].addEventListener('click', addHeader);
	}
});
