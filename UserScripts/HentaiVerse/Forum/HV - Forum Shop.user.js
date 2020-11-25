// ==UserScript==
// @name        HV - Forum Shop
// @namespace   Hentai Verse
// @icon        http://e-hentai.org/favicon.ico
// @match       https://forums.e-hentai.org/index.php*
// @grant       none
// @version     1.0
// @author      Svildr
// @description 28/10/2020, 12:30:08
// ==/UserScript==

// Remove Items that are out of stock.

var strike = document.querySelectorAll("strike");
//.forEach(e => e.remove());


for(var i = 0; i < strike.length; i++) {
  var nextSibling = strike[i].nextElementSibling;
  
  if(nextSibling && nextSibling.nodeName == "BR")
    nextSibling.remove();
  
  strike[i].remove();
}
  
