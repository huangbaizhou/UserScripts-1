// ==UserScript==
// @name        HV - LazyLoad
// @namespace   Violentmonkey Scripts
// @match       https://e-hentai.org/s/*
// @match       https://exhentai.org/s/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/13/2020, 5:02:40 PM
// ==/UserScript==

var $ = e => document.querySelector(e);
var $$ = e => document.querySelectorAll(e);

var style = `
<style>
	#i1 {
		width: unset !important;
		max-width: unset !important;
		background: #34353b;
		border: unset;
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
	Page: {},
	Pages: [],
	Dispatcher: null,

	Start: function () {
		var path = location.pathname.split("/");
		var imgKey = path[2];
		var page = path[3].split("-")[1];
		var i6 = $("#i6").innerHTML;
		var i7 = $("#i7").innerHTML;

		this.Pages.push({ imgKey, page, loaded: true, i6, i7 });
		this.Page = { imgKey, page, loaded: true, i6, i7 };
		this.ActualPage = page;
		this.MaxPage = parseInt($$("#i2 .sn div span")[1].innerText)

		this.LoadButtons();

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
		a.querySelector("img").onerror = () => setTimeout(() => lazyLoad.Load(this.LoadingPage), 1500);

	},

	Load: function (page) {
		if (this.LoadingPage > 0)
			return;

		var Page = this.Pages.filter(e => e.page == page)[0];
		this.LoadingPage = parseInt(page);

		if (Page.loaded) {
			this.LoadImage();
		} else {
			if (this.Dispatcher != undefined)
				return false;

			if (history.pushState) {
				var page = Page.page;
				var imgkey = Page.imgKey;

				var destiny = `${location.origin}/s/${imgkey}/${gid}-${page}`;
				var dto = { method: "showpage", gid, page, imgkey, showkey };

				this.Request(dto);
				history.pushState({ page, imgkey }, document.title, destiny);
			}

			return true;
		}
	},
	LoadImage: function () {
		this.ActualPage = this.LoadingPage;
		this.Page = this.Pages.filter(e => e.page == this.ActualPage)[0];

		$$(".images").forEach(e => e.style.display = "none");
		$(`#img_${this.ActualPage}`).style.display = "unset";

		$("#i2 .sn div span").innerText = this.ActualPage;
		$("#i4 .sn div span").innerText = this.ActualPage;

		$$("#next").forEach(a => { this.UpdateButtons(a, this.ActualPage + 1 > this.MaxPage ? this.MaxPage : this.ActualPage + 1) });
		$$("#prev").forEach(a => { this.UpdateButtons(a, this.ActualPage - 1 < 1 ? 1 : this.ActualPage - 1) });

		$("#i6").innerHTML = this.Page.i6;
		$("#i7").innerHTML = this.Page.i7;

		this.LoadingPage = 0;
	},
	LoadButtons: function () {
		var i2 = $$("#i2 .sn > a");
		var i3 = $$("#i3 > a:not(.images)");
		var i4 = $$("#i4 .sn > a");

		i2.forEach(a => { this.CheckLink(a) });
		i3.forEach(a => {
			this.CheckLink(a)
			a.id = `img_${this.ActualPage}`;
			a.className = "images";
		});
		i4.forEach(a => { this.CheckLink(a) });

		$("#i2 > div:not(.sn)").remove();
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
			history.replaceState({
				page: jSonResp.p,
				imgkey: jSonResp.k,
				json: jSonResp,
				expire: get_unixtime() + 300 // SleepTime in ms
			}, document.title, base_url + jSonResp.s);

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
		window.scrollTo(0, 0);

		var Page = this.Pages.find(e => e.page == this.LoadingPage);
		Page.i6 = json.i6;
		Page.i7 = json.i7;
		Page.loaded = true;

		$("#i2").innerHTML = json.n + json.i;
		//$("#i3").innerHTML += json.i3;
		$("#i4").innerHTML = json.i + json.n;


		//Load Image
		var a = document.createElement('a');
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

		this.LoadButtons();
		this.LoadImage();
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