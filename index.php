<?php
define('ROOT', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);

//process form
render_tpl((function() {
	$tpl_data = [
		'filtered_url'	=>	'',
		'shortened_url'	=>	'',
		'error'			=>	'',
	];
	// check that our form is submitted
	if ( ! empty($_POST['form_name']) AND $_POST['form_name'] == 'url_shortener') {
		//validate url
		$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);
		$url OR $url = '';

		$tpl_data['filtered_url'] = $url;
		if (empty($url)) {
			$tpl_data['error'] = 'Invalid url';
			return $tpl_data;
		}
		// generate short url
		$affix = random_string();
		$tpl_data['shortened_url'] = 'http://'.($_SERVER['HTTP_HOST'] ?? $_SERVER['HTTPs_HOST'] ?? '' ).'/'.$affix;
	}
	return $tpl_data;
})());
/*
echo "<pre>\n";
echo print_r($_SERVER,TRUE);
echo print_r($_POST,TRUE);
echo "</pre>\n";
*/
function render_tpl(array $data = [], string $template = 'tpl/index.php') {
	$ajax_header = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? NULL;
	if ($ajax_header == 'XMLHttpRequest') {
		header('Content-type: application/json');
		echo json_encode($data);
		exit();
	}
	extract($data);
	include "tpl/index.php";
	
}

function random_string($length = 5) {

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

	// Make sure alnum strings contain at least one letter and one digit
	if ($length > 1)
	{
		if (ctype_alpha($str))
		{
			// Add a random digit
			$str[mt_rand(0, $length - 1)] = chr(mt_rand(48, 57));
		}
		elseif (ctype_digit($str))
		{
			// Add a random letter
			$str[mt_rand(0, $length - 1)] = chr(mt_rand(65, 90));
		}
	}

	return $str;
}	