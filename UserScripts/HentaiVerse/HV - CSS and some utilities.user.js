// ==UserScript==
// @name       HV - CSS and some utilities
// @namespace  Hentai Verse
// @author     Svildr
// @run-at     document-start
// @match      https://hentaiverse.org/*
// @match      https://e-hentai.org/news.php
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==

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
  div#expholder { left: 10vw; top: calc(100vh - 25px); }
  div#riddlebar { left: calc(50vw - 344px) !important; }

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
</style>
`;


document.head.innerHTML += newStyle;

//////////////////////////// ~ Level Table
//Crude        103-138  || Fair        139-187	
//Average      188-227  || Superior    228-282
//Exquisite    277-303  || Magnificent 304-348	
//Legendary    348-399  || Peerless    368-421

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

    /*
    if(url.indexOf("Character&ss=tr") > 0){
      //training.start_training(80);
    }
    
    
    if(url.indexOf("?s=Bazaar&ss=ss") > 0) {
       
    }
    */

    /* Random Encounters */
    if (url.indexOf("e-hentai.org/news.php") > 0) {
        if (document.getElementById("eventpane") != null) {
            window.location.href = document.getElementById("eventpane").querySelector("a").href;
        }
    }

    if (url.indexOf("Battle&ss=ba&encounter=") > 0 && document.getElementById("battle_main") != null) {
        if (localStorage.amoutRandomEncounter == null)
            localStorage.amoutRandomEncounter = 0;
        //else
        //    window.location.href = "https://hentaiverse.org";

        localStorage.amoutRandomEncounter = parseInt(localStorage.amoutRandomEncounter) + 1;
    }
}, 50);

setInterval(function () {
    /* Add 5 hours of difference The clock resets at (7 pm Canada Winter) */
    let hourDifference = 3 * 3600 * 1000; // + 3 Brasil
    let dateLast = new Date(parseInt(localStorage.lastRandomEncounter) + hourDifference).getDate();
    let dateNow = new Date(Date.now() + hourDifference).getDate();

    if (dateNow - dateLast > 0) {
        localStorage.amoutRandomEncounter = 0;
        localStorage.lastRandomEncounter = Date.now(); // Needed for it to not keep reseting
    }

    if (hasRandomEncounter && url.indexOf("Bazaar") == -1 && url.indexOf("Forge") == -1 && url.indexOf("Battle") == -1 && url.indexOf("riddlemaster") == -1 &&
        document.getElementById("battle_main") == null && localStorage.amoutRandomEncounter < 24) {
        let lastChild = document.querySelector("body > :last-child");

        if (lastChild.innerText == "Ready") {
            lastChild.querySelector("a").click();
            console.log("All good");
        }
    }
}, 30000); // 30s