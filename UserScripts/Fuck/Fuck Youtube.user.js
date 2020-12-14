// ==UserScript==
// @name        Fuck Youtube
// @namespace   Fuck
// @match       https://www.youtube.com/watch?v=*
// @grant       none
// @version     1.0
// @author      Svildr
// @description 12/7/2020, 6:19:11 PM
// ==/UserScript==


var listOfFucksIGive = [".ytp-ce-element", ".ytp-gradient-top"];

setInterval(() => {
    for (var i = 0; i < listOfFucksIGive.length; i++)
        if (document.querySelectorAll(listOfFucksIGive[i]).length > 0)
            document.querySelectorAll(listOfFucksIGive[i]).forEach(e => e.remove());
}, 2000)
