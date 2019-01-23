import Matter from 'matter-js';

export default function () {
    let boxes = [];
    let titleElement = document.getElementById("intro-text");
    let canvas = document.getElementById("box");

    let prevWidth = window.innerWidth;
    let prevTitleSize = { width: titleElement.offsetWidth, height: titleElement.offsetHeight };

    // module aliases
    let Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    // create an engine
    let engine = Engine.create();


    // create a renderer
    let render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            // width: window.innerWidth,
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            pixelRatio: 1,
            background: 'transparent',
            wireframes: false,
            // showPositions: true
        }
    });

    let walloption={
        isStatic:true,
        render: {
            visible: false
        }        
    }

    let bottomWall = Bodies.rectangle(canvas.offsetWidth * 0.5, canvas.offsetHeight + 250, canvas.offsetWidth, 500, walloption);
    let leftWall = Bodies.rectangle(-250, canvas.offsetHeight * 0.5, 500, 5000, walloption);
    let rightWall = Bodies.rectangle(canvas.offsetWidth + 250, canvas.offsetHeight * 0.5, 500, 5000, walloption);
    // let leftWall = Bodies.rectangle(-250, canvas.offsetHeight * 0.5, 500, canvas.offsetHeight, walloption);
    // let rightWall = Bodies.rectangle(canvas.offsetWidth + 250, canvas.offsetHeight * 0.5, 500, canvas.offsetHeight, walloption);

    boxes.push(rightWall);
    boxes.push(leftWall);
    boxes.push(bottomWall);


    let minusPadding = titleElement.offsetHeight * 0.3;
    let titleBox = Bodies.rectangle(getCenterOffset(titleElement).left, getCenterOffset(titleElement).top, titleElement.offsetWidth, titleElement.offsetHeight - minusPadding, {
        isStatic: true,
        render: {
            fillStyle: 'transparent'
        }
    });

    boxes.push(titleBox);

    function pickColor(){
        let colors=[
            "#d64541",
            // "#8e44ad",
            "#4183d7",
            "#36d7b7",
            "#fef160",
        ]
        let randomColor = Math.floor(Math.random()*colors.length);
        return  colors[randomColor];
    }

    for (let i = 0; i < 30; i++) {
        boxes.push(generateBody());
    }

    World.add(engine.world, boxes);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);


    function generateBody() {
        let a = Math.floor(Math.random() * (canvas.offsetWidth-50));
        let b = Math.floor(Math.random() * -500)-100;
        let c = Math.floor(Math.random() * 50 + 50);
        let d = Math.floor(Math.random() * 50 + 50);
        // let c = 80;
        // let d = 80;
        let box = Bodies.rectangle(a, b, c, d, {
            render: {
                // sprite: {
                //     texture: '../img/box.png'
                // }
                // fillStyle:getComputedStyle(titleElement)['color']
                fillStyle:pickColor()
            }
        });
        return box;
    }

    document.getElementById("intro-page").addEventListener("click", function () {
        boxes.forEach(box=>{
            if(box==titleBox){
                return;
            }
            box.render.fillStyle = pickColor();
            Body.applyForce(box, {x: box.position.x, y: box.position.y}, {x: 0, y: -(Math.floor(Math.random()*2)*0.1+0.1)});
        });
    })

    let resizeTimeOut = null;
    let resizeDelay = 50;

    window.addEventListener("resize", function () {
        // 0.05초 이상 빠르게 실행될경우 무시
        if (resizeTimeOut == null) {
            resizeTimeOut = setTimeout(() => {
                clearTimeout(resizeTimeOut);
                resizeTimeOut = null
                resizeCanvas();
            }, resizeDelay);
        }
    });

    function resizeCanvas() {
        // 캔버스위치 다시설정

        render.canvas.width = canvas.offsetWidth;
        render.canvas.height = canvas.offsetHeight;

        // 벽위치 조정
        Body.setPosition(bottomWall, { x: canvas.offsetWidth * 0.5, y: canvas.offsetHeight + 250 });
        Body.setPosition(rightWall, { x: canvas.offsetWidth + 250, y: canvas.offsetHeight * 0.5 });
        Body.setPosition(titleBox, { x: getCenterOffset(titleElement).left, y: getCenterOffset(titleElement).top });


        // 바닥, 텍스트오브젝트 크기조정
        Body.scale(bottomWall, window.innerWidth / prevWidth, 1);
        Body.scale(titleBox, titleElement.offsetWidth / prevTitleSize.width, titleElement.offsetHeight / prevTitleSize.height);

        // 현재크기 저장
        prevWidth = window.innerWidth;
        prevTitleSize.width = titleElement.offsetWidth;
        prevTitleSize.height = titleElement.offsetHeight;
    }
}

function getCenterOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: (rect.top + window.pageYOffset) + (el.offsetHeight * 0.5),
        left: (rect.left + window.pageXOffset) + (el.offsetWidth * 0.5),
    };
}


