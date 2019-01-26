'use strict';
import TinyGesture from './TinyGesture.js';
import {requestAnimation, easeInOut} from '../requestAnim.js';


class ScrollMover{
    constructor(){
        this.startPosition=0;
        this.targetPosition=0;
        this.moveDistance=0;
        this.moving = false;
        this.requestAnimation = requestAnimation();
    }

    move({targetElement,endCallback=()=>{},force=false}){

        if(force){
            this.requestAnimation.stop();
            this.moving=false;
        }

        if(this.moving) return;
        this.moving=true;
        this.startPosition = getScrollTop();
        this.targetPosition = getElementOffset(targetElement).top;
        this.moveDistance = this.targetPosition - getScrollTop();

        this.requestAnimation.animate({
            timing:easeInOut,
            draw:(progress)=>{
                window.scrollTo(0,this.startPosition+(Math.abs(progress)*this.moveDistance));
                
                if(progress==1){
                    // console.log("complete!");
                    this.startPosition = 0;
                    this.targetPosition = 0;
                    this.moveDistance = 0;
                    this.moving=false;
                    endCallback();
                }
            },
            duration:500
        });
    }

    isMoving(){
        return this.moving;
    }
}

// 파라미터1 - 목표가될 DOM엘리먼트의 콜렉션
export class ScrollPage {
    constructor(pages = document.getElementsByClassName("scroll-page")) {

        this.current = Math.round(getScrollTop() / window.innerHeight); //스크롤바의 위치를 통해 현재 위치값 계산
        this.anchors = pages;
        this.pageChangeLisnter = [];

        this.scrollMover = new ScrollMover();
        const gesture = new TinyGesture(document.body);

        // 터치 or 클릭시 화면 움직이는 효과
        gesture.on('panmove',(event)=>{
            if(this.scrollMover.isMoving()) return;
            let offset = gesture.velocityY*-1;
            let anchor = this.getCurrentAnchor();

            if(offset>0){
                if(!this.isBottom(anchor)){
                    if(event.type==="mousemove"){
                        anchor.scrollBy(0,offset);
                    }
                    return;
                }
            }else if(offset<0){
                if(!this.isTop(anchor)){
                    if(event.type==="mousemove"){
                        anchor.scrollBy(0,offset);
                    }
                    return;
                }
            }

            window.scrollBy(0,offset);
        });

        //터치 or 드래그 드롭시 페이지 이동
        gesture.on('panend', () => {
            let anchor = this.getCurrentAnchor();
            if(gesture.touchMoveY==null) return; //위아래 이동 없으면 무시
            if(!this.isTop(anchor)&&!this.isBottom(anchor)) return; //위쪽이나 바닥이 아니면 무시
            
            if(Math.abs(gesture.touchMoveY)>=100){ //100이하의 움직임은 페이지를 이동하지 않도록
                if(gesture.touchMoveY>0){
                    this.scrollPrev(); //이전페이지
                }else{
                    this.scrollNext(); //다음페이지 
                }
            }else{
                this.scrollPage(); //원래 자리로 이동
            };

        });

        // 사이즈 조절될때 자동으로 스크롤
        window.addEventListener("resize", () => {
            window.scrollTo(0, getElementOffset(this.anchors[this.current]).top);
        });

        //마우스 휠 이벤트 연결
        window.addEventListener('wheel', e => {
            let anchor = this.getCurrentAnchor();
            if (e.deltaY < 0) { //휠 업 
                if (!this.isTop(anchor)) { //스크롤이 맨위에 있을때 휠업 무시, 스크롤이 이동
                    return;
                }
                this.scrollPrev();
            }

            if (e.deltaY > 0) { //휠 다운      
                if (!this.isBottom(anchor)) { //스크롤이 맨 아래에 있지 않으면
                    return;
                }
                this.scrollNext();
            }
        });
    }

    // 리스너 추가
    addScrollChangeListener(func){
        this.pageChangeLisnter.push(func);
    }

    // 스크롤이 맨위에있는지
    isTop(elm) {
        return Math.abs(elm.scrollTop)<2;
    }

    // 스크롤이 맨아래에 있는지
    isBottom(elm) {
        return Math.abs(elm.scrollHeight - (elm.scrollTop + elm.offsetHeight))<2;
    }

    //특정페이지, 또는 현재 페이지로 이동
    scrollPage(num = this.current,options) {
        options = Object.assign({},{moveTop:false,silent:false,force:false},options);

        // 현재위치와 목표위치가 같을경우 수행하지 않음
        if(getElementOffset(this.anchors[num])==getScrollTop()){
            return;
        }

        // 페이지 변경 없을경우 제자리로 
        if(this.current==num){
            this.scrollMover.move({
                targetElement:this.getCurrentAnchor(),
                force:options.force
            });
            return;
        }

        this.current = num;
        let anchor = this.getCurrentAnchor();

        if(options.moveTop){
            // 서브페이지의 스크롤을 최상단으로
            anchor.scrollTop=0;
        }

        // 스크롤이동
        this.scrollMover.move({
            targetElement:anchor,
            endCallback:()=>{
                this.pageChangeLisnter.forEach(listener=>{
                    listener({index:this.current, type:"scroll-end"}); //이벤트 콜백 호출 
                });
            },
            force:options.force
        });

        if(!options.silent){
            this.pageChangeLisnter.forEach(listener=>{
                listener({index:this.current, type:"scroll-start"}); //이벤트 콜백 호출
            });
        }


    }

    scrollNext() {
        if (this.current != this.anchors.length - 1 && !this.scrollMover.isMoving()) {
            this.scrollPage(this.current + 1);
        }
    }

    scrollPrev() {
        if (this.current != 0 && !this.scrollMover.isMoving()) {
            this.scrollPage(this.current - 1);
        }
    }

    // 현재 페이지 리턴
    getCurrentAnchor() {
        return this.anchors[this.current];
    }
}

// 현재 스크롤의 위치
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

//DOM위치,크기
function getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        height: rect.height,
        width: rect.width
    };
}