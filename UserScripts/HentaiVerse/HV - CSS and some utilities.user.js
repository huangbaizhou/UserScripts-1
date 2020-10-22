// ==UserScript==
// @name       HV - CSS and some utilities
// @namespace  Hentai Verse
// @author     Svildr
// @run-at     document-start
// @match      https://hentaiverse.org/*
// @match      https://e-hentai.org/news.php
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==


//////////////////////////// ~ Level Table
//Crude        103-138  || Fair        139-187	
//Average      188-227  || Superior    228-282
//Exquisite    277-303  || Magnificent 304-348	
//Legendary    348-399  || Peerless    368-421


// Works wonders with Random Encounter Notification
var hasRandomEncounter = true;

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
setTimeout(function () {
    if (url.indexOf("Bazaar&ss=es") > 0) {
        var items = document.querySelectorAll("#shop_pane div.eqp");
        var saveItems = [];

        for (var i = 0; i < items.length; i++) {
            if (items[i].innerText.indexOf("Peerless") == -1 &&
                items[i].innerText.indexOf("Legendary") == -1 &&
                items[i].innerText.indexOf("Magnificent") == -1)// &&
            //items[i].innerText.indexOf("Exquisite") == -1)
            {
                items[i].style.display = "none";
            } else {
                saveItems.push(items[i]);
            }
        }
    }


    /* Random Encounters */
    if (url.indexOf("e-hentai.org/news.php") > 0) {
        if (document.getElementById("eventpane") != null) {
            window.location.href = document.getElementById("eventpane").querySelector("a").href;
        }
    }

    if (url.indexOf("Battle&ss=ba&encounter=") > 0) {
        if (localStorage.amoutRandomEncounter == null)
            localStorage.amoutRandomEncounter = 0;

        if (document.getElementById("battle_main") != null)
            localStorage.amoutRandomEncounter = parseInt(localStorage.amoutRandomEncounter) + 1;
        else
            window.location.href = "https://hentaiverse.org/?s=Character&ss=ch";
    }
}, 150);


if ((url.indexOf("Character") > -1 || url == "https://hentaiverse.org/") && hasRandomEncounter)
    setInterval(function () {
        /* Add 5 hours of difference The clock resets at (7 pm Canada Winter) */
        var utcTime = new Date(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
            new Date().getUTCHours(),
            new Date().getUTCMinutes(),
            new Date().getUTCSeconds()
        );
        var timeDiff = utcTime - new Date();
        var dateLast = new Date(parseInt(localStorage.lastRandomEncounter) + timeDiff).getDate();

        if (utcTime.getDate() - dateLast > 0) {
            localStorage.amoutRandomEncounter = 0;
            localStorage.lastRandomEncounter = Date.now(); // Needed for it to not keep reseting
        }


        if (localStorage.amoutRandomEncounter < 24) {
            let lastChild = document.querySelector("body > :last-child");

            if (lastChild.innerText == "Ready") {
                lastChild.querySelector("a").click();
                console.log("All good");
            }
        }
    }, 10000); // 10s
