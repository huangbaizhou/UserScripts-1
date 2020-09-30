// ==UserScript==
// @name        Twitch TV Get Points
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/25/2020, 8:03:25 PM
// ==/UserScript==

/*
var style = `
<style>
div.video-player__container--theatre-whispers {
   bottom: 0;
}
</style>
`;

document.head.innerHTML += style;
*/

setInterval(() => {
  var btn = document.querySelector(".tw-full-height.tw-relative.tw-z-above button");

  if(btn && !(btn.attributes["aria-label"] && btn.attributes["aria-label"].value == "Add Friend"))
    for(var r = 0; r < 5; r++)
      btn.click();  
  
}, 1500);
