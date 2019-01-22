import fonts from './css/web_font.scss';
import styles from './css/style.scss';

import main_page from './main_page';
import page_control from './page-control.js';


window.onload = function () {
    main_page();
    document.querySelector('html').style.opacity = "1";
}

// var myElement = document.getElementById('html');

// create a simple instance
// by default, it only adds horizontal recognizers
