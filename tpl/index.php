<?php defined('ROOT') or die(); ?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <link href="./css/styles.css" rel="stylesheet">
    <title>XIAG test task</title>
    <meta name="robots" content="noindex,nofollow">
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0">
</head>
<body cz-shortcut-listen="true">
    <div class="content">
        <header>URL shortener</header>
        <form action="./" method="post" id="url_shortener">
            <table>
                <tbody>
					<tr>
						<th>Long URL</th>
						<th><label for="shortened_url">Short URL</label></th>
					</tr>
					<tr>
						<td>
							<input name="url" type="url" data-holder="filtered_url" value="<?=$filtered_url ?? ''; ?>">
							<input value="Do!" type="submit">
						</td>
						<td id="result">
							<input type="url" readonly="" data-holder="shortened_url" id="shortened_url" value="<?=$shortened_url ?? ''; ?>">
						</td>
					</tr>
					<tr>
						<td colspan="2" class="error">
							<span data-holder="error">
								<?=$error ?? ''; ?>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<input type="hidden" name="form_name" value="url_shortener">
        </form>
    </div>
    <script src="./js/scripts.js"></script>
</body>
</html>