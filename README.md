# shorturl_test

## System requirements

* PHP 7+

## Installation

* Simply clone repository
```bash
git clone https://github.com/nucleargen/shorturl.git
```

* choose folder, where shortened urls must be stored
defaults is `u/` folder in root folder
if choose another - change it in index.php at line 4:
```
define('SHORTS_PATH',ROOT.'u'.DIRECTORY_SEPARATOR);
```

* configure web-server to proxy any requests to non-existent locations to index.php
i.e. for nginx:
```
location / { 
	try_files $uri $uri/ /index.php?$query_string; 
}
```

* configure web-server to deny all requests to u/ folder if it is left defaults
i.e. for nginx:
```
location ~ ^/u/ { deny all; }
```

## Some notes

* Used readonly input instead span for best user experience. Result in input autoselects after request by programmatically clicking its label.
* Original task text moved from html to task.md file