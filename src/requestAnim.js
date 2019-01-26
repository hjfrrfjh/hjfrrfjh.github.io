window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();


window.cancelAnimFrame = (function (requestId) {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (callback) {window.clearTimeout(requestId) };
})();


export function animate({ timing, draw, duration }) {
    let start = performance.now();
    let prevProgress=0;
    requestAnimFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        
        // calculate the current animation state
        let calculated = Math.abs(timing(timeFraction));
        let progress = calculated;
        

        if(progress > prevProgress) draw(progress); // draw it
        
        prevProgress = progress;

        if (timeFraction < 1) {
            requestAnimFrame(animate);
        }

    });
}

export function cancel(requestId){
    cancelAnimFrame(requestId);
}

export function linear(timeFraction){
    return timeFraction;
}

//ease-out 설정
export function easeOut(timeFraction, num=2){
    return 1 - Math.pow(1-timeFraction, num);
}

