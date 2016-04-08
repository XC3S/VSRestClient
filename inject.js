
console.log("injected");
/*
var script = document.createElement('script');
script.textContent = "var token = 'default';(function() {var XHR = XMLHttpRequest.prototype;var send = XHR.send;XHR.send = function(postData) {this.addEventListener('load', function() {console.log('success',this.getResponseHeader('authentication-token'));if(this.getResponseHeader('authentication-token')){token = this.getResponseHeader('authentication-token');}});return send.apply(this, arguments);};})();";
(document.head||document.documentElement).appendChild(script);
*/