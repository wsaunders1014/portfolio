// FORM PROCESSING
var fname;
var email;
var message;
    $('#message-link').click(function(e){
        e.preventDefault();
        $('#contact').children('.slide-out').children('.info').addClass('form-open');
        //$('#contact-form').show();
    });
    $('.close').click(function(){
        $('.form-open').removeClass('form-open');
    });

    $("#fname").on("blur", function(){
        validateName();
    });

    $("#email").on("blur", function(){
        validateEmail($(this));
    });
    $('#message').on('blur', function(){
        validateText($(this));
    });
    $("#contact-form input").on("focus", function(){
        if($(this).hasClass("form-error")){
            $(this).removeClass("form-error");
        }
    });
    $('input')
	// $('input').not('.submit').change(function(){
	// 	if($(this).val()==''){
	// 		$(this).addClass('error');
	// 		if (errors <3){
	// 			errors++;
	// 		}
	// 	}else {
	// 		$(this).removeClass('error');
	// 		errors--;
	// 	}
	// 	if(errors == 0){
	// 		$('.submit').removeAttr('disabled');
	// 	}
	// });
	// $('textarea').change(function(){
	// 	if($(this).val()==''){
	// 		$(this).addClass('error');
	// 		if (errors <3){
	// 			errors++;
	// 		}
	// 	}else {
	// 		$(this).removeClass('error');
	// 		errors--;
	// 	}
	// 	if(errors == 0){
	// 		$('.submit').removeAttr('disabled');
	// 		errors--;
	// 	}
	// });
	$('form').submit(function(event) {
		var formData = {
            'fname'      :  $('input[name=fname]').val(),
            'email'      :  $('input[name=email]').val(),
            'message'    :  $('textarea[name=message]').val()
        };
        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'form-process.php', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        }).done(function(data) {
            console.log(data); 
             if (!data.success) {
             	$('.form-errors').show();
             	 if (data.errors.fname) {
             	 	$('input[name=fname]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.fname+'</div');
             	 }
             	 if (data.errors.email) {
             	 	$('input[name=email]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.email+'</div');
             	 }
             	 if (data.errors.message) {
             	 	$('textarea[name=message]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.message+'</div');
             	 }
             }else {
             	$('.thank-you').show();
             	$('.form-open').removeClass('form-open');
             	window.setTimeout(function(){
             		$('.thank-you').hide();
             	},2500);
            }
        });
         event.preventDefault();
	});
// Make sure name field is valid
function validateName(){    
    var entry = capitalize($.trim($("#fname").val()));
    if(entry == ""){
        $("#fname").addClass("form-error");
        $("#fname").val("");
        $("#fname").attr("placeholder", "Please Enter Your First Name");
        fname = "";
    }else{
        $("#fname").removeClass("form-error");
       fname = entry;
    }

    enableSendButton();
}

// Make sure e-mail field is valid
function validateEmail(thisField){
    var entry = $.trim(thisField.val());
    // If empty field
    if(entry == ""){
        thisField.val("");
        thisField.addClass("form-error");
        thisField.attr("placeholder", "Please Enter Your Email");
    }
    var valid = emailRegex(entry);
    
    // If invalid email
    if(!valid){
        thisField.addClass("form-error");
        email = ''
    }else{
        thisField.removeClass("form-error");
        email = entry;
    }

    enableSendButton();
}
function validateText(thisField){
    var entry = $.trim(thisField.val());
    if(entry == ''){
        thisField.val("");
        thisField.addClass("form-error");
        thisField.attr("placeholder", "Message required.");
    }else {
        $("#message").removeClass("form-error");
        message = entry;
    }
    enableSendButton();
}
function enableSendButton(){
    if(fname && email && message){
        $(".submit").removeClass('disabled').addClass("active").removeAttr('disabled');
    }else{
        $(".submit").addClass('disabled').removeClass("active").addAttr('disabled');
    }
}