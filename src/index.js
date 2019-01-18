import fonts from './css/web_font.scss';
import styles from './css/style.scss';
import Matter from 'matter-js';



window.onload = function () {

    var boxes = [];
    var titleElement = document.getElementById("intro-text");
    var canvas = document.getElementById("box");

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    // create an engine
    var engine = Engine.create();


    // create a renderer
    var render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            pixelRatio: 1,
            background: 'transparent',
            wireframes: false,
            // showPositions: true
        }
    });

    var bottomWall = Bodies.rectangle(canvas.offsetWidth*0.5, canvas.offsetHeight+250, canvas.offsetWidth, 500, { isStatic: true });
    var leftWall = Bodies.rectangle(-250, canvas.offsetHeight*0.5, 500, canvas.offsetHeight, { isStatic: true });
    var rightWall = Bodies.rectangle(canvas.offsetWidth+250, canvas.offsetHeight*0.5, 500, canvas.offsetHeight, { isStatic: true });

    boxes.push(rightWall);
    boxes.push(leftWall);
    boxes.push(bottomWall);


    var minusPadding = titleElement.offsetHeight*0.3;
    var titleBox = Bodies.rectangle(getCenterOffset(titleElement).left, getCenterOffset(titleElement).top, titleElement.offsetWidth, titleElement.offsetHeight-minusPadding, {
        isStatic: true,
        render: {
             fillStyle:'transparent'
        }
    });

    boxes.push(titleBox);
    
    
    var pointBox = Bodies.rectangle(100,-100, 50,50, {
        isStatic: true,
        render: {
            fillStyle:'black'
        }
    });
    
    boxes.push(pointBox);

    for (var i = 0; i < 50; i++) {
        boxes.push(generateBody());
    }

    World.add(engine.world, boxes);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    function generateBody() {
        var a = Math.floor(Math.random() * 500);
        var b = Math.floor(Math.random() * -500);
        var c = Math.floor(Math.random() * 50+50);
        var d = Math.floor(Math.random() * 50+50);
        var box = Bodies.rectangle(a, b, c, d,{
            render:{
                
                fillStyle:getComputedStyle(titleElement)['color']
                // fillStyle:'rgb(110,219,155)'
            }
        });
        return box;
    }

    
    document.body.addEventListener("click", function () {
        // Body.scale(bottomWall, 1, 30);
    })

    setTimeout(()=>{
        Body.set(pointBox,"isStatic",false);
    },7000)

    window.addEventListener("resize", function(){
        render.canvas.width=canvas.offsetWidth;
        render.canvas.height=canvas.offsetHeight;

        Body.setPosition(bottomWall,{x:canvas.offsetWidth*0.5, y:canvas.offsetHeight+250});
        Body.setPosition(rightWall,{x:canvas.offsetWidth+250, y:canvas.offsetHeight*0.5});
        Body.setPosition(titleBox,{x:getCenterOffset(titleElement).left, y:getCenterOffset(titleElement).top});
        
    
        var minusPadding = titleElement.offsetHeight*0.3;
        // Body.scale(titleBox,1.1,1.1);


        // canvas.height = window.innerHeight;
    });

}

function getCenterOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: (rect.top + window.pageYOffset)+(el.offsetHeight*0.5),
        left: (rect.left + window.pageXOffset)+(el.offsetWidth*0.5),
    };
}


function getElementOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
    };
}