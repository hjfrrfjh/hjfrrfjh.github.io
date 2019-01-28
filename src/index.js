'use strict';
// 폰트
import fonts from './css/web_font.scss';

// 컴포넌트
import {ScrollPage}  from './component/ScrollPage.js';
import AnimationTrigger from './component/AnimatinoTrigger.js';
import AnimationTriggerCSS from './component/AnimatinoTrigger.css';
import DotNavCSS from './component/DotNav.css';
import {DotNav} from './component/DotNav.js';

// 페이지별 스크립트
import introPage from './intro-page';
import portfolioPage from './portfolio-page.js';
import skillsPage from './skills-page.js';

// 스타일
import styles from './css/style.scss';

window.onload = function () {

    // 스크롤시 이벤트 
    let scrollPage = new ScrollPage();

    scrollPage.addScrollChangeListener((info)=>{
        if(info.type=="scroll-start"){
            dotNav.select(info.index);
            changeHeader(info.index);
        }else if(info.type=="scroll-end"){
            AnimationTrigger.animatePage(scrollPage.getCurrentAnchor());  
            if(info.index==3){
                skillsPage.startGraphAnimation();
            }
        }
    })
    
    // 우측 페이지 네비게이션 버튼 이벤트
    let dotNav = new DotNav(scrollPage.current,(index)=>{
        scrollPage.scrollPage(index,{moveTop:true,force:true});
    });


    // 상단 네비게이션 이벤트 연결
    [document.getElementById("logo"),
    document.getElementById("nav_about"),
    document.getElementById("nav_portfolio"),
    document.getElementById("nav_skills")
    ].forEach((elm,index)=>{
        elm.addEventListener("click",(e)=>{
            e.preventDefault();
            scrollPage.scrollPage(index,{moveTop:true,force:true});
        });
    });
    
    // 새로고침시 현재 페이지에따른 초기 애니메이션 수행
    let pageNum = scrollPage.current;

    changeHeader(pageNum);
    if(pageNum==3){
        skillsPage.startGraphAnimation();
    }
    AnimationTrigger.animatePage(scrollPage.getCurrentAnchor());

    // 각 페이지 초기 스크립트 로드
    introPage();
    portfolioPage();

    // 트랜지션 해제
    Array.prototype.forEach.call(document.querySelectorAll(".block-transition"),elm=>{
        elm.classList.remove("block-transition");
    });

    // 메일 레이아웃
    let mailLayout =  document.getElementById("mail_layout");
    document.getElementById("contact_button").addEventListener("click",(ev)=>{
        ev.preventDefault();
       mailLayout.classList.add("mail-layout--showing");
       document.getElementById("mail_sender").focus();
       history.pushState(null, null, location.href); //뒤로가기 버튼을 위해 
    })
    
    window.onpopstate = function () {
        mailLayout.classList.remove("mail-layout--showing");
    };

    mailLayout.addEventListener("click",()=>{
        mailLayout.classList.remove("mail-layout--showing");
        history.back();
    })
    document.getElementsByClassName("mail-layout__container")[0].addEventListener("click",ev=>{
        ev.stopPropagation();
    });
    
    
    //작업 완료후 화면 보여줌
    document.querySelector('html').style.opacity = "1";
}

function changeHeader(pageNum){
    let header = document.getElementsByClassName("header")[0];
    let itemBg = header.getElementsByClassName("slide-link");
    let itemText = header.getElementsByClassName("slide-link__text");

    if(pageNum==0){
        header.classList.remove("header--darker");
        Array.prototype.forEach.call(itemBg,item=>{
            item.classList.remove("slide-link--darker");
        });
        Array.prototype.forEach.call(itemText,item=>{
            item.classList.remove("slide-link__text--darker");
        });
    }else{
        header.classList.add("header--darker");
        Array.prototype.forEach.call(itemBg,item=>{
            item.classList.add("slide-link--darker");
        });
        Array.prototype.forEach.call(itemText,item=>{
            item.classList.add("slide-link__text--darker");
        });
    }
}
