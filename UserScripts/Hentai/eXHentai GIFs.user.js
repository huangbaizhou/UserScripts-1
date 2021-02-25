// ==UserScript==
// @name        EXHentai GIFs
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/g/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/29/2020, 2:00:25 AM
// ==/UserScript==


var gifs = document.querySelectorAll(' img[title*=".gif"]');

gifs.forEach(e => {
  e.parentElement.parentElement.style.background = "blue";
});