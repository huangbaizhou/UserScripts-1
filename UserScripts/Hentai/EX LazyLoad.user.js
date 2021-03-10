// ==UserScript==
// @name        HV - LazyLoad
// @namespace   Violentmonkey Scripts
// @match       https://e-hentai.org/s/*
// @match       https://exhentai.org/s/*
// @grant       none
// @version     1.0
// @author      Svildr
// ==/UserScript==

var $ = e => document.querySelector(e);
var $$ = e => document.querySelectorAll(e);
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

var style = `
<style>
	#i1 {
		max-width: unset !important;
		min-width: unset !important;
		width: unset !important;
		background: #34353b;
		border: unset;
	}
		
		#i1 > h1 {
			white-space: nowrap;
		}

	#i3 {
		width: unset !important;
	}

	#i3 img {
		max-width: calc(100vw - 50px) !important;
		min-width: 700px;
		max-height: unset !important;
		height: unset !important;
		width: unset !important;
	}
	
	#i3.fullscreen {
		min-height: calc(100vh - 30px);
	}
	
		#i3.fullscreen img {
			max-width: 100vw !important;
			max-height: calc(100vh - 32px) !important;
			min-width: unset !important;
			height: unset !important;
			width: unset !important;
		}

	#i2 a, #i4 a {
		cursor: pointer;
	}
</style>
`;

document.head.innerHTML += style;

