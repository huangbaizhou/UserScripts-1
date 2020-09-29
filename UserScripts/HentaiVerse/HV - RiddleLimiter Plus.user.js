// ==UserScript==
// @name         HV - RiddleLimiter Plus
// @namespace    Hentai Verse
// @author       holy_demon, nekolor
// @description  Riddle can be answered by one click, or hotkey (1,2,3)
// @icon         http://e-hentai.org/favicon.ico
// @match        *://*.hentaiverse.org/*
// @version      1.2.2
// @grant none
// ==/UserScript==

function solveRiddle(solution) {
    if (document.getElementById('riddleanswer').value === solution) {
        document.getElementById('riddleform').submit();
    } else {
        document.getElementById('riddleanswer').value = solution; 
    }

}

function RiddleLimiter() {
    if ( !document.getElementById('riddlemaster') || document.getElementById('riddlebar') ) return;
    var options = ['A', 'B', 'C'];
    var bar = document.body.appendChild(document.createElement('div'));
    bar.style.cssText = "z-index:1000; width:702px; height: 27px; position:absolute; top: 53px; left: 423px; display: table; border-top: #F08 solid 3px; border-bottom: #F08 solid 3px; opacity: 0.9;";
    bar.id = 'riddlebar';
    for ( var i in options ) {
        var button = bar.appendChild(document.createElement('div'));
        button.style.cssText = "display: table-cell; cursor:pointer";
        button.value = options[i];
        button.onclick = function() {
            solveRiddle(this.value);
            window.open(document.querySelector("#riddlebot img").src, '_blank');
            document.getElementById('riddleform').submit(); 
        };
      
        button.onmouseover = function() {
            this.style.background = 'linear-gradient(90deg, transparent, rgba(255,0,128,0.4), transparent)'; 
        };
      
        button.onmouseout = function() {
            this.style.background = ''; 
        };}
  
    document.addEventListener("keyup", function(e) {
        var key = String.fromCharCode(e.keyCode);
        console.log(key, String.fromCharCode(e.keyCode));
        if (key >= "1" && key <= "3") {
            solveRiddle(options[key - 1]); }
        else if (key >= "A" && key <= "Z") {
            solveRiddle(key); }}, true); }

RiddleLimiter();
document.addEventListener('DOMContentLoaded', RiddleLimiter);