import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

let pages = {
    current: getScrollTop() / window.innerHeight,
    moving: false,
    anchors: [
        document.getElementById("intro-page"),
        document.getElementById("about-page"),
        document.getElementById("portfolio-page")
    ],

    getCurrentAnchor: () => {
        return pages.anchors[pages.current];
    },

    scrollPage: (num = pages.current) => {
        pages.current = num;
        // console.log(num);
        window.scroll({
            behavior: "smooth",
            top: getElementOffset(pages.anchors[num]).top,
            left: 0
        });

        pages.moving = true;
        clearTimeout(pages.timeout);
        pages.timeout = setTimeout(() => {
            pages.moving = false;
        }, 500);
    },
    scrollNext: () => {
        if (pages.current != pages.anchors.length - 1 && !pages.moving) {
            pages.current++;
            pages.scrollPage();
        }
    },
    scrollPrev: () => {
        if (pages.current != 0 && !pages.moving) {
            pages.current--;
            pages.scrollPage();
        }
    },
    timeout: null
};

document.getElementById("logo").addEventListener("click", (e) => {
    e.preventDefault();
    pages.scrollPage(0);
});

document.getElementById("nav_about").addEventListener("click", (e) => {
    e.preventDefault();
    pages.scrollPage(1);
});

document.getElementById("nav_portfolio").addEventListener("click", (e) => {
    e.preventDefault();
    pages.scrollPage(2);
});

window.addEventListener("scroll", () => {
    // console.log('scroll');
});

window.addEventListener('wheel', function (e) {
    let anchor = pages.getCurrentAnchor();

    if (e.deltaY < 0) { //휠 업 
        if (anchor.scrollHeight > window.innerHeight) {// 창의 크기보다 내용이 클때(스크롤바가 있으면)
            if (anchor.scrollTop == 0) { //스크롤이 맨위에 있을때
                pages.scrollPrev();
            }
        }else{
            pages.scrollPrev();
        }

    }

    if (e.deltaY > 0) { //휠 다운      
        
        if (anchor.scrollHeight > window.innerHeight) {
            if (anchor.scrollHeight == anchor.scrollTop + anchor.offsetHeight) { //스크롤이 맨 아레에 있을때
                pages.scrollNext();
            }
        }else{
            pages.scrollNext();
        }
    }
});

window.addEventListener("resize", function () {
    window.scrollTo(0, getElementOffset(pages.anchors[pages.current]).top);
});

function getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        height: rect.height,
        width: rect.width
    };
}

function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop
}