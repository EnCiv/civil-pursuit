'use strict';

function fixedScroll(){
    var h=document.getElementsByTagName("html")[0];
    let b=h.getBoundingClientRect();
    function handler(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.returnValue=false;
        let top=(parseInt(h.style.top,10)-e.deltaY);
        let b=h.getBoundingClientRect();
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;
        h.style.top=top+'px'
    }
    h.setAttribute("style","position: fixed; width:"+b.width+'px; top:'+(-b.top)+'px;');
    var l1=h.addEventListener("wheel",handler);
    var l2=h.addEventListener("touchmove",handler);
}

export default fixedScroll;


