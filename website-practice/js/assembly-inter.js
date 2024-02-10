"use strict";

function expand_summary(){
    var test = document.getElementById('expand-txt');
    var title = document.getElementById('h1');
    var div1 = document.getElementById('example');
    var pdf = document.getElementById('pdf');
    

    if(title.style.display != "none"){
        title.style.display = "none";
        div1.style.display = "none";
        pdf.style.display = "none";
    
        var div = document.getElementById('explanation');
        div.style.width = "60vw";
        div.style.height = "80%";
        div.style.left = "14%";
        div.style.top = "3%";
    } else {
        title.style.display = "block";
        div1.style.display = "block";
        pdf.style.display = "block";
        
        var div = document.getElementById('explanation');
        div.style.width = "36%";
        div.style.height = "40%";
        div.style.left = "0";
        div.style.top = "0";
    }
}

function expand_example(){
    var test = document.getElementById('expand-txt');
    var title = document.getElementById('h1');
    var div1 = document.getElementById('explanation');
    var pdf = document.getElementById('pdf');
    

    if(title.style.display != "none"){
        title.style.display = "none";
        div1.style.display = "none";
        pdf.style.display = "none";
    
        var div = document.getElementById('example');
        div.style.width = "60vw";
        div.style.height = "80%";
        div.style.left = "14%";
        div.style.top = "3%";
    } else {
        title.style.display = "block";
        div1.style.display = "block";
        pdf.style.display = "block";
        
        var div = document.getElementById('example');
        div.style.width = "36%";
        div.style.height = "20%";
        div.style.left = "0";
        div.style.top = "0";
    }
}