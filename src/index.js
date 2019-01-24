'use strict';
import fonts from './css/web_font.scss';
// import "@babel/polyfill"; //Object.assing 등의 메소드 사용 가능하게 해준다
import animationcss from './css/animation.scss';
import AnimationTrigger from './animatinoTrigger.js';

import physicsBox from './physics-box';

import {ScrollPage}  from './component/scrollPage.js';

import {DotNav} from './component/DotNav.js';
import dotnavCSS from './component/DotNav.css';

import styles from './css/style.scss';

import portfolioPage from './portfolio-page.js';


window.onload = function () {

    let scrollPage = new ScrollPage();

    scrollPage.addScrollChangeListener((info)=>{
        if(info.type=="scroll-start"){
            dotNav.select(info.index);
        }else if(info.type=="scroll-end"){
            AnimationTrigger.animatePage(scrollPage.getCurrentAnchor());    
        }
    })

    AnimationTrigger.animatePage(scrollPage.getCurrentAnchor());
    
    let dotNav = new DotNav(scrollPage.current,(index)=>{
        scrollPage.scrollPage(index,{silent:true});
    });

    [document.getElementById("logo"),
    document.getElementById("nav_about"),
    document.getElementById("nav_portfolio"),
    document.getElementById("nav_skills")
    ].forEach((elm,index)=>{
        elm.addEventListener("click",(e)=>{
            e.preventDefault();
            scrollPage.scrollPage(index,{moveTop:true});
        });
    });
    
    physicsBox();
    portfolioPage();

    document.querySelector('html').style.opacity = "1";
}
