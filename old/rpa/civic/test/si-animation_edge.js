(
function($,Edge,compId){
var _=null,y=true,n=false,or='-webkit-transform-origin',t='transform',c='color',g='image',r='deg',
e30='${_light-smoke2}',
e29='${_light-smoke}',
e28='${__tire-smoke}',
e27='${_wheels-spin-masked}',
e26='${_skid-large}'
e25='${_car-top}',
e21='${_flare}',
e24='${_big-smoke}',
e23='${_background}',
e19='${_wheels}',
e17='${_Stage}',
e22='${_skid-small}',
qw='swing',dt='Default Timeline',
bg='background-color',a='Base State',qoq='easeOutQuad',oz='-moz-transform-origin',
rz='rotateZ',x1='2.0.1',x2='2.0.0',x3='2.0.1.268',x4='rgba(0,0,0,0)',x15='stage',x16='rgba(255,255,255,1)',x18='hidden',x20='@@0@@% @@1@@%',
p='px',on='msTransformOrigin',lf='left',qoi='easeOutQuint',oo='-o-transform-origin',kx='skewX',o='opacity',
ql='linear',w='width',h='height',om='-ms-transform-origin',tp='top',s='style',ov='overflow',ky='skewY';
var im='images/';
var g14='smoke/light-smoke.png',g11='wheels.png',g10='flare.png',g5='background.jpg',g8='wheels-spin-masked.png',
g7='skid-small.png',g9='car-top.png',g13='smoke/big-smoke.png',g6='skid-large.png',g12='smoke/_tire-smoke.png';
var fonts={};
var P=Edge.P,T=Edge.T,A=Edge.A;
var resources=[];
var symbols={"stage":{v:x1,mv:x2,b:x3,bS:a,iS:a,gpu:n,rI:n,cn:{dom:
[{id:'background',t:g,r:['0%','0','115%','100%','auto','auto'],f:[x4,im+g5,'0px','0px']},
{id:'skid-large',t:g,r:['31.1%','71.9%','71.3%','1.7%','auto','auto'],f:[x4,im+g6,'0px','0px']},
{id:'skid-small',t:g,r:['42.6%','66.2%','59%','1.2%','auto','auto'],f:[x4,im+g7,'0px','0px']},
{id:'wheels-spin-masked',t:g,r:['-18.7%','40.5%','47.1%','43.6%','auto','auto'],f:[x4,im+g8,'0px','0px']},
{id:'car-top',t:g,r:['-18.7%','40.4%','47.1%','43.6%','auto','auto'],f:[x4,im+g9,'0px','0px']},
{id:'flare',t:g,r:['18.6%','-12.4%','47.4%','96.9%','auto','auto'],f:[x4,im+g10,'0px','0px'],tf:[]},
{id:'wheels',t:g,r:['-2.7%','40.5%','47.1%','43.6%','auto','auto'],f:[x4,im+g11,'0px','0px']},
{id:'_tire-smoke',t:g,r:['130.3%','53.5%','15.2%','19.3%','auto','auto'],f:[x4,im+g12,'0px','0px']},
{id:'big-smoke',t:g,r:['27.4%','53.8%','49.7%','30.8%','auto','auto'],f:[x4,im+g13,'0px','0px'],filter:[0,0,1,1,0,0,0,20.050299657534,"rgba(0,0,0,0)",0,0,0]},
{id:'light-smoke',t:g,r:['92.5%','62.2%','25.7%','19.3%','auto','auto'],f:[x4,im+g14,'0px','0px']},
{id:'light-smoke2',t:g,r:['98%','48%','53.8%','40.6%','auto','auto'],f:[x4,im+g14,'0px','0px']}],sI:[]},s:{},
tl:{"Default Timeline":{fS:a,tS:"",d:3000,a:y,tt:[]}}}}; // fromState:baseState,toState:"",duration:3000,autoplay:true, timeline:[] //initializes timeline
var S1=symbols[x15]; //S1 = symbols['stage']
var tl0=S1.tl[dt].tt,st1=S1.s[a]={},A1=A(_,tl0,st1); //t10 = S1.timeline['default timeline'].tt, st1= SQ/
	A1.A(e17).P(bg,x16,c).P(ov,x18).P(h,100,_,_,"%").P(w,100);
	
	A1.A(e19).P(ky,0,t,_,r).P(kx,0,t).P(or,[40,70],_,x20).T(1.856,[40,70]).P(oz,[40,70],_,x20).T(1.856,[40,70]).P(om,[40,70],_,x20).T(1.856,[40,70]).P(on,[40,70],_,x20).T(1.856,[40,70]).P(oo,[40,70],_,x20).T(1.856,[40,70]).P(o,0,_,_,"").T(1.856,1,0.114,qoi).P(lf,97.83,_,_,"%").T(0,-18.69,1.856,qw).T(2,-18.69).P(tp,40.51).T(0,40.51).T(1.856,40.51);//wheels
	
	A1.A(e21).P(tp,-16.78,_,_,"%").T(0,5.79,2,qw).P(o,0.38,_,_,"").T(0,1,1).T(1,0.51,0.75).P(lf,24.31,_,_,"%").T(0,53.5,2).P(rz,10,t,_,r).T(0,0,2);
	//flare
	A1.A(e22).P(tp,66.2,_,_,"%").P(lf,0).T(0,24.13,2,qw).P(o,0,_,_,"").T(0.931,1,0.05);
	
	A1.A(e23).P(lf,-15.96,_,_,"%").T(0,0,2,qw);//bg
	
	A1.A(e24).P(tp,40.51,_,_,"%").T(0.835,45.83,0.253,qw).T(1.088,20.49,1.912,qoq).P(o,0,_,_,"").T(0.835,1,0.704).T(1.539,0,1.461,qw).P(h,52.43,_,_,"%").T(0.835,40.05,0.253).T(1.088,68.75,1.912,qoq).P("filter.blur",20.05,"subproperty",_,p).T(0.835,1,0.704).T(1.539,20,1.461,qw).P(lf,35.16,_,_,"%").T(0.835,40.63,0.253).T(1.088,23.26,1.912,qoq).P(w,84.73).T(0.835,64.76,0.253,qw).T(1.088,100.7,1.912,qoq);
	
	A1.A(e25).P(tp,41.44,_,_,"%").T(1.639,41.2,0.217,qw).T(1.856,41.09,0.087).P(lf,97.83).T(0,-18.69,1.856).T(1.856,-18.78,0.087).P(rz,-1,t,_,r).T(0.814,-1).T(1.613,0,0.118).T(1.731,-1,0.125).T(1.856,0,0.452);//car-top
	
	A1.A(e26).P(tp,71.88,_,_,"%").P(lf,0).T(0,20.13,2,qw).P(o,0,_,_,"").T(0.794,1,0.045);//skid large
	
	A1.A(e27).P(tp,40.51,_,_,"%").P(lf,97.83).T(0,-18.69,1.856,qw);//car wheels masked
	
	A1.A(e28).P(tp,53.47,_,_,"%").P(o,1,_,_,"").T(1.5,0,0.5,qw).P(lf,99.31,_,_,"%").T(0.315,15.87,1.476).P("filter.blur",0,"subproperty",_,p).T(1.5,2,0.5);//tiresmoke
	A1.A(e29).P(tp,62.15,_,_,"%").T(0.372,37.38,1.199,qw).P(o,0,_,_,"").T(0.372,0.43,1.199,_,1).P(rz,0,t,_,r).T(0.444,-19,1.127).P(h,19.33,_,_,"%").T(0.372,38.43,1.199).P("filter.blur",1,"subproperty",_,p).T(0.372,5,1.199).P(lf,100,_,_,"%").T(0.372,39.67,1.199).P(w,25.7).T(0.372,51.13,1.199);
	A1.A(e30).P(tp,58.8,_,_,"%").T(0.5,45.95,0.181,qw).T(0.681,32.99,1.026).P("filter.drop-shadow.blur",1,"subproperty",_,p).T(1.707,1).P(h,40.97,_,_,"%").T(0.5,51.74,1.207).P(o,0.98,_,_,"").T(0.5,0.35,1.207).T(1.707,0,0.071).P(lf,112.24,_,_,"%").T(0.5,74.39,0.181).T(0.681,41.06,1.026).P(w,54.26).T(0.5,68.49,1.207);


Edge.registerCompositionDefn(compId,symbols,fonts,resources);

	$(window).ready(function(){
			$('#menu ul li').click(function(event){
				 index = $(this).index();
				 if (index ==3)
				 window.setTimeout(function(){Edge.launchComposition(compId)},1800);
			});
			
			
		});

})
(jQuery,AdobeEdge,"EDGE-323978359");