window["lazyLoad"] = {
    ActualPage: 0,
    LoadingPage: 0,
    MaxPage: 9999,
    LoadingAll: 0,
    IsFullscreen: "N",
    Page: {},
    Pages: [],
    Dispatcher: null,
	Title: "",

    Start: function () {
        var path = location.pathname.split("/");
        var imgKey = path[2];
        var page = path[3].split("-")[1];
        var i6 = $("#i6").innerHTML;
        var i7 = $("#i7").innerHTML;

        this.Pages.push({ imgKey, page, loaded: true, i6, i7 });
        this.Page = { imgKey, page, loaded: true, i6, i7 };
        this.ActualPage = page;
        this.MaxPage = parseInt($$("#i2 .sn div span")[1].innerText);
		this.Title = document.title;

        document.querySelector(".dp").innerHTML += "&nbsp; <a href='javascript:lazyLoad.LoadAll();'>Load All</a>"

        if (localStorage["lazyLoad.Fullscreen"] != null){
            this.IsFullscreen = localStorage["lazyLoad.Fullscreen"];
			
			if(this.IsFullscreen == "Y") {
				$("#i3").className = "fullscreen";
				setTimeout(() => window.scrollTo(0, getOffset($("#i3")).top), 100);
            }
		}
        else
            localStorage["lazyLoad.Fullscreen"] = "N";

        this.CheckButtons();

    },
    CheckLink: function (a) {
        var pageInfo = a.onclick.toString();
        pageInfo = pageInfo
            .substr(pageInfo.indexOf("load_image(") + 11)
            .replace(")\n}", "")
            .replace(/'/g, '')
            .split(',');

        if (pageInfo.length != 2)
            return;

        this.UpdateButtons(a, pageInfo[0]);
        var hasPage = this.Pages.filter(e => e.page == pageInfo[0]);

        if (hasPage.length == 0)
            this.Pages.push({ imgKey: pageInfo[1].trim(), page: pageInfo[0], loaded: false, i6: "", i7: "" });
    },
    UpdateButtons: function (a, page) {
        a.removeAttribute("href");
        a.removeAttribute("onclick");
        a.role = "button";
        a.onclick = () => lazyLoad.Load(page);

        a.querySelector("img").removeAttribute("onerror");
        a.querySelector("img").onerror = () => {
            var img = this;

            if (!img.hasOwnProperty('retryCount')) {
                img.retryCount = 0;
                img.base_url = img.src;
            }

            if (img.retryCount < 10) {
                setTimeout(() => img.src = img.base_url + "?" + img.retryCount, 1000);
            }

            this.src += "?" + new Date();
        };

    },

    Load: function (page, isLoadAll = false) {
		if((isLoadAll && this.LoadingPage > 0) ||
		  (!isLoadAll && this.LoadingPage > 0 && this.LoadingAll == 0) ||
		  this.ActualPage == page)
			return;
		
		if(!isLoadAll && this.LoadingPage > 0 && this.LoadingAll > 0) {
			var tmpPage = this.Pages.filter(e => e.page == page)[0];
			
			if (tmpPage && tmpPage.loaded && tmpPage.page == page) {
				this.LoadImage(tmpPage);
				this.AddHistory(tmpPage);
			}
			
			return;
		}
		
        //if (this.LoadingPage > 0)
        //	return;

        var Page = this.Pages.filter(e => e.page == page)[0];
        this.LoadingPage = parseInt(page);

        if (!isLoadAll)
            this.AddHistory(Page);

        if (Page.loaded) {
            this.LoadImage();
        } else {
            if (this.Dispatcher != undefined)
                return false;

            var page = Page.page;
            var imgkey = Page.imgKey;
            var dto = { method: "showpage", gid, page, imgkey, showkey };

            this.Request(dto);

            return true;
        }
    },
    LoadAll: function () {
		if(lazyLoad.LoadingAll == 0) {
			document.title = "Loading..."
			lazyLoad.LoadingAll = setInterval(o => {
				if (lazyLoad.LoadingPage != 0)
					return; // WAIT

				var notLoaded = lazyLoad.Pages.filter(e => e.loaded == false);

				if (notLoaded.length > 0) {
					lazyLoad.Load(notLoaded[0].page, true);
					return;
				}

				document.title = lazyLoad.Title;
				clearInterval(lazyLoad.LoadingAll);
				lazyLoad.LoadingAll = 0;
			}, 1000);
		} else {
			document.title = lazyLoad.Title;
			clearInterval(lazyLoad.LoadingAll);
			lazyLoad.LoadingAll = 0;
		}
		


    },

    AddHistory: function (Page) {
        if (history.pushState) {
            var page = Page.page;
            var imgkey = Page.imgKey;

            var destiny = `${location.origin}/s/${imgkey}/${gid}-${page}`;

            history.pushState({ page, imgkey }, document.title, destiny);
        }
    },
    Fullscreen: function (Page) {
        this.IsFullscreen = this.IsFullscreen == "N" ? "Y" : "N";
        localStorage["lazyLoad.Fullscreen"] = this.IsFullscreen;

        if (this.IsFullscreen == "Y") {
            $("#i3").className = "fullscreen";
			window.scrollTo(0, getOffset($("#i3")).top);
		}
        else
            $("#i3").className = "";
    },

    LoadImage: function (tmpPage) {
		if(tmpPage == null) {
			this.ActualPage = this.LoadingPage;
			this.Page = this.Pages.filter(e => e.page == this.ActualPage)[0];
		} else {
			this.Page = tmpPage;
			this.ActualPage = tmpPage.page;
		}
		

        $$(".images").forEach(e => e.style.display = "none");
        $(`#img_${this.ActualPage}`).style.display = "unset";

        $("#i2 .sn div span").innerText = this.ActualPage;
        $("#i4 .sn div span").innerText = this.ActualPage;

        $$("#next").forEach(a => { this.UpdateButtons(a, this.ActualPage + 1 > this.MaxPage ? this.MaxPage : this.ActualPage + 1) });
        $$("#prev").forEach(a => { this.UpdateButtons(a, this.ActualPage - 1 < 1 ? 1 : this.ActualPage - 1) });

        $("#i6").innerHTML = this.Page.i6;
        $("#i7").innerHTML = this.Page.i7;

        window.scrollTo(0, getOffset($("#i3")).top);

		if(tmpPage == null)
			this.LoadingPage = 0;
    },
    CheckButtons: function (i2 = $$("#i2 .sn > a"), i3 = $$("#i3 > a:not(.images)"), i4 = $$("#i4 .sn > a")) {
        //var i2 = $$("#i2 .sn > a");
        //var i3 = $$("#i3 > a:not(.images)");
        //var i4 = $$("#i4 .sn > a");

        i2.forEach(a => { this.CheckLink(a) });
        i3.forEach(a => {
            this.CheckLink(a)
            a.id = `img_${this.ActualPage}`;
            a.className = "images";
        });
        i4.forEach(a => { this.CheckLink(a) });

        if ($("#i2 > div:not(.sn)"))
            $("#i2 > div:not(.sn)").remove();
        if ($("#i4 > div:not(.sn)"))
            $("#i4 > div:not(.sn)").remove();
    },

    Request: function (dto) {
        this.Dispatcher = new XMLHttpRequest();
        //var api_url = "https://exhentai.org/api.php";
        //var api_url = "https://api.e-hentai.org/api.php"
		
        this.Dispatcher.open("POST", api_url);
        this.Dispatcher.setRequestHeader("Content-Type", "application/json");
        this.Dispatcher.withCredentials = true;
        this.Dispatcher.onreadystatechange = this.Image;
        this.Dispatcher.send(JSON.stringify(dto));
    },
    Image: function () {
        var jSonResp = lazyLoad.Response();

        if (jSonResp != false) {
            if (lazyLoad.LoadingAll == 0) {
                history.replaceState({
                    page: jSonResp.p,
                    imgkey: jSonResp.k,
                    json: jSonResp,
                    expire: get_unixtime() + 300 // SleepTime in ms
                }, document.title, base_url + jSonResp.s);
            }

            lazyLoad.ApplyJson(jSonResp);
            lazyLoad.Dispatcher = undefined;
        }
    },
    Response: function () {
        if (this.Dispatcher.readyState == 4)
            if (this.Dispatcher.status == 200)
                return JSON.parse(this.Dispatcher.responseText);
            else {
                var page = this.LoadingPage;
                setTimeout(() => lazyLoad.Load(page), 1500);
            }

        return false;
    },
    ApplyJson: function (json) {
        var Page = this.Pages.find(e => e.page == this.LoadingPage);
        Page.i6 = json.i6;
        Page.i7 = json.i7;
        Page.loaded = true;

        this.CheckJsonButtons(json);

        if (this.LoadingAll == 0) {
            this.LoadImage();
        } else {
            this.LoadingPage = 0;
        }
    },
    CheckJsonButtons: function (json) {
        // i2
        var i2 = document.createElement("div");
        i2.style.display = "none";
        i2.innerHTML = json.n + json.i;
        i2 = i2.querySelectorAll(".sn > a");


        // i3
        //Load Image
        var a = document.createElement('a');
        a.style.display = "none";
        a.id = `img_${this.LoadingPage}`;
        a.className = "images";
        a.role = "button";

        if (this.LoadingPage < this.MaxPage) {
            var next = this.LoadingPage + 1;
            a.onclick = () => lazyLoad.Load(next);
        }

        var i3 = json.i3.substr(json.i3.indexOf("<img"))
        i3.substr(0, i3.indexOf("</a>"))

        a.innerHTML = i3;
        $("#i3").appendChild(a);

        a.querySelector("img").removeAttribute("onerror");
        a.querySelector("img").onerror = () => setTimeout(() => lazyLoad.Load(this.LoadingPage), 1500);


        // i4
        var i4 = document.createElement("div");
        i4.style.display = "none";
        i4.innerHTML = json.i + json.n;
        i4 = i4.querySelectorAll(".sn > a");

        this.CheckButtons(i2, $$("#i3 > a:not(.images)"), i4);
    }
};

lazyLoad.Start();



//var l = {
//	"p": 11,
//	"s": "s/2209615fc6/1798805-11",
//	"n": "<div class=\"sn\"><a onclick=\"return load_image(1, '67c0d7788e')\" href=\"https://exhentai.org/s/67c0d7788e/1798805-1\"><img src=\"https://exhentai.org/img/f.png\" /></a><a id=\"prev\" onclick=\"return load_image(10, 'e8794ee58b')\" href=\"https://exhentai.org/s/e8794ee58b/1798805-10\"><img src=\"https://exhentai.org/img/p.png\" /></a><div><span>11</span> / <span>26</span></div><a id=\"next\" onclick=\"return load_image(12, 'b1d6679a0c')\" href=\"https://exhentai.org/s/b1d6679a0c/1798805-12\"><img src=\"https://exhentai.org/img/n.png\" /></a><a onclick=\"return load_image(26, 'a444926416')\" href=\"https://exhentai.org/s/a444926416/1798805-26\"><img src=\"https://exhentai.org/img/l.png\" /></a></div>",
//	"i": "<div>KAZAMA_DoJo_Mucc_I_Want_This_Woman_From_Another_World_to_Change_Jobs_2_011_x3200_2D_Market.jpg :: 1280 x 1780 :: 390.1 KB</div>",
//	"k": "2209615fc6",
//	"i3": "<a onclick=\"return load_image(12, 'b1d6679a0c')\" href=\"https://exhentai.org/s/b1d6679a0c/1798805-12\"><img id=\"img\" src=\"https://tdsblzi.kahtzhdaxmog.hath.network:31512/h/3cf10f6ded38118c6958b905f1570f5684ff7799-399423-1280-1780-jpg/keystamp=1607900100-94b5508ac9;fileindex=87358448;xres=1280/KAZAMA_DoJo_Mucc_I_Want_This_Woman_From_Another_World_to_Change_Jobs_2_011_x3200_2D_Market.jpg\" style=\"width:1280px;height:1780px\" onerror=\"this.onerror=null; nl('31512-446638')\" /></a>",
//	"i5": "<div class=\"sb\"><a href=\"https://exhentai.org/g/1798805/4590622ed1/\"><img src=\"https://exhentai.org/img/b.png\" referrerpolicy=\"no-referrer\" /></a></div>",
//	"i6": " &nbsp; <img src=\"https://exhentai.org/img/mr.gif\" class=\"mr\" /> <a href=\"https://exhentai.org/?f_shash=2209615fc6c8e167acc8110b6fe9c9bcd5409486&amp;fs_from=KAZAMA_DoJo_Mucc_I_Want_This_Woman_From_Another_World_to_Change_Jobs_2_011_x3200_2D_Market.jpg+from+%5BKAZAMA+DoJo+%28Mucc%29%5D+Isekai+no+Onnanoko+ni+Job+Change+Shite+Moraitai+2+%5BEnglish%5D+%7B2d-market.com%7D+%5BDecensored%5D+%5BDigital%5D\">Show all galleries with this file</a>  &nbsp; <img src=\"https://exhentai.org/img/mr.gif\" class=\"mr\" /> <a href=\"#\" id=\"loadfail\" onclick=\"return nl('31512-446638')\">Click here if the image fails loading</a> ",
//	"i7": " &nbsp; <img src=\"https://exhentai.org/img/mr.gif\" class=\"mr\" /> <a href=\"https://exhentai.org/fullimg.php?gid=1798805&amp;page=11&amp;key=mhsnukg9kmm\">Download original 2301 x 3200 4.25 MB source</a>",
//	"si": 31512,
//	"x": "1280",
//	"y": "1780"
//}