// ==UserScript==
// @name        Fuck Google
// @namespace   Fuck Google
// @match       https://www.google.com/search*
// @grant       none
// @version     1.0
// @author      Svildr
// @description 7/25/2020, 11:48:09 PM
// ==/UserScript==


var obj = document.querySelectorAll(".hdtb-mitem.hdtb-imb a[href*='shop']");

if (obj.length > 0) {
    obj[0].parentElement.remove();
}

