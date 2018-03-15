/*!
 * 
 */
(function(window,document,undefined){
	"use strict";
	
	var ajax,
		form,
		callbacks;
	
	callbacks = {};
	callbacks.submit = function(event) {
		event.preventDefault();
		var form = this;
		//console.log(this,event);
		ajax.post(
			form.action,
			{
				url: form.url.value,
				form_name: 'url_shortener'
			},
			callbacks.shortener
		);
		return false;
	};
	callbacks.shortener = function(data) {
		data = JSON.parse(data);
		console.log(data);
		if (data) {
			for (var i in data) {
				var holder = document.querySelector('[data-holder="'+i+'"]');
				if (holder.value !== undefined) {
					holder.value = data[i];
				}
				else {
					holder.innerHTML = data[i];
				}
			}
		}
	};
	
	/**
	 * Ajax request helper
	 * Modified from source: http://stackoverflow.com/a/18078705/772086
	 */
	
	ajax = {};
	ajax.x = function () {
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		var versions = [
			"MSXML2.XmlHttp.6.0",
			"MSXML2.XmlHttp.5.0",
			"MSXML2.XmlHttp.4.0",
			"MSXML2.XmlHttp.3.0",
			"MSXML2.XmlHttp.2.0",
			"Microsoft.XmlHttp"
		];

		var xhr;
		for (var i = 0; i < versions.length; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			} catch (e) {
			}
		}
		return xhr;
	};

	ajax.send = function (url, callback, method, data, async) {
		if (async === undefined) {
			async = true;
		}
		var x = ajax.x();
		x.open(method, url, async);
		x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		x.onreadystatechange = function () {
			if (x.readyState == 4) {
				callback(x.responseText);
			}
		};
		if (method == 'POST') {
			x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		x.send(data);
	};

	ajax.get = function (url, data, callback, async) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
	};

	ajax.post = function (url, data, callback, async) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		ajax.send(url, callback, 'POST', query.join('&'), async);
	};
	
	if (form = document.getElementById('url_shortener')) {
		form.onsubmit = callbacks.submit;
	}
	
})(window,document);
