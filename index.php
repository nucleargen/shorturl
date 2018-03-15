<?php
//define useful paths
define('ROOT', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
define('SHORTS_PATH',ROOT.'u'.DIRECTORY_SEPARATOR);

//check uri to be shortened url
$uri = explode("/", $_SERVER['REQUEST_URI'] ?? '')[1];
if ($uri AND file_exists(SHORTS_PATH.$uri.'.php')) {
	
	//if uri exists - redirect to desired location
	header("HTTP/1.1 301 Moved Permanently");
	header("Location: ". file_get_contents(SHORTS_PATH.$uri.'.php'));
}

/**
 * Process form and render response
 */
render_tpl(
	// Run anonymous function to generate template vars
	(function() {
	
		// placeholder array
		$tpl_data = [
			'filtered_url'	=>	'',
			'shortened_url'	=>	'',
			'error'			=>	'',
		];
		
		// check that form is submitted and it is exactly our form
		if (
			! empty($_POST['form_name']) AND 
			$_POST['form_name'] == 'url_shortener'
		) {
			
			//validate url format
			$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);
			$url OR $url = '';

			$tpl_data['filtered_url'] = $url;
			
			// if filtered url is empty - we don't provide short url
			if (empty($url)) {
				$tpl_data['error'] = 'Invalid url';
				return $tpl_data;
			}
			
			// generate short url string while it not exists already
			
			//generated string length
			$l = 5;
			// iteration counter
			$counter = 1;
			do {
				// after each 5 tries - lengthen generating string
				$counter % 5 === 0 AND $l++;
				$affix = random_string($l);
				$counter++;
			}
			while (file_exists(SHORTS_PATH.$affix.'.php'));
			
			// write new shortened url
			file_put_contents(SHORTS_PATH.$affix.'.php', $url);
			
			// combine full shortened url
			// (assume that server provide redirect to secure protocol if using ssl)
			$tpl_data['shortened_url'] = 'http://'.(
				$_SERVER['HTTP_HOST'] ?? 
				$_SERVER['HTTPS_HOST'] ?? 
				'' 
			).'/'.$affix;

		}
		
		return $tpl_data;
	})()
);

/**
 * Response rendering
 * @param array $data - array of template variables
 * @param string $template - template file path
 */
function render_tpl(array $data = [], string $template = 'tpl/index.php'):void {
	
	//check request to be ajax 
	if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? NULL) == 'XMLHttpRequest') {
		
		// set content type to json
		header('Content-type: application/json');
		
		// render raw json response
		echo json_encode($data);
		return;
	}
	
	// extract variables for template from passed data array
	extract($data);
	
	// include template to be rendered
	include "tpl/index.php";
	return;
}

/**
 * 
 * Generate random string
 * @param int $length - length of generated string
 * @return string - generated string
 */
function random_string(int $length = 5):string {
	// allowed symbols
	$pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
	// Split the pool into an array of characters
	$pool = str_split($pool, 1);
	
	// Largest pool key
	$max = count($pool) - 1;
	
	$str = '';
	for ($i = 0; $i < $length; $i++)
	{
		// Select a random character from the pool and add it to the string
		$str .= $pool[mt_rand(0, $max)];
	}

	return $str;
}	