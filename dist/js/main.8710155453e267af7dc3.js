!function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);n(0),n(1);var o,a=[{title:"Disney AMPAS FYC 2018",url:"https://disneystudiosawards.com/2018/",img:"disney-ampas-2018",ext:".png",company:"Creative Impact Agency",repo:"https://gitlab.com/wsaunders/disney-ampas-2018",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live"},{title:"Disney Guild FYC 2018",url:"https://dev-waltdisneystudiosawards.wds.io/2018/",img:"disney-2018",ext:".png",company:"Creative Impact Agency",repo:"https://gitlab.com/wsaunders/disney-guild-2018",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live"},{title:"Dreamworks Shorts FYC 2018",url:"https://dwaawards.com",img:"dwa",ext:".png",company:"Creative Impact Agency",repo:"https://github.com/wsaunders1014/dwa",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live"},{title:"Focus Features AMPAS FYC 2018",url:"focus/",img:"focus-ampas-2018",ext:".png",company:"Creative Impact Agency",repo:"https://github.com/wsaunders1014/focus-ampas",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"archive"},{title:"Disney AMPAS FYC 2017",url:"https://dev-waltdisneystudiosawards.wds.io/2017",img:"disney-2017",ext:".png",company:"Creative Impact Agency",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live"},{title:"QuoteRunner",url:"http://quoterunner.com/moving",img:"quoterunner",ext:".png",company:"Equate Media",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live-eq"},{title:"GotMovers",url:"https://gotmovers.com/MOVERS_RATES",img:"gotmovers",ext:".png",company:"Equate Media",tech:["HTML5","LESS","jQuery","PHP","mySQL","Gulp.js"],source:"live-eq"},{title:"Day of Play",url:"nick/dayofplay/",img:"day-of-play",ext:".png",company:"NWE",tech:["HTML5","LESS","jQuery","PHP","mySQL","GSAP"],source:"wayback"},{title:"24: Live Another Day",url:"24/",img:"24",ext:".png",company:"NWE",tech:["HTML5","LESS","jQuery","GSAP"],source:"wayback"},{title:"Honda Civic eBrochure",url:"rpa/civic/",img:"civic",ext:".png",company:"RPA",tech:["HTML5","LESS","jQuery"],source:"archive"}],i=window.innerWidth;window.innerHeight;window.addEventListener("load",(function(){})),$(document).ready((function(){for(var e=[{name:"HTML5",level:10,message:"Kind of goes without saying..."},{name:"CSS3",level:10,message:"See HTML5"},{name:"JavaScript",level:8,message:"Still learning something new everyday"},{name:"Git",level:5,message:"My commit messages can be pretty entertaining."},{name:"PHP",level:5,message:"An oldie but goldie"},{name:"SASS",level:8,message:"I can't go back to normal CSS"},{name:"React",level:5,message:"A relatively new skill, but one I'm actively working on."},{name:"Webpack",level:5,message:"Setting up a config file is always a good time."},{name:"REST",level:4,message:"As in HTTP verbs, not laying around."},{name:"Sketch",level:5,message:"I don't know why anyone uses Photoshop for web anymore"},{name:"Redux",level:5,message:"Makes React so much easier."},{name:"Gulp.js",level:7,message:"Used it before switching to Webpack."},{name:"mySQL",level:6,message:"I pronounce it 'My Sequel' but I don't know if it's correct."},{name:"Photoshop",level:8,message:"I know my way around a layer comp."},{name:"jQuery",level:9,message:"Good ol' spaghetti code."},{name:"Node.js",level:3,message:"Mostly with Express to create some very simple API's."}],t=0;t<e.length;t++)$("#skills").find("ul").eq(0).append("<li><span>".concat(e[t].name,'</span><span class="level"><span class="number" data-number=').concat(e[t].level,"></span></span></li>"));for(var n,r=function(t){setTimeout((function(){var n,o;n=$(".number").eq(t),o=e[t].level,n.css({width:o+"0%"})}),100*t)},s=0;s<e.length;s++)r(s);for(var c=0;c<a.length;c++)$("#portfolio").append('\n      <article class="item '.concat(a[c].source,'" id="').concat(a[c].title.toLowerCase().split(" ").join("_"),'">\n        <a href="').concat(a[c].url,'" target="_blank">\n          <picture class="loading" data-src="img/').concat(a[c].img,'.webp">\n            <source srcset="img/').concat(a[c].img,'.webp" type="image/webp"/>\n            <img src="img/').concat(a[c].img+a[c].ext,'" alt="Project: ').concat(a[c].title,'"/>\n          </picture>\n        </a>\n        <div class="info">\n          Project: <a href="').concat(a[c].url,'" target="_blank">').concat(a[c].title,"</a><br/>\n          Company: ").concat(a[c].company,"<br/>\n        ").concat(a[c].repo?"<a href="+a[c].repo+">View Git Repo</a>":"","\n        </div>\n      </article>"));if(!1 in window&&!1 in window&&!1 in window.IntersectionObserverEntry.prototype)alert("not supported");else{o=new IntersectionObserver((function(e,t){console.log(e),e.forEach((function(e){e.intersectionRatio>.4&&($(e.target).css({transform:"translate(0,0)",opacity:1}),t.unobserve(e.target))}))}),{rootMargin:"0% 0% -10%",threshold:[0,.4]});var l=document.querySelectorAll(".item"),u=!0,p=!1,m=void 0;try{for(var d,g=l[Symbol.iterator]();!(u=(d=g.next()).done);u=!0){var y=d.value;o.observe(y)}}catch(e){p=!0,m=e}finally{try{u||null==g.return||g.return()}finally{if(p)throw m}}$("h1 > span").each((function(){o.observe(this)})),o.observe($("#social")[0]),$(".question").each((function(){o.observe(this)})),o.observe($("#photo")[0]),o.observe($(".bio")[0]),o.observe($(".bio")[1]),$("#skills ul li").each((function(){o.observe(this)}))}$(".pic-swap").hover((function(){n=$("#photo").attr("src");var e=$(this).attr("data-src");$("#photo").attr("src",e)}),(function(){$("#photo").attr("src",n)})),$("#skills ul li > span:first-child").on("mouseenter",(function(t){if(i>600){var n=$(t.currentTarget).parent().index();t.pageX>i/2?$("body").append('<div style="top:'.concat(t.pageY-30,"px;right:").concat(t.pageX+10,'px" class="interaction">').concat(e[n].message,"</div>")):$("body").append('<div style="top:'.concat(t.pageY-30,"px;left:").concat(t.pageX+10,'px" class="interaction">').concat(e[n].message,"</div>"))}})).on("mousemove",(function(e){e.pageX>i/2?$(".interaction").css({top:e.pageY-30,right:i-e.pageX+10}):$(".interaction").css({top:e.pageY-30,left:e.pageX+10})})).on("mouseleave",(function(){$(".interaction").remove()})),$(".loading").each((function(){var e,t=this,n=new Image;n.src=$(this).attr("data-src"),(e=n,new Promise((function(t){return e.onload=t}))).then((function(){$(t).removeClass("loading")}))})),$(".live-eq").on("click",(function(){alert("Warning: This is a live lead generation website, so do not enter your actual information in or you will get emailed and/or called. A lot.")})),$(".wayback").click((function(){return alert("Notice: This site was rebuilt from the Wayback archive so some images may be missing and some functionality might not work as expected.")})),$(window).resize((function(){i=window.innerWidth,window.innerHeight}))}))}]);