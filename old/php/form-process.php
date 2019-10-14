<?php 
	$errors         = array();      // array to hold validation errors
	$data           = array();      // array to pass back data

	// validate the variables ======================================================
    // if any of these variables don't exist, add an error to our $errors array


	 if (empty($_POST['fname']))
        $errors['fname'] = 'Name is required.';

    if (empty($_POST['email']))
        $errors['email'] = 'Email is required.';

    if (empty($_POST['message']))
        $errors['message'] = 'Message is required.';

    
    $from = $_POST['email'];
    $message = "Message from". $from ."\r\n".$_POST['message'];
      

    // return a response ===========================================================

     if ( ! empty($errors)) {

        // if there are items in our errors array, return those errors
        $data['success'] = false;
        $data['errors']  = $errors;

       
    } else {

    	  // if there are no errors process our form, then return a message

        // DO ALL YOUR FORM PROCESSING HERE
        // THIS CAN BE WHATEVER YOU WANT TO DO (LOGIN, SAVE, UPDATE, WHATEVER)

        // show a message of success and provide a true success variable
        $data['success'] = true;
        $data['message'] = 'Success!';
       
        $headers = 'From: will@iamwillsaunders.com' . "\r\n".
    'Reply-To: will@iamwillsaunders.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();


       $email = mail('willsaunders1014@gmail.com','Email from IamWillSaunders.com',$message,$headers);
    }

    // return all our data to an AJAX call
    echo json_encode($data);
?>
