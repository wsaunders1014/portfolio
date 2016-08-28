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

    $("#fname input").on("blur", function(){
        validateName();
    });

    $("#email input").on("blur", function(){
        validateEmail($(this));
    });
    $('#message textarea').on('blur', function(){
        validateText($(this));
    });
    $("#contact-form input").on("focus", function(){
        if($(this).hasClass("form-error")){
            $(this).removeClass("form-error");
        }
    });
     $("#contact-form textarea").on("focus", function(){
        if($(this).hasClass("form-error")){
            $(this).removeClass("form-error");
        }
    });
    $('#message textarea').focus(function(){
        enableSendButton();
    });
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
        $('input[type=submit').attr('disabled',true)
		var formData = {
            'fname'      :  $('input[name=fname]').val(),
            'email'      :  $('input[name=email]').val(),
            'message'    :  $('textarea[name=message]').val()
        };
        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'php/form-process.php', // the url where we want to POST
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
                $('input').not('input[type=submit]').val('');
                $('textarea').val('')
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
    var entry = capitalize($.trim($("#fname input").val()));
    if(entry == ""){
        $("#fname input").addClass("form-error");
        $("#fname input").val("");
        $("#fname input").attr("placeholder", "Please Enter Your First Name");
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
        console.log()
        thisField.val("");
        thisField.addClass("form-error");
        thisField.attr("placeholder", "Message required.");
    }else {
        $("#message input").removeClass("form-error");
        message = entry;
    }
    enableSendButton();
}
function enableSendButton(){
    if(fname && email && message){
        $(".submit").removeClass('disabled').addClass("active").removeAttr('disabled');
    }else{
        $(".submit").addClass('disabled').removeClass("active").attr('disabled',true);
    }
}
//////////////// UTILITY FUNCTIONS ////////////////
// Returns a string with a Capital first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Returns true if it follows a valid e-mail format
function emailRegex(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}