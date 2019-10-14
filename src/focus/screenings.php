<?php 
	error_reporting(-1);
	ini_set('display_errors', 1);

	//date_default_timezone_set( "UTC" );
	// $servername = 'disney.c6lcgtg7snbh.us-east-1.rds.amazonaws.com';
 //    $username = 'wsaunders1014';
 //    $password = 'Warrior1';
 //    $dbname = 'screenings';
	//echo $_SERVER['SERVER_NAME'];
	function get_result( $Statement ) {
	    $RESULT = array();
	    $Statement->store_result();
	    for ( $i = 0; $i < $Statement->num_rows; $i++ ) {
	        $Metadata = $Statement->result_metadata();
	        $PARAMS = array();
	        while ( $Field = $Metadata->fetch_field() ) {
	            $PARAMS[] = &$RESULT[ $i ][ $Field->name ];
	        }
	        call_user_func_array( array( $Statement, 'bind_result' ), $PARAMS );
	        $Statement->fetch();
	    }
	    return $RESULT;
	}
	if ($_SERVER['HTTP_HOST'] != "focusfeaturesawards2018.com") {
	    $servername = 'external-db.s225192.gridserver.com';
	  	$username = 'db225192';
	    $password = 'EmilhavkebIdwy2';
	    $dbname = 'db225192_dev';

	} else {
	    $servername = 'internal-db.s225192.gridserver.com';
	  	$username = 'db225192';
	    $password = 'EmilhavkebIdwy2';
	    $dbname = 'db225192_focus_features';
	}

    $conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}
	//echo time().'<br/><br/>';
	
	//$sql = "SELECT * FROM screenings WHERE movie_id=".$_GET['movie_id']." AND datetime >".time().' AND visible=1 ORDER BY datetime ASC';
	$sql = $conn->prepare("SELECT screenings.*,theaters.city FROM screenings LEFT JOIN theaters ON screenings.theater_id = theaters.id WHERE movie_id = ? AND date_time > CURRENT_TIMESTAMP AND visible=1 ORDER BY theaters.city,screenings.date_time  ASC");
	$sql->bind_param('i',$_GET['movie_id']);
	
	$sql->execute();
	$result = get_result($sql);
	
	
	if (count($result) > 0) {
	    // output data of each row
	  $array = array();
	  while($row= array_shift($result)){
	  	//SELECT theaters.*,cities.city_name,cities.tz_offset FROM theaters LEFT JOIN cities ON theaters.city = cities.id WHERE theaters.id=6
	    	$sqlStmnt = "SELECT theaters.*,cities.city_name,cities.timezone FROM theaters LEFT JOIN cities ON theaters.city = cities.city_id WHERE theaters.id=".$row['theater_id'];
	    	$theaterResult = $conn->query($sqlStmnt);
	    	
	    	if(!$theaterResult){
	    		echo mysqli_error($conn) . "\n";
	    	}
	    	$theater = $theaterResult->fetch_assoc();
	    	
	    	
	    	$rsvpResults = $conn->query("SELECT (COUNT(*) + SUM(`guests`)) AS `total` FROM `attendees` WHERE `screening_id` = '".$row['id']."' GROUP BY `screening_id`");
	    	if(!$rsvpResults){
	    		echo mysqli_error($conn) . "\n";
	    	}
	    	$rsvps = $rsvpResults->fetch_assoc();
	    	
	    	if(empty($rsvps)){
	    		$rsvps = 0;
	    	}else{
	    		$rsvps = $rsvps['total'];
	    	}
	    
	    	//print_r($rsvpResults->total);
	    	
    		 $array[] = array('id'=>$row['id'],'date_time'=>$row['date_time'],'capacity'=>$row['capacity'],'rsvps'=>$rsvps,'affil'=>unserialize(base64_decode($row['guilds'])),'guests'=>$row['guests'],'status'=>$row['status'],'visible'=>$row['visible'],'official'=>$row['official'],'notes'=>$row['additional_notes'],'theater'=>array('id'=>$theater['id'],'name'=>$theater['name'],'address'=>$theater['address'],'address_2'=>$theater['address_2'],'metro'=>$theater['city'],'city'=>$theater['city_name']));

    		// print_r($array);
	    	
	    	//echo $array[$row['id']]['datetime'].'<br/>';
	    	//print_r( unserialize($array[$row['id']]['affil']));
	    }
	
	 echo json_encode($array);

	   
	} else {
	    echo "false";
	}
	//$sql->close();
	$conn->close();
?>
