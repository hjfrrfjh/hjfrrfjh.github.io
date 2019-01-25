window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 1000 / 60); };
})();


function animate({ timing, draw, duration }) {
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

let graphAnimationFlag = false;

export default {
    startGraphAnimation: () => {
        if(graphAnimationFlag) return;

        Array.prototype.forEach.call(document.getElementsByClassName("bar-graph__bar"), (bar, index) => {

            let value = bar.getAttribute("data-value");
            let innerText = bar.getElementsByClassName("bar-graph__inner-text")[0];
            let currentValue = 0;

            setTimeout(() => animate({
                timing: timeFraction => { //ease-out 설정
                    timeFraction = 1 - timeFraction
                    return 1 - Math.pow(timeFraction, 5);
                },
                draw: progress => {
                    progress = Math.round(progress * 100);
                    if (currentValue == progress) return; //같은 수치나오면 애니메이션 업데이트 안함

                    if (progress >= value) { //지정된값보다 높을경우 지정값으로 변경
                        progress = value;
                    }
                    
                    bar.style.height = progress + "%";
                    innerText.innerText = progress;

                    currentValue = progress;
                },
                duration: 5000
            }), index * 70);

        });
        graphAnimationFlag=true;
    }
}