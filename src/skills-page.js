import {animate} from './requestAnim.js';

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
