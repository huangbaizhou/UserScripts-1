// ==UserScript==
// @name        TheBArchive Expand
// @namespace   Violentmonkey Scripts
// @match       https://thebarchive.com/b/thread/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/12/2020, 3:43:46 PM
// ==/UserScript==

// Don't ask me why I made this.

window["ExpandAll"] = function() {
  var list = document.querySelectorAll(".post_image");
  
  for(var i = 0; i < list.length; i++) {
    let href = list[i].parentElement.href;
    let src = list[i].src;
    
    if(src != href)
      list[i].src = href;
    
    list[i].removeAttribute("width");
    list[i].removeAttribute("height");
  }
}

document.querySelectorAll(".btnr.parent[data-function='report']").forEach(item =>
    item.onclick = function (e) {
        e.originalTarget.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    }
);