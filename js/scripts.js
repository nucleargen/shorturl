(function(window,document,undefined){
	"use strict";
	
	// predeclare needed variables
	var ajax,
		form,
		callbacks;
	
	callbacks = {
	
		// set up form submit callback
		submit: function(event) {

			// prevent default event action
			event.preventDefault();

			// move from `this`
			var form = this;

			// do ajax request and pass result to callback
			ajax.post(
				form.action,
				{
					url: form.url.value,
					form_name: form.form_name.value
				},
				callbacks.render_result
			);

			return false;
		},
		
		// set up request result rendering callback
		render_result: function(data) {
			
			try {
				// use standart modern browser JSON parser
				data = JSON.parse(data);
				if (data) {
					
					// render all request data to appropriate html elements
					for (var i in data) {
						
						var holder = document.querySelector('[data-holder="'+i+'"]');
						
						// check element to have `value` property (input, button, etc)
						if (holder.value !== undefined) {
							holder.value = data[i];
							
							// if we render resulting url - it is good to select generated url for best user experience
							// do not use hacks with selecting text, simply click appropriate label if any
							if (i == 'shortened_url') {
								var label;
								holder.id && (label = document.querySelector('label[for="'+holder.id+'"]')) && label.click();
							}
						}
						else {
							// place data 
							holder.innerHTML = data[i];
						}
					}
				}
			}
			catch (error) {
				var error_holder = document.querySelector('span[data-holder="error"]');
				error_holder.innerHTML = 'Some error occured, try later';
				
			}
		}
	};
	
	
	ajax = {
		// Ajax request Object getter
		xhr: function () {
			
			// for any modern browser
			if (typeof XMLHttpRequest !== 'undefined') {
				return new XMLHttpRequest();
			}
			
			//for MS Explorers
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
		},

		
		send: function (url, callback, method, data,) {
			var xhr = ajax.xhr();
			
			// assume that request must be asynchronous
			xhr.open(method, url, true);
			
			// set ajax header to separate from non-js form submits
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					callback(xhr.responseText);
				}
			};
			if (method == 'POST') {
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}
			xhr.send(data);
		},

		post: function (url, data, callback) {
			
			// form request body
			var query = [];
			for (var key in data) {
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
			
			ajax.send(url, callback, 'POST', query.join('&'));
		}
	};
	
	// check url shortener form existance and bind onsubmit callback
	if (form = document.getElementById('url_shortener')) {
		form.onsubmit = callbacks.submit;
	}
	
})(window,document);
