// JavaScript source code
// ==UserScript==
// @name           RarBG - Images
// @version        1.1
// @namespace      RarBG
// @run-at         document-end
// @grant          none
// @match          *://rarbg.is/*
// @match          *://rarbgproxied.org/*
// @match          *://www.freebunker.com/show/*
// @match          *://www.imagesnake.com/show/*
// @match          *://www.imagefruit.com/show/*
// @match          *://www.imgshots.com/show/*
// @match          *://www.imgcarry.com/show/*
// @match          *://www.pornbus.org/show/*
// @match          *://imgsin.com/viewer.php?*
// @match          *://22pixx.xyz/*
// @match          
// ==/UserScript==
 
var hRef = document.location.href;

if(hRef.indexOf("rarbg") > 0) {
  var itens = document.querySelectorAll("a[onmouseover]");
 
  for (var i = 0; i < itens.length; i++) {
    var img = itens[i].onmouseover.toString();
    var start = img.indexOf("<img");

    if (start > 0) {
      var end = img.indexOf("border=0>") - start + 9;

      img = img.substr(start, end).replace(/\\'/g, "'");

      itens[i].innerHTML = img + itens[i].innerHTML;
      itens[i].onmouseover = function () { };
    }
  }
}

// Inside
else if(hRef.indexOf("imgsin") > 0) {
  document.location.href = document.querySelectorAll("img")[0].src;
}
else if(hRef.indexOf("22pixx") > 0 && hRef.indexOf(".html") > 0) {
  document.location.href = hRef.replace("/ia-o/", "/o/")
                               .replace("/ib-o/", "/o/")
                               .replace(".html", "");
}
else {
  document.location.href = document.querySelectorAll("img#img_obj")[0].src;
}