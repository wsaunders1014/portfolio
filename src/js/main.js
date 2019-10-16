//import '../sass/common.scss';
import '../sass/main.scss';
import '../sass/mobile.scss';
import {projects} from './projects.js';
var intObs
var screenW = window.innerWidth, screenH = window.innerHeight;
window.addEventListener('load', function(){
  intObs = new IntersectionObserver((entries,obs) =>{

    entries.forEach((entry)=>{
      //console.log(entry)
        if(entry.intersectionRatio > 0.4){
          $(entry.target).css({transform:'translateX(0)',opacity:1})
            obs.unobserve(entry.target);
        }

    })
  },{rootMargin:"-10% 55%",threshold:[0,0.4]});
  let elements = document.querySelectorAll('.item');
  for(let el of elements){
    intObs.observe(el);
  }

})
$(document).ready(function(){
  //Create Skill grid
  const skills = [
    {name:'HTML5',level:10,message:'Kind of goes without saying...'},
    {name:'CSS3',level:10,message:'See HTML5'},
    {name:'JavaScript',level:8,message:'Still learning something new everyday'},
    {name:'Git',level:5,message:'My commit messages can be pretty entertaining.'},
    {name:'PHP',level:5,message:'An oldie but goldie'},
    {name:'SASS / LESS',level:8,message:'I can\'t go back to normal CSS'},
    {name:'React',level:5,message:'A relatively new skill, but one I\'m actively working on.'},
    {name:'Webpack',level:5,message:'Setting up a config file is always a good time.'},
    {name:'REST',level:4,message:'As in HTTP verbs, not laying around.'},
    {name:'Sketch',level:5,message:'I don\'t know why anyone uses Photoshop for web anymore'},
    {name:'Redux',level:5,message:'Makes React so much easier.'},
    {name:'Gulp.js',level:7,message:'Used it before switching to Webpack.'},
    {name:'mySQL',level:6,message:'I pronounce it \'My Sequel\' but I don\'t know if it\'s correct.'},
    {name:'Photoshop',level:8,message:'I know my way around a layer comp.'},
    {name:'jQuery',level:9,message:'Good ol\' spaghetti code.'},
    {name:'Node.js',level:3,message:"Mostly with Express to create some very simple API's."}
  ];
  const skillLevel = [10,10,8,]
  for(let i=0;i<skills.length;i++){
    $('#skills').find('ul').eq(0).append(`<li><span>${skills[i].name}</span><span class="level"><span class="number" data-number=${skills[i].level}></span></span></li>`);

  }
  const animateBar = ($bar,level) =>{
    $bar.css({width:level+'0%'})
  }

  //Animate skill bar\


  for(let i=0;i<skills.length;i++){
    setTimeout(()=>{animateBar($('.number').eq(i),skills[i].level)},100*i);
  }



  //Loads each project from json as an article. Saves me from doing it all manually.
  for(let i=0;i<projects.length;i++){
    $('#portfolio').append(`
      <article class="item ${projects[i].source}" id="${projects[i].title.toLowerCase().split(' ').join('_')}">
        <a href="${projects[i].url}" target="_blank">
          <picture class="loading" data-src="img/${projects[i].img}.webp">
            <source srcset="img/${projects[i].img}.webp" type="image/webp"/>
            <img src="img/${projects[i].img+projects[i].ext}" alt="Project: ${projects[i].title}"/>
          </picture>
        </a>
        <div class="info">
          Project: <a href="${projects[i].url}" target="_blank">${projects[i].title}</a><br/>
          Company: ${projects[i].company}<br/>
        ${(projects[i].repo) ? "<a href="+projects[i].repo+">View Git Repo</a>":""}
        </div>
      </article>`);
  }



  /// Swap pic out on keyword
  var oldSrc;
  $('.pic-swap').hover(function(){
    oldSrc = $('#photo').attr('src')
    let newSrc = $(this).attr('data-src');
    $('#photo').attr('src',newSrc);
  },function(){
    $('#photo').attr('src',oldSrc)
  })
  //Skill Messages
  $('#skills ul li span').on('mouseenter',(e)=>{
    let index = $(e.currentTarget).parent().index();
  //  $('body').append(`<div style="top:${e.pageY-30}px;left:${e.pageX+10}px" class="interaction">${skills[index].message}</div>`);
  }).on('mousemove',(e)=>{
    $('.interaction').css({top:e.pageY-30,left:e.pageX+10})
  }).on('mouseleave',()=>{
    $('.interaction').remove();
  });
  //Swaps out loading gif for actual image based on data-src attr.
  $('.loading').each(function(){
    let newImg = new Image();
    newImg.src = $(this).attr('data-src');
    imageLoadPromise(newImg).then(()=>{
    //       $(this).attr('src',$(this).attr('data-src'));
    //       $(this).removeClass('loading')
    //  $(this).find('source').eq(0).remove();
      $(this).removeClass('loading')
    // if( $(this).attr('data-src')){
    })

    //   newImg.src = $(this).attr('data-src');
    //
    //}
  })
  function imageLoadPromise(img){
    return new Promise(resolve=>img.onload = resolve)
  }
  //Notify user of website issues
  $('.live-eq').on('click',()=>{
    alert('Warning: This is a live lead generation website, so do not enter your actual information in or you will get emailed and/or called. A lot.')
  })
  $('.wayback').click(()=> alert('Notice: This site was rebuilt from the Wayback archive so some images may be missing and some functionality might not work as expected.'))

})
