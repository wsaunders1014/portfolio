import '../sass/common.scss';
import '../sass/main.scss';
import '../sass/mobile.scss';
import {projects} from './projects.js';
//console.log(projects)
//const projectsObj = projects;
var screenW = window.innerWidth, screenH = window.innerHeight;
$(document).ready(function(){


  // let zoomSensitivity = 400;
  // let zoomLevel = 1;
  // let dragSensitivity =5;
  // let topBound = screenH*.4;
  // let leftBound = screenW*.4;;
  // let bottomBound = screenH -screenH*.4;
  // let rightBound = screenW - screenW*.4;
  // var navigatingX = false, navigatingY = false;
  // var intervalX = false,intervalY = false;
  const skills = [
    'HTML5','CSS3','JavaScript<br/><span>(ECMA2017+)</span>','Git',
    'PHP','SASS/LESS','React','Webpack',
    'REST','Sketch','Redux','Gulp',
    'mySQL','Photoshop','jQuery','Node.js'
  ]
  console.log(skills.length)
  for(let i=0;i<projects.length;i++){
    $('#portfolio').append(`
      <article class="item" id="${projects[i].title.toLowerCase().split(' ').join('_')}">
        <a href="${projects[i].url}" target="_blank">
          <img class="loading" src="img/loading.gif" data-src="img/${projects[i].img}" alt="Project: ${projects[i].title}"/>
        </a>
        <div class="info">
          Project: <a href="${projects[i].url}" target="_blank">${projects[i].title}</a><br/>
          Company: ${projects[i].company}
        ${(projects[i].repo) ? projects[i].repo:""}
        </div>
      </article>`);
  //  $('#content > .portfolio').append(`<div class="item" style="width:${randomNumInRange(200,500)}px;height:${randomNumInRange(200,400)}px;left:${randomNumInRange(-1000,4000)}px;top:${randomNumInRange(-1000,4000)}px;transform:translateZ(-${randomNumInRange(500,2500)}px)"></div>`)
  }
  for(let i=0;i<skills.length;i++){
    $('#skills').find('ul').eq(0).append(`<li>${skills[i]}</li>`)
  }
  $('img').each(function(){
    let newImg = new Image();
    newImg.src = $(this).attr('data-src');
    imageLoadPromise(newImg).then(()=>{
        $(this).attr('src',$(this).attr('data-src'));
        $(this).removeClass('loading')
    })


  })
  function imageLoadPromise(img){
    return new Promise(resolve=>img.onload = resolve)
  }
  $('#quoterunner, #gotmovers').on('click',()=>{
    alert('Warning: This is a live website, so do not enter your actual information in or you will get emailed and/or called. A lot.')
  } )
  /*$('.portfolio').on('mousedown', function(e){
    e.preventDefault();

    let endGoal = 1000;
    //RIGHT MOUSE BUTTON IS CLICKED
    if(e.which ===3){
      navigating = true;
      var active = false;
      var currentX;
      var currentY;
      var initialX;
      var initialY;
      var xOffset = e.target.getBoundingClientRect().left;
      var yOffset = e.target.getBoundingClientRect().top;
    //  let shiftX = e.clientX - egg.getBoundingClientRect().left;
    //  let shiftY = ev.clientY - egg.getBoundingClientRect().top;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      console.log('initial', initialX,initialY)
      $(this).on('mousemove',function(e){

        $('.portfolio').on('mouseup',function(e){
          initialX = currentX - xOffset;
          initialY = currentY - yOffset;
          $('.portfolio').off('mousemove');
        })
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset =  e.target.getBoundingClientRect().left;
        yOffset =  e.target.getBoundingClientRect().top;
        TweenLite.set($('.item'),{x:`+=${currentX/100}`,y:`+=${currentY/100}`})
      })
      //RETURN FALSE TO BLOCK CONTEXT MENU
      return false;
    }
  }) */

/*$('.portfolio').on('mousedown', function(e){
    if(e.which===3){
      $('.portfolio').on('mousemove',(e)=> {handlePan(e.pageX,e.pageY)});
      return false;
    }
  }).on('mouseup',function(){
    $(this).off('mousemove');
    navigatingX = false;
    navigatingY = false;
    clearInterval(intervalX);
    clearInterval(intervalY);
  })

  $(document).mouseleave(function(){
    clearInterval(intervalX);
    clearInterval(intervalY);
    navigatingX = false,navigatingY = false;
  });*/
  function handlePan(mouseX,mouseY){
    if(mouseX < leftBound && navigatingX !== true){
      navigatingX=true;
      panX('right');
    }else if(mouseX >= leftBound && mouseX <= rightBound && navigatingX === true){
      navigatingX = false;
      clearInterval(intervalX);
      intervalX = false;
      console.log(intervalX);
    }else if(mouseX > rightBound && navigatingX===false){
      console.log('test')
      navigatingX = true;
      panX('left')
    }

    if(mouseY < topBound && navigatingY !== true){
      navigatingY=true;
      panY('down');
    }else if(mouseY >= topBound && mouseY <= bottomBound && navigatingY === true){
      navigatingY = false;
      clearInterval(intervalY);
      intervalY = false;

    }else if(mouseY > bottomBound && navigatingY===false){

      navigatingY = true;
      panY('up')
    }
  }
  function panX(direction){
    if(navigatingX){
      if(direction === "left")
        intervalX = setInterval(()=>{TweenLite.set($('.item'),{x:`-=${dragSensitivity}px`})},10);
      else if(direction === 'right')
        intervalX = setInterval(()=>{TweenLite.set($('.item'),{x:`+=${dragSensitivity}px`})},10);
    }
  }
  function panY(direction){
    if(navigatingY){
      if(direction === "up")
        intervalY = setInterval(()=>{TweenLite.set($('.item'),{y:'-=5px'})},10);
      else if(direction === 'down')
        intervalY = setInterval(()=>{TweenLite.set($('.item'),{y:'+=5px'})},10);
    }
  }
  /*$('body').on('contextmenu',function(e){
    e.preventDefault();
    return false;
  })*/
/*  $('#content').find('.portfolio').on('wheel',function(e){
    let delta = e.originalEvent.wheelDelta;
    console.log(e.originalEvent);
    if(delta > 0){
      zoomLevel -=1;
      TweenLite.to($('.item'),0.5,{z:`+=${zoomSensitivity}px`})
    }else{
      zoomLevel +=1;
      TweenLite.to($('.item'),0.5,{z:`-=${zoomSensitivity}px`})
    }
    console.log(zoomLevel)
  })*/
})
const randomNumInRange = (min,max) => Math.floor(Math.random() * (max - min + 1)) + min;
