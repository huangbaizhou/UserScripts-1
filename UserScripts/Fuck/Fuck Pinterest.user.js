// ==UserScript==
// @name        Fuck Pinterest
// @namespace   Fuck
// @match       https://*.pinterest.com/*
// @grant       none
// @version     1.0
// @author      Svildr
// @description 7/25/2020, 11:48:09 PM
// ==/UserScript==


setInterval(function () {
    while (document.querySelectorAll('div[data-test-id="giftWrap"]').length > 0)
        document.querySelector('div[data-test-id="giftWrap"]').parentElement.remove()

}, 500)

var img = document.querySelector('img[src*="originals"]');

if (img) {
    var parent = img.parentElement.parentElement.parentElement;
    var a = document.createElement("a");
    a.href = img.src;
    a.append(img);

    img.style.height = "unset";

    parent.parentElement.append(a);
    parent.remove()
}
