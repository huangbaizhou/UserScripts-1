// ==UserScript==
// @name		HV - Random Encounter Notification
// @namespace   Hentai Verse
// @icon        http://e-hentai.org/favicon.ico
// @author		sigo8, LangTuTaiHoa, GaryMcNabb, Owyn, nekolor
// @version		1.3.4.6
// @match		https://hentaiverse.org/*
// @exclude		https://hentaiverse.org/pages/showequip*
// @run-at		document-end
// @grant none
// ==/UserScript==

var battleLog = document.getElementById("togpane_log"),
	rawDate, timeToDawn = {}, logRows, timerDiv, timerLink, time,timeF, timerID, minute, second;
var reUrl = "https://e-hentai.org/news.php";
const intervalTimer = 2000;

if (!battleLog) {
	/*logRows = battleLog.firstElementChild.firstElementChild.children;
	if (logRows[0].firstElementChild.textContent === "0" && logRows[logRows.length-2].lastElementChild.textContent[13] === "r") {
		updateTimeToDawn();
		localStorage.lastRandomEncounter = ((!((timeToDawn.hour === 23) && (timeToDawn.minute >= 30))) ? Date.now() : Date.now() - (((timeToDawn.minute - 30) * 60000) + (timeToDawn.second * 1000)) );
	}
	} else {*/
	function updateTimeToDawn() {
	rawDate = new Date();
	timeToDawn = {
		hour: rawDate.getUTCHours(),
		minute: rawDate.getUTCMinutes(),
		second: rawDate.getUTCSeconds()
	}
	}
	function timerUpdate() {
		time = timeF - (Date.now() - 1800000);
		time = Math.round(time / 1000);
		minute = Math.floor(time / 60);
		second = time - (minute * 60);
		if (minute < 0) {
			timerLink.href = reUrl;
			timerLink.style.setProperty("color", "red");
			timerLink.innerHTML = "Ready";
			clearInterval(timerID);
			return;
		}
		timerLink.innerHTML = minute + ":" + (second < 10 ? "0" : "") + second;
	}
	function timerReset() {
		updateTimeToDawn();
		if ((timeToDawn.hour === 23) && (timeToDawn.minute >= 30)) {
			localStorage.lastRandomEncounter = Date.now() - (((timeToDawn.minute - 30) * 60000) + (timeToDawn.second * 1000));
			minute = 59 - timeToDawn.minute;
			second = 60 - timeToDawn.second;
		} else {
			localStorage.lastRandomEncounter = Date.now();
			minute = 30;
			second = 0;
		}
		timerLink.innerHTML = minute + ":" + (second < 10 ? "0" : "") + second;
		timerLink.style.color = "#5C0C11";
		if (timerID) clearInterval(timerID);
		timerID = setInterval(timerUpdate, intervalTimer);
		timeF = localStorage.lastRandomEncounter;
	}

	timerDiv = document.createElement("div");
	timerLink = document.createElement("a");
	if (!localStorage.lastRandomEncounter) timerReset();
	timeF = localStorage.lastRandomEncounter;
	time = timeF - (Date.now() - 1800000);
	minute = second = 0;

	timerDiv.style.cssText = "display:block; position: absolute; top:3px; left:1250px;";
	timerLink.style.cssText = "text-decoration:none; font-size:20px; font-weight:bold; color:#5C0C11;";

	timerDiv.appendChild(timerLink);
	if (time < 0) {
		timerLink.href = reUrl;
		timerLink.style.color="red";
		timerLink.innerHTML="Ready";
	} else {
		time = Math.round(time / 1000);
		minute = Math.floor(time / 60);
		second = time - (minute * 60);
		timerLink.innerHTML = minute + ":" + (second < 10 ? "0" : "") + second;
		timerID = setInterval(timerUpdate, intervalTimer);
	}
	timerLink.onclick = function(e){ if (!e.shiftKey) {timerReset()} else {window.location = reUrl}; }
	document.body.appendChild(timerDiv);
}
