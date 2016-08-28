// FORM PROCESSING
    $('#message-link').click(function(e){
        e.preventDefault();
        $('#contact').children('.slide-out').children('.info').addClass('form-open');
        //$('#contact-form').show();
    });
    $('.close').click(function(){
        $('.form-open').removeClass('form-open');
    });
	var errors = 3;
	$('input').not('.submit').blur(function(){
		if($(this).val()==''){
			$(this).addClass('error');
			if (errors <3){
				errors++;
			}
		}else {
			$(this).removeClass('error');
			errors--;
		}
		if(errors == 0){
			$('.submit').removeAttr('disabled');
		}
	});
	$('textarea').blur(function(){
		if($(this).val()==''){
			$(this).addClass('error');
			if (errors <3){
				errors++;
			}
		}else {
			$(this).removeClass('error');
			errors--;
		}
		if(errors == 0){
			$('.submit').removeAttr('disabled');
			errors--;
		}
	});
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
