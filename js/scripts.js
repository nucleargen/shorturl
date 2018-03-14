// Modified from source: http://stackoverflow.com/a/18078705/772086

var ajax = {};
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
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};




      var btn = document.getElementById('request');
      var bio = document.getElementById('bio');

      var request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if(request.readyState === 4) {
          bio.style.border = '1px solid #e8e8e8';
          if(request.status === 200) { 
            bio.innerHTML = request.responseText;
          } else {
          	bio.innerHTML = 'An error occurred during your request: ' +  request.status + ' ' + request.statusText;
          } 
        }
      }

      request.open('Get', 'Bio.txt');

      btn.addEventListener('click', function() {
        this.style.display = 'none';
        request.send();
      });


https://www.sitepoint.com/guide-vanilla-ajax-without-jquery/