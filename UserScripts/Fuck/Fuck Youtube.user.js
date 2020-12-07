// ==UserScript==
// @name        Fuck Youtube
// @namespace   Fuck
// @match       https://www.youtube.com/watch?v=*
// @grant       none
// @version     1.0
// @author      Svildr
// @description 12/7/2020, 6:19:11 PM
// ==/UserScript==



document.querySelectorAll(".ytp-ce-element").forEach(e=> e.remove());
document.querySelectorAll(".ytp-gradient-top").forEach(e=> e.remove());