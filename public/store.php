<?php
	$text = $_POST['t'];

	$id = preg_replace('/[^a-zA-Z0-9_]/','',$_POST['cd']);

	file_put_contents('recipes/'.$id, $text);
?>