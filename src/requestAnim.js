
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

export function requestAnimation(){
        let animationId = null;
        let endCallback = null;
        return {
            animate : ({ timing, draw, duration,callback=()=>{}})=> {
                endCallback = callback; 
                let start = performance.now();
                let prevProgress=0;
            
                animationId = requestAnimFrame(function animate(time) {
                    let timeFraction = (time - start) / duration;
                    if (timeFraction > 1) timeFraction = 1;
                    
                    let calculated = Math.abs(timing(timeFraction));
                    let progress = calculated;
                    
            
                    if(progress > prevProgress) draw(progress);
                    
                    prevProgress = progress;
            
                    if (timeFraction < 1) {
                        animationId = requestAnimFrame(animate);
                        endCallback();
                    }
                });
            },
            stop:()=>{
                endCallback=null;
                cancelAnimFrame(animationId);
            }
        }
}


// 
export function linear(timeFraction){
    return timeFraction;
}

export function easeOut(timeFraction, power=2){
    return 1 - Math.pow(1-timeFraction, power);
}

export function easeIn(timeFraction, power=2){
    return Math.pow(timeFraction, power)
}

export function easeInOut(timeFraction,power=2) {
    if (timeFraction < .5){
        return Math.pow(2 * timeFraction,power) / 2;
    }else{
        return (2 - Math.pow(2 * (1 - timeFraction),power)) / 2;
    }
}


