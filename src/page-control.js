import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

let pages = {
    current:getScrollTop()/window.innerHeight,
    moving:false,
    anchors:[
        document.getElementById("intro-page"),    
        document.getElementById("about-page"),
        document.getElementById("work-page")
    ],
    scrollPage:(num=pages.current)=>{
        pages.current = num;
        // console.log(num);
        window.scroll({
            behavior: "smooth",
            top: getElementOffset(pages.anchors[num]).top,
            left: 0
        });

        pages.moving=true;
        clearTimeout(pages.timeout);
        pages.timeout=setTimeout(()=>{
            pages.moving=false;
        },500);
    },
    scrollNext:()=>{
        if(pages.current != pages.anchors.length-1&&!pages.moving){
            pages.current++;
            pages.scrollPage();
        }
    },
    scrollPrev:()=>{
        if(pages.current != 0&&!pages.moving){
            pages.current--;
            pages.scrollPage();
        }
    },
    timeout:null
};

document.getElementById("logo").addEventListener("click",(e)=>{
    e.preventDefault();
    pages.scrollPage(0);
});

document.getElementById("nav_about").addEventListener("click",(e)=>{
    e.preventDefault();
    pages.scrollPage(1);
});

document.getElementById("nav_work").addEventListener("click",(e)=>{
    e.preventDefault();
    pages.scrollPage(2);
});

window.addEventListener("scroll",()=>{
    // console.log('scroll');
});

window.addEventListener('wheel', function(e) {
    if (e.deltaY < 0) {
      pages.scrollPrev();
    }
    if (e.deltaY > 0) {
      pages.scrollNext();
    }
});

window.addEventListener("resize", function () {
    window.scrollTo(0,getElementOffset(pages.anchors[pages.current]).top);
});

function getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
    };
}

function getScrollTop(){
    return window.pageYOffset || document.documentElement.scrollTop
}