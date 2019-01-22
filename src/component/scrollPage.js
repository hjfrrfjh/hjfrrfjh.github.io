import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export class ScrollPage{
    constructor(pages=document.getElementsByClassName("scroll-page"),func=()=>{}){
        this.current = this.getScrollTop() / window.innerHeight;
        this.anchors = pages;
        this.moving=false;
        this.timeout=null;
        this.func=func;
        for(let i=0;i<this.anchors.length;i++){
            this.anchors[i].addEventListener("click", (e) => {
                e.preventDefault();
                this.scrollPage(i);
            });
        }

        // 사이즈 조절될때 자동으로 스크롤
        window.addEventListener("resize", function () {
            window.scrollTo(0, this.getElementOffset(this.anchors[this.current]).top);
        }.bind(this));

        //마우스 휠 이벤트 연결
        window.addEventListener('wheel', function (e) {
            let anchor = this.getCurrentAnchor();

            if (e.deltaY < 0) { //휠 업 
                if (anchor.scrollHeight > window.innerHeight) {// 창의 크기보다 내용이 클때(스크롤바가 있으면)
                    if (anchor.scrollTop != 0) { //스크롤이 맨위에 있을때 휠업 무시, 스크롤이 이동
                        return;
                    }
                }
                this.scrollPrev();
            }
        
            if (e.deltaY > 0) { //휠 다운      
                if (anchor.scrollHeight > window.innerHeight) {
                    if (anchor.scrollHeight != anchor.scrollTop + anchor.offsetHeight) { //스크롤이 맨 아래에 있지 않으면
                        return;
                    }
                }
                this.scrollNext();
            }
        }.bind(this));
    }

    //특정페이지, 또는 현재 페이지로 이동
    scrollPage(num=this.current){
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
        
    }
    
    scrollNext(){
        if (this.current != this.anchors.length - 1 && !this.moving) {
            this.scrollPage(this.current+1);
            this.func(this.current);

        }
    }

    scrollPrev(){
        if (this.current != 0 && !this.moving) {
            this.scrollPage(this.current-1);
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