<?php 


function geocode($city){
	$cityclean = str_replace (" ", "+", $city);
  	$fullurl = "https://maps.googleapis.com/maps/api/geocode/json?address=".$cityclean."&sensor=false";
	$string .= file_get_contents($fullurl); // get json content
	$json_a = json_decode($string, true); //json decoder
	$lat =  $json_a['results'][0]['geometry']['location']['lat'];
	$long = $json_a['results'][0]['geometry']['location']['lng'];
	//echo $lat.', '.$long;

	$timezoneAPI = "https://maps.googleapis.com/maps/api/timezone/json?location=".$lat.",".$long."&timestamp=".time().'&key=AIzaSyBqT24TK_-SjzI_k9zwJtN2v0Y7AIZSKEQ';
	$string2 .= file_get_contents($timezoneAPI); // get json content
	$timezone = json_decode($string2, true); //json decoder
	print_r($timezone['timeZoneId']);
}
geocode('Aspen');


?>