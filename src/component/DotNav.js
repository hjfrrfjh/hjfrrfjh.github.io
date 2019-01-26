'use strict';

export class DotNav{
    constructor(num=0,func=()=>{}){
        this.current=num;
        this.items = document.getElementsByClassName("dot-nav__dot");
        this.pointer = document.getElementsByClassName("dot-nav__pointer")[0];
        this.select(num);

        setTimeout(()=>{
            this.pointer.style.transition="transform 0.2s";
        },100);
        
        for(let i=0;i<this.items.length;i++){
            this.items[i].addEventListener("click",()=>{
                this.select(i);
                func(i);
            });
        }
    }
    
    select(num){
        let top = this.items[num].offsetTop;
        this.pointer.style.transform="translate(0,"+top+"px)";
    }
}

// html 형식
/* 
<div class="dots">
    <div class="dots__string"></div>
    <div class="dots__dot dots__dot--nomargin"></div>
    <div class="dots__dot"></div>
    <div class="dots__dot"></div>
    <div class="dots__dot"></div>
    <div id="dots-pointer" class="dots__pointer"></div>
</div> 
*/