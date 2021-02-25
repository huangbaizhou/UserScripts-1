// ==UserScript==
// @name        R34 Images
// @namespace   Violentmonkey Scripts
// @match       https://rule34.xxx/index.php
// @match       http://rule34.paheal.net/post/view/*
// @match       https://lolibooru.moe/post/show/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/16/2020, 2:07:47 AM
// ==/UserScript==


setTimeout(function () {
    if (document.querySelector("#image"))
        document.querySelector("#image").onclick = function () { location.href = document.querySelector("#image").src; }
    //location.href = document.querySelector("#image").src;

    if (document.querySelector("#main_image"))
        document.querySelector("#main_image").onclick = function () { location.href = document.querySelector("#main_image").src; }
    //location.href = document.querySelector("#main_image").src;
}, 150)