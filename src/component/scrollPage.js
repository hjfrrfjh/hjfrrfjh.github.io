'use strict';
import TinyGesture from './TinyGesture.js';
import {animate, easeOut} from '../requestAnim.js';



export class ScrollPage {
    constructor(pages = document.getElementsByClassName("scroll-page"), func = () => { }) {
        this.current = this.getCurrentByScroll();
        this.anchors = pages;
        this.moving = false;
        this.timeout = null;
        this.pageChangeLisnter = [];
        this.func = func;

        this.targetPosition=0;
        this.startPosition=0;
        this.moveDistnace=0;

        this.panmoveDistance;

        const gesture = new TinyGesture(document.body);

        // 터치 or 클릭시 화면 움직이는 효과
        gesture.on('panmove',(event)=>{
            if(this.moving) return;
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
            
            if(Math.abs(gesture.touchMoveY)>=100){
                if(gesture.touchMoveY>0){
                    this.scrollPrev(); //이전페이지
                }else{
                    this.scrollNext(); //다음페이지 
                }
            }else{
                this.scrollPage(); //원래 자리로 이동
            };

            // if()

            // console.log(gesture.touchMoveY);
            // if(gesture.touchMoveY>100){
            //     if(!this.isTop(anchor)) return;
            //     this.scrollPrev();
            // }else if(gesture.touchMoveY<-100){
            //     if(!this.isBottom(anchor)) return;
            //     this.scrollNext();
            // }else{

            //     this.scrollPage();
            // }
        });



        // window.addEventListener("scroll",(event)=>{
        //     if(!this.moving) return;

        //     if(this.targetPosition==this.getScrollTop()){
        //         this.moving=false;
        //         this.pageChangeLisnter.forEach(listener=>{
        //             listener({index:this.current, type:"scroll-end"});
        //         });
        //     }
        // });

        // 사이즈 조절될때 자동으로 스크롤
        window.addEventListener("resize", () => {
            window.scrollTo(0, this.getElementOffset(this.anchors[this.current]).top);
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

    // 스크롤위치를 통해 현재페이지 확인
    getCurrentByScroll() {
        return Math.round(this.getScrollTop() / window.innerHeight);
    }

    //특정페이지, 또는 현재 페이지로 이동
    scrollPage(num = this.current,options) {
        console.log('scroll');
        options = Object.assign({},{moveTop:false,silent:false},options);
        
        if(this.current==num){
            this.restorePage();
            return;
        }

        this.current = num;
        this.startPosition = this.getScrollTop();
        this.targetPosition = this.getElementOffset(this.anchors[num]).top;
        this.moveDistance = this.targetPosition - this.getScrollTop();
        


        if(options.moveTop){
            // console.log(this.getCurrentAnchor());
            this.getCurrentAnchor().scrollTop=0;
        }

        // 페이지 스크롤
        

        animate({
            timing:(time)=>{
                return easeOut(time,3);
            },
            draw:(progress)=>{
                window.scrollTo(0,this.startPosition+(progress*this.moveDistance));
                // console.log(this.startPosition + "::" + progress + "::" + this.moveDistance+"::"+(this.startPosition+(progress*this.moveDistance)));
                // console.log(this.startPosition+(progress*this.moveDistance));
                if(progress==1){
                    this.moving=false;
                    this.pageChangeLisnter.forEach(listener=>{
                        listener({index:this.current, type:"scroll-end"});
                    });
                }
            },
            duration:800
        });

        if(!options.silent){
            this.pageChangeLisnter.forEach(listener=>{
                listener({index:this.current, type:"scroll-start"});
            });
        }

        this.moving = true;
        
        this.getCurrentAnchor().focus();
    }

    restorePage(){
        window.scroll({
            behavior: "smooth",
            top: this.getElementOffset(this.anchors[this.current]).top,
            left: 0
        });
    }

    scrollNext() {
        if (this.current != this.anchors.length - 1 && !this.moving) {
            this.scrollPage(this.current + 1);
            return true;
        }
        return false;
    }



    scrollPrev() {
        if (this.current != 0 && !this.moving) {
            this.scrollPage(this.current - 1);
            return true;
        }
        return false;
    }


    //엘리먼트 위치, 크기 반환 
    getElementOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            height: rect.height,
            width: rect.width
        };
    }

    // 현재 스크롤의 위치 리턴
    getScrollTop() {
        // return window.pageYOffset || document.documentElement.scrollTop
        return (document.documentElement && document.documentElement.scrollTop) || 
              document.body.scrollTop;
    }

    // 현재 페이지 리턴
    getCurrentAnchor() {
        return this.anchors[this.current];
    }
}