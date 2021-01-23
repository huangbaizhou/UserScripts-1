// ==UserScript==
// @name        Better Mangas
// @namespace   Violentmonkey Scripts
// @match       https://manganelo.com/chapter/*
// @match       https://mangakakalot.com/chapter/*
// @match       https://earlymanga.website/*
// @match       https://mangallama.com/readmanga.php*
// @match       https://manga347.com/manga/*
// @match       https://isekaiscan.com/manga/*
// @match       https://simxblogger.blogspot.com/p/*

// @match       https://manga68.com/manga/*
// @match       https://www.mangalord.com/manga/*
// @match       https://toonily.net/manga/*
// @match       https://manhuaplus.com/manga/*
// @match       https://www.webtoon.xyz/read/*
// @match       https://mangabob.com/manga/*
// @match       https://manhuadex.com/manhua/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/9/2020, 2:06:35 AM
// ==/UserScript==

var local = location.href;

if (local.indexOf("manganelo") > 0 || local.indexOf("mangakakalot") > 0) {
    var style = `
  <style>
    #vungdoc iframe,
    .container-chapter-reader div {
      display: none !important;
    }

    #vungdoc img,
    .container-chapter-reader img {
      margin: 0 auto !important;
      width: 47vw;
    }

    .pluginSkinDark.pluginFontHelvetica {
      color: white;
    }

    .UFIInputContainer {
      color: #111;
    }

    iframe {
        background: #fff;
    }
  </style>
  `;

    document.head.innerHTML += style;

    //var next = ".navi-change-chapter-btn-next";
    //var prev = ".navi-change-chapter-btn-prev";

    var wasPressed = false;
    var timeOut = 0;

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            if (wasPressed) {
                if (document.querySelector(".navi-change-chapter-btn-prev"))
                    document.querySelector(".navi-change-chapter-btn-prev").click();
                else
                    document.querySelector(".next").click();
            } else {
                wasPressed = true;
                timeOut = setTimeout(() => wasPressed = false, 500);
            }
        }
        else if (event.keyCode == 39) {
            if (wasPressed) {
                if (document.querySelector(".navi-change-chapter-btn-next"))
                    document.querySelector(".navi-change-chapter-btn-next").click();
                else
                    document.querySelector(".back").click();

            } else {
                wasPressed = true;
                timeOut = setTimeout(() => wasPressed = false, 500);
            }
        }
    });

    document.querySelectorAll("img").forEach(e => {
        e.addEventListener("click", function () {
            var T = this;

            if (T.style.width == "")
                T.style.width = "72vw";
            else if (T.style.width == "72vw")
                T.style.width = "85vw";
            else
                T.style.width = "";
        })
    });
}
else if (local.indexOf("earlymanga") > 0) {
    document.querySelector("#mjvgaqs-blanket").remove();
}
else if (local.indexOf("mangallama") > 0) {
    document.querySelectorAll("br").forEach(e => e.remove());
    document.getElementById("detected").remove();
    document.getElementById("livesearchm").remove();
}
else if (local.indexOf("manga347") > 0) {
    var style = `
  <style>
    .entry-header { margin: 4px 0 2px !important; width: 74vw; }
    .prev_page { padding: 3px 15px 3px 30px !important; }
    .next_page { padding: 3px 30px 3px 15px !important; }
    .btn.back { padding: 3px 30px 3px 15px !important;}
    .blocks-gallery-item > p { display: none; }
    .no-subnav.c-sub-header-nav.with-border.hide-sticky-menu.sticky {
      border: none;
      background: none;
      box-shadow: none;
    }

  </style>
  `;

    document.head.innerHTML += style;
}
else if (local.indexOf("isekaiscan") > 0) {
    var style = `
  <style>
  .reading-content {
      width: 54%;
      margin: 0 auto;
  }
  body {
      background-color: #141313 !important;
  }
  </style>
  `;

    document.head.innerHTML += style;
    document.querySelectorAll("img.lazyload").forEach(e => { e.src = e.dataset["src"].trim(); e.className = "" });
}
else if (local.indexOf("simxblogger") > 0) {
    document.querySelector("#fixedbox").remove();
    document.querySelector(".switchbar").remove();
    document.body.style.background = "#333";
}
else {
    document.body.classList = "";
    document.body.style.backgroundColor = "#111";

}
