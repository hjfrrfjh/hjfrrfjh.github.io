window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 1000 / 60); };
})();


export function animate({ timing, draw, duration }) {
    let start = performance.now();

    requestAnimFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // calculate the current animation state
        let progress = timing(timeFraction)

        draw(progress); // draw it

        if (timeFraction < 1) {
            requestAnimFrame(animate);
        }

    });
}

export function linear(timeFraction){
    return timeFraction;
}

//ease-out 설정
export function easeOut(timeFraction, num=2){
    return 1 - Math.pow(1-timeFraction, num);
}

