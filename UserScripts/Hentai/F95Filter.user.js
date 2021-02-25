// ==UserScript==
// @name        F95 - Filter
// @namespace   Violentmonkey Scripts
// @match       https://f95zone.to/latest*
// @grant       none
// @version     1.0
// @author      -
// @description 4/15/2020, 8:50:13 PM
// ==/UserScript==


var blockedContent = ["gay", "guro", "scat"]; // This content will be censored, but not removed
var removedContent = ["no sexual content"]; // This content will not be seen


/* STYLE */

var style = `
<style>
    {0} {
      opacity: .15;
      -webkit-filter: blur(5px);
      filter: blur(5px);
    }

    {1} {
      opacity: .75;
      -webkit-filter: blur(0);
      filter: blur(0);
    }

    {2} {
        background-color: blue !important;
    }

    {3} {
        display: none !important;
    }

</style>
`;


var blocked = "",
    blockedHover = "",
    blockedSpan = "",
    removed = "";

for (var i = 0; i < blockedContent.length; i++) {
    if (blocked != "") {
        blocked += ", ";
        blockedHover += ", ";
        blockedSpan += ", ";
    }

    blocked += `.resource-tile[data-tags*='${blockedContent[i]}']`;
    blockedHover += `.resource-tile[data-tags*='${blockedContent[i]}']:hover`;
    blockedSpan += `.resource-tile_tags > span[data-content*='${blockedContent[i]}']`;
}


for (var i = 0; i < removedContent.length; i++) {
    if (removed != "")
        removed += ", ";

    removed += `.resource-tile[data-tags*='${removedContent[i]}']`;
}

style = style.replace("{0}", blocked)
    .replace("{1}", blockedHover)
    .replace("{2}", blockedSpan)
    .replace("{3}", removed);

document.head.innerHTML += style;
/* END STYLE */


setInterval(() => {
    var e = document.querySelectorAll(".resource-tile_tags > span:not([data-content])");

    for (var i = 0; i < e.length; i++)
        e[i].dataset.content = e[i].innerText
}, 500);


