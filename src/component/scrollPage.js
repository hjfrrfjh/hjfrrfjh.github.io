
import smoothscroll from 'smoothscroll-polyfill';
import TinyGesture from 'tinygesture';

// import hammer from 'hammerjs';

smoothscroll.polyfill();


export class ScrollPage {
    constructor(pages = document.getElementsByClassName("scroll-page"), func = () => { }) {
        this.current = this.getCurrentByScroll();
        this.anchors = pages;
        this.moving = false;
        this.timeout = null;
        this.func = func;

        const gesture = new TinyGesture(document.body);

        //터치 or 클릭시 화면 움직이는 효과
        gesture.on('panmove',()=>{
            let offset = gesture.velocityY*-1;
            let anchor = this.getCurrentAnchor();

            if(offset>0){
                if(!this.isBottom(anchor)){
                    return;
                }
            }else if(offset<0){
                if(!this.isTop(anchor)){
                    return;
                }
            }

            window.scrollBy(0,offset);
        });

        //터치 or 드래그 드롭시 페이지 이동
        gesture.on('panend', () => {
            let anchor = this.getCurrentAnchor();

            if(gesture.touchMoveY>0){
                if(!this.isTop(anchor)) return;
                this._scrollPrev();
            }else if(gesture.touchMoveY<0){
                if(!this.isBottom(anchor)) return;
                this._scrollNext();
            }
        });

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
                this._scrollPrev();
            }

            if (e.deltaY > 0) { //휠 다운      
                if (!this.isBottom(anchor)) { //스크롤이 맨 아래에 있지 않으면
                    return;
                }
                this._scrollNext();
            }
        });
    }

    // 스크롤이 맨위에있는지
    isTop(elm) {
        return elm.scrollTop == 0
    }

    // 스크롤이 맨아래에 있는지
    isBottom(elm) {
        return elm.scrollHeight == elm.scrollTop + elm.offsetHeight
    }

    // 스크롤위치를 통해 현재페이지 확인
    getCurrentByScroll() {
        return Math.round(this.getScrollTop() / window.innerHeight);
    }

    //특정페이지, 또는 현재 페이지로 이동
    scrollPage(num = this.current) {
        this.current = num;

        // 페이지 스크롤
        window.scroll({
            behavior: "smooth",
            top: this.getElementOffset(this.anchors[num]).top,
            left: 0
        });

        // 이동중인지 확인하는 맴버 업데이트
        this.moving = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.moving = false;
        }, 500);

        this.getCurrentAnchor().focus();
    }

    _scrollPage(num) {
        this.scrollPage(num);
        this.func(this.current);
    }

    scrollNext() {
        if (this.current != this.anchors.length - 1 && !this.moving) {
            this.scrollPage(this.current + 1);
            return true;
        }
        return false;
    }

    _scrollNext() {
        if (this.scrollNext()) {
            this.func(this.current);
        }
    }

    scrollPrev() {
        if (this.current != 0 && !this.moving) {
            this.scrollPage(this.current - 1);
            return true;
        }
        return false;
    }

    _scrollPrev() {
        if (this.scrollPrev()) {
            this.func(this.current);
        }
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
        return window.pageYOffset || document.documentElement.scrollTop
    }

    // 현재 페이지 리턴
    getCurrentAnchor() {
        return this.anchors[this.current];
    }
}