import fonts from './css/web_font.scss';
import styles from './css/style.scss';
import Matter from 'matter-js';




// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();

var elm = document.getElementById("box");
var width = elm.offsetWidth;
var height = elm.offsetHeight;

// create a renderer
var render = Render.create({
    element: elm,
    engine: engine,
    options:{
        width:width,
        height:height,
        pixelRatio:1,
        background: '#343434',
        // wireframeBackground: '#343434',
        wireframes: false
    }
});

// create two boxes and a ground


function generateBody(){
    var a = Math.floor(Math.random()*500);
    var b = Math.floor(Math.random()*500);
    var c = Math.floor(Math.random()*100);
    var d = Math.floor(Math.random()*100);
    var box = Bodies.rectangle(a, b, c, d);    
    return box;
}
var aaa = [];


for(var i=0;i<70;i++){

    aaa.push(generateBody());
}


var ground = Bodies.rectangle(0, height, width*2, 120, { isStatic: true });
var text1 = document.getElementById("intro-text");

var textwidth = text1.offsetWidth;
var textheight = text1.offsetHeight;

var textBox = Bodies.rectangle(getOffset(text1).left*1.8,getOffset(text1).top*1.03 , textwidth, textheight,{
     isStatic: true ,
     fillStyle: 'red',
     strokeStyle: 'blue',
}); 


// alert('')
aaa.push(textBox);
aaa.push(ground);
// var boxA = Bodies.rectangle(50, 50, 60, 50);
// var boxB = Bodies.rectangle(200, 60, 50, 60);
// var boxC = Bodies.rectangle(400, 70, 50, 20);
// var boxD = Bodies.rectangle(300, 20, 30, 50);
// var ground = Bodies.rectangle(0, height, width*3, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, aaa);



// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

document.body.addEventListener("click", function(){
    Body.scale(ground, 0.8, 0.8);
})
    

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }