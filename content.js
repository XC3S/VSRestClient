var script = document.createElement('script');
script.textContent = "(function() {var XHR = XMLHttpRequest.prototype;var send = XHR.send;XHR.send = function(postData) {this.addEventListener('load', function() {if(this.getResponseHeader('authentication-token')){var token = this.getResponseHeader('authentication-token');document.getElementsByTagName('body')[0].setAttribute('token',token);}});return send.apply(this, arguments);};})();";
(document.head||document.documentElement).appendChild(script);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	sendResponse(document.getElementsByTagName('body')[0].getAttribute('token'));
});