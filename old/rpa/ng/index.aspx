<!DOCTYPE html>
<head>
<script src="js/jquery-1.10.2.min.js" type="text/javascript"></script>
<script type="text/javascript">
	$(document).ready(function(){
				var screenH = window.innerHeight || document.documentElement.clientHeight
|| document.body.clientHeight;;
		var screenW = window.innerWidth || document.documentElement.clientWidth
|| document.body.clientWidth;;
		var iframeW = $("#iframe").width();
		var iframeH = $("#iframe").height();
	
		var adjustWidth = screenH / .75;
		if(screenH > screenW){
			$('#iframe').attr('width',screenW);
			$('#iframe').attr('height',screenW*.75);
		} else if(screenH < screenW){
			$('#iframe').attr('width',screenH/.75);
			$('#iframe').attr('height',screenH);
		} else {
			$('#iframe').attr('width',screenW);
			$('#iframe').attr('height',screenW*.75);
		}

		$(window).resize(function(){
					screenH = window.innerHeight || document.documentElement.clientHeight
|| document.body.clientHeight;;
		 screenW = window.innerWidth || document.documentElement.clientWidth
|| document.body.clientWidth;;
			var iframeW = $("#iframe").width();
			var iframeH = $("#iframe").height();
			//$('#iframe').attr('height',screenH);
			var adjustWidth = screenH / .75;
			if(screenH > screenW){
				$('#iframe').attr('width',screenW);
				$('#iframe').attr('height',screenW*.75);
			} else if(screenH < screenW){
				$('#iframe').attr('width',screenH/.75);
				$('#iframe').attr('height',screenH);
			} else {
				$('#iframe').attr('width',screenW);
				$('#iframe').attr('height',screenW*.75);
			}

		});
	});
</script>
<style type="text/css">

body {
margin:0;
padding:0;
background:#666;
overflow:hidden;
}
iframe {
	overflow:hidden;
	display:block;
	margin:0 auto;
	z-index:1;
}
.width100 {
	width:100%;
}
.height100 {
	height:100%;
}
#page-arrows{
	position:absolute;
	left:0%;
	top:0%;
	width:10%;
}
</style>
</head>

<%
    Dim pg As Integer
    Dim pgs(8) As String
    
    If Not Request.QueryString("pg") Is Nothing Then
        pg = Request.QueryString("pg")
    Else
        pg = 0
    End If

    pgs(0) = "p1_cover.html"
    pgs(1) = "p2_intro.html"
    pgs(2) = "p3_features.html"
    pgs(3) = "p4_spin.html"
    pgs(4) = "p5_tech.html"
    pgs(5) = "p6_specs.html"
    pgs(6) = "p7_tools.html"
	pgs(7) = "p8_legal.html"
   
%>

<body>
<div id="page-arrows"><a href="?pg=<%=pg-1 %>"> << </a>     <a href="?pg=<%=pg+1 %>"> >> </a></div>
	
	<iframe id="iframe" src="<% = pgs(pg) %>" allowtransparency="true" seamless frameborder="0" scrolling="no"></iframe>
</body>
</html>