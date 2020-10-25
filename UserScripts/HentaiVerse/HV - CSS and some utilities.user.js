// ==UserScript==
// @name       HV - CSS and some utilities
// @namespace  Hentai Verse
// @author     Svildr
// @run-at     document-start
// @match      https://hentaiverse.org/*
// @match      https://e-hentai.org/news.php
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==

var hasRandomEncounter = true;
var removeTrashItems = true;
var url = window.location.href;

var newStyle = `
<style>
    div#csp { width: 100%; height: 100%; border: 0; }
    body { background: #EDEBDF; }
    div#eqch_stats { position: absolute; right: 0; display: inline; }
    div#mainpane { height: calc(100vh - 31px); padding: 0; }
    div#stats_inner { height: 100vw; border-top: 0; margin-top: 0; padding-top: 8px; }
    div#eqch_outer { padding-top:0; }
    div#stats_scrollable { height: calc(100vh - 60px); }
    div#stats_pane { height: calc(100vh - 100px)!important; }
    div#eqch_left { margin: 0 auto; width: calc(100% - 374px); display: inline; }
    div#battle_right { position: absolute; right: 10px; }
    div#battle_left { width: calc(100vw - 450px); }
    div#infopane, div#pane_log { width: auto; }
    
    /* Battle*/
    div.bte > img, div.btm6 > img { width: 28px !important; height: 30px !important; }
    div#expholder { left: calc(50% - 619px); top: calc(100vh - 25px); }
    div#riddlebar { left: calc(50vw - 344px) !important; }
    div#pane_log { height: calc(100vh - 320px); }


    /*Baazar*/
    div#filterbar { border-bottom: 1px solid black; height: 30px; }
    div#eqshop_outer { height: calc(100vh - 88px); }
    div#networth { top: unset; bottom: 0; }
    div.eqshop_pane, div.itshop_pane { height: calc(100vh - 190px); }
    #eqshop_outer div#item_pane, #eqshop_outer div#shop_pane,
    #itshop_outer div#item_pane, #itshop_outer div#shop_pane { height: calc(100vh - 240px) !important; }
    div#eqshop_sellall { top: unset; left: calc(50vw - 320px); bottom: 64px; }
    body > a { top: unset !important; bottom: 32px; left: 18px !important; }
    .fc2 > div, .fc4 > div { top: -2px !important;}

    /* Inline Difficult Changer */
    .fc4.far.fcb > select { width: 78px !important; top: 6px !important; left: 1053px !important; }

    /*Settings*/
    div#settings_outer { height: 100%; }
    div#settings_outer form { margin-bottom: 20px; }

    /* Forge */
    div#messagebox { left: calc(50% + 68px); }

    /* HVStat */
    div#hvstat-icon { right: 23px; }
    body > div#popup_box { right: 220px; left: unset !important; top: 25px !important; right: 460px; }
    div#mainpane > div#popup_box { right: 435px; left: unset !important; top: 25px !important; }
    .hvstat-round-counter { top: 25px; right: 21px; }

    /* Random Encounters - This folks if what happens when you don't set a class or id to an object. */
    body > div:not(#popup_box):not(#csp):not(#riddlebar):not(.ui-widget-overlay):not(.ui-front) { right: 220px; left: unset !important; }

`;

///?s=Character&ss=eq&equip_slot=12

if (url.indexOf("?s=Character&ss=eq&equip_slot=") > -1) {
    newStyle += "#eqch_left > #compare_pane { top: 80px; left: 50%; } #csp > #popup_box { top: 107px !important; left: calc(50% - 570px) !important; }";
} else if (url.indexOf("?s=Character&ss=eq") > -1) {
    newStyle += "#csp > #popup_box { top: 75px !important; left: calc(50% + 145px) !important; }";
} else if (url.indexOf("?s=Forge") > -1) {
    newStyle += "#csp > #popup_box { top: 100px !important; left: calc(50% + 80px) !important; }";
} else if (url.indexOf("?s=Character&ss=in") > -1) {
    newStyle += "#csp > #popup_box { top: 200px; left: calc(50% - 250px) !important; }"
} else if (url.indexOf("?s=Bazaar&ss=es") > -1) {
    newStyle += "#csp > #popup_box { top: 200px; left: calc(50% - 300px) !important; }"
}

newStyle += "</style>";

function loadCSS() {
    if (document.head)
        document.head.innerHTML += newStyle;
    else
        setTimeout(loadCSS, 20);
}

loadCSS();

//document-end
if (removeTrashItems && url.indexOf("Bazaar&ss=es") > 0)
    setTimeout(function () {
        var items = document.querySelectorAll("#shop_pane div.eqp");
        var saveItems = [];

        for (var i = 0; i < items.length; i++) {
            if (items[i].innerText.indexOf("Peerless") == -1 &&
                items[i].innerText.indexOf("Legendary") == -1 &&
                items[i].innerText.indexOf("Magnificent") == -1) {
                items[i].style.display = "none";
            } else {
                saveItems.push(items[i]);
            }
        }
    }, 100);

/* Random Encounters */
if (hasRandomEncounter) {
    if (!localStorage.amoutRandomEncounter)
        localStorage.amoutRandomEncounter = 0;

    if (url.indexOf("e-hentai.org/news.php") > 0) {
        var randomEncountersInterval = setInterval(function () {
            if (document.getElementById("eventpane") != null) {
                clearInterval(randomEncountersInterval);

                var a = document.getElementById("eventpane").querySelector("a");

                if (a)
                    window.location.href = a.href;
                else
                    localStorage.amoutRandomEncounter = 0;
            }
        }, 500)
    }

    if (url.indexOf("s=Battle&ss=ba&encounter=") > 0) {
        if (document.getElementById("battle_main") != null)
            localStorage.amoutRandomEncounter = parseInt(localStorage.amoutRandomEncounter) + 1;
        else
            window.location.href = "https://hentaiverse.org/?s=Character&ss=ch";
    }

    if ((url.indexOf("s=Character") > -1 || url == "https://hentaiverse.org/") && localStorage.amoutRandomEncounter < 24)
        setInterval(function () {
            let lastChild = document.querySelector("body > :last-child");

            if (lastChild.innerText == "Ready") {
                lastChild.querySelector("a").click();
                console.log("All good");
            }
        }, 5000); // 5s
}
