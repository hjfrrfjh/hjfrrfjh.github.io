'use strict';
// 만들기 중단 사용하지 않음 TingyGesture.js 사용으로 변경
// import { listeners } from "cluster";

export class InputController{

    static get PAN_UP() {
        return 0;
    }
    static get PAN_UP_END() {
        return 1;
    }
    static get PAN_DOWN() {
        return 2;
    }
    static get PAN_DOWN_END() {
        return 3;
    }


    constructor(){
        this._isDown=false; 
        this._lastMove=0; // 마우스, 터치 이벤트의 수행횟수를 줄여준다.
        this._moveLimit=50; //ms 이벤트 다시 받아오기 위한 최소 시간
        this._listeners = {};
        this._preX=0;
        this._preY=0;
        // this._preMovementX=0;
        // this._preMovementY=0;
        this._listeners[InputController.PAN_UP]=[];
        this._listeners[InputController.PAN_UP_END]=[];
        this._listeners[InputController.PAN_DOWN]=[];
        this._listeners[InputController.PAN_DOWN_END]=[];
  
        document.body.addEventListener("touchend",(event)=>{
            let pageX = event.changedTouches[0].pageX;
            let pageY = event.changedTouches[0].pageY;

            let offsetX = pageX - this._preX;
            let offsetY = pageY - this._preY;


            // console.log(event.pageY);
            if(offsetY>0){
                this._listeners[InputController.PAN_DOWN_END].forEach(func=>{
                    func({offset:offsetY});
                });
            }else if(offsetY<0){
                this._listeners[InputController.PAN_UP_END].forEach(func=>{
                    func({offset:offsetY});
                });
            }

            this._preY=0;
            this._preX=0;
            this._isDown = false;
        })
        
        document.body.addEventListener("touchstart",(event)=>{
            this._preX= event.changedTouches[0].pageX;
            this._preY= event.changedTouches[0].pageY;
            this._isDown = true;
        });

        document.body.addEventListener("touchmove",()=>{
            if(Date.now() - this._lastMove > this._moveLimit) {
                // 
                if(this._listeners['touchmove']){
                    this._listeners['touchmove'].forEach(func => {
                        func();
                    });
                }
                // 
                this._lastMove = Date.now();
            }
        });
        
        document.body.addEventListener("mousemove", (ev)=>{
            if(this._isDown){
                // if(Date.now() - this._lastMove > this._moveLimit) {
                    // 
                        if(ev.movementY>0){
                            this._listeners[InputController.PAN_DOWN].forEach(func => {
                                func({offset:ev.pageY-this._preY});
                            });
                        }else if(ev.movementY<0){
                            this._listeners[InputController.PAN_UP].forEach(func => {
                                func({offset:ev.pageY-this._preY});
                            });
                        }
                    // 
                    console.log(ev.movementY);
                    this._preX= event.pageX;
                    this._preY= event.pageY;
                    // this._lastMove = Date.now();
                // } 
            }
            

        });
        
        document.body.addEventListener("mousedown", (event)=>{
            event.preventDefault();
            this._preY = event.pageY;
            this._preX = event.pageX;
            this._isDown=true;
        });
        
        document.body.addEventListener("mouseup",(event)=>{

            let offsetY = event.pageY - this._preY;
            let offsetX = event.pageX - this._preX;
            console.log(offsetY);
            if(offsetY>0){
                this._listeners[InputController.PAN_DOWN_END].forEach(func=>{
                    func({offset:offsetY});
                });
            }else if(offsetY<0){
                this._listeners[InputController.PAN_UP_END].forEach(func=>{
                    func({offset:offsetY});
                });
            }

            this._preY=0;
            this._preX=0;
            this._isDown=false;
        });
    }
    
    addListener(eventType,callback){
        this._listeners[eventType].push(callback);
    }
}

