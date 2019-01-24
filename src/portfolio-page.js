export default ()=>{
    let cards = document.getElementsByClassName("card");
    Array.prototype.forEach.call(cards,(card)=>{
        // 입력시
        let infoButton = card.getElementsByClassName("card__info-button")[0];
        let cardInfoLayout = card.getElementsByClassName("card__info")[0];
        infoButton.addEventListener("click",(ev)=>{
            ev.preventDefault();
            cardInfoLayout.classList.add("card__info--showing");
        });

        // 닫기버튼
        let closeButton = card.getElementsByClassName("card__info-close")[0];
        closeButton.addEventListener("click",(ev)=>{
            ev.preventDefault();
            cardInfoLayout.classList.remove("card__info--showing");
        });
        
    })

}