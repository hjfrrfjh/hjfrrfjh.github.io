export default {
    animatePage: (elm) => {
        
        // ------------한번 수행하고 멈추도록 주석처리-----------------
        // let elements = document.getElementsByClassName("animated");
        
        // 모든 애니메이션 해제
        // for (let i = 0; i < elements.length; i++) {
        //    elements[i].style.animationName = "";
        // }

        let elements = elm.getElementsByClassName("animated");

        // 애니메이션 다음에 오는 클래스명으로된 애니메이션 추가
        for (let i = 0; i < elements.length; i++) {
                let animationType = elements[i].classList[
                    Array.prototype.indexOf.call(elements[i].classList,"animated")+1
                ];
                if(elements[i].style.animationName !=animationType){
                    elements[i].style.animationName = animationType;
                }
        }
    }
}
