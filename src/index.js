import fonts from './css/web_font.scss';


import physicsBox from './physics-box';

import {ScrollPage}  from './component/scrollPage.js';

import {DotNav} from './component/DotNav.js';
import dotnavCSS from './component/DotNav.css';

import styles from './css/style.scss';



window.onload = function () {
    let scrollPage = new ScrollPage(undefined,index=>{
        dotNav.select(index);
    });

    let dotNav = new DotNav(scrollPage.current,(index)=>{
        scrollPage.scrollPage(index);
    });

    [document.getElementById("logo"),
    document.getElementById("nav_about"),
    document.getElementById("nav_portfolio"),
    document.getElementById("nav_skills")
    ].forEach((elm,index)=>{
        elm.addEventListener("click",(e)=>{
            e.preventDefault();
            scrollPage.scrollPage(index);
            dotNav.select(index);
        });
    });
    
    physicsBox();

    document.querySelector('html').style.opacity = "1";
}
