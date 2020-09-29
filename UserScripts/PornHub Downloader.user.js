// ==UserScript==
// @name   PornHub
// @match  *://*.pornhub.com/view_video.php?viewkey=*
// @author Svildr
// ==/UserScript==

var links = window["flashvars_" + document.getElementById("player").getAttribute("data-video-id")];
var name = document.querySelector(".title > .inlineFree").innerHTML;

var style = `
<style>
.btn {
    padding: 8px 12px !important;
    background: #464242;
    border-radius: 5px;
    color: white;
    text-decoration: none !important;
}
</style>
`;

var buttons = `
  <div class='title-container'>
      DOWNLOADS:
      <a class="btn" href='${links.quality_240p}' download='${name}'>240p</a>&nbsp;
      <a class="btn" href='${links.quality_480p}' download='${name}'>480p</a>&nbsp;
      <a class="btn" href='${links.quality_720p}' download='${name}'>720p</a>&nbsp;
      <a class="btn" href='${links.quality_1080p}' download='${name}'>1080p</a>&nbsp;
  </div>
`;




document.getElementsByClassName("title-container")[0].outerHTML += style + buttons;

if(document.querySelector("#vpContentContainer").children.length == 3)
  document.querySelector("#vpContentContainer").children[1].remove();

document.querySelector(".video-wrapper > .hd.clear").remove();