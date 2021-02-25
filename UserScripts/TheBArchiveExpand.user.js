// ==UserScript==
// @name        TheBArchive Expand
// @match       https://thebarchive.com/b/thread/*
// @grant       none
// @version     1.0
// @author      Svildr
// ==/UserScript==

window["ExpandAll"] = function () {
    var list = document.querySelectorAll(".post_image");

    for (var i = 0; i < list.length; i++) {
        let href = list[i].parentElement.href;
        let src = list[i].src;

        if (src != href)
            list[i].src = href;

        list[i].removeAttribute("width");
        list[i].removeAttribute("height");
    }
}

window["RemoveText"] = function () {
    var list = document.querySelectorAll("article");

    var total = list.length;

    for (var i = 0; i < list.length; i++) {
        var item = list[i];

        if (item.className.indexOf("has_image") == -1)
            item.remove();
    }

    var newTotal = document.querySelectorAll("article").length;

    console.log("Removed: " + (total - newTotal) + " posts")

}

document.querySelectorAll(".btnr.parent[data-function='report']").forEach(item => {
    item.dataset.function = ""
    item.dataset.backdrop = ""
    item.href = "javascript:void(0)"

    item.onclick = function (e) {
        e.originalTarget.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    }
});