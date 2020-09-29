// ==UserScript==
// @name          HV - Inline Difficulty Changer
// @namespace     Hentai Verse
// @version       2017-06-24
// @match         *://*.hentaiverse.org/*
// @icon          http://e-hentai.org/favicon.ico
// @run-at        document-end
// ==/UserScript==


function iframeLoad() {
	var doc = changeDifficulty.iframe.contentDocument;
	if (!iframeLoad.difficulty) {
		var diff = document.getElementById('difficulty');
		diff.innerHTML = doc.getElementById('difficulty').innerHTML;
		diff.style.display = null;
		
		if (changeDifficulty.loading.parentNode) changeDifficulty.loading.parentNode.removeChild(changeDifficulty.loading);
		//if (dd.select.parentNode) dd.select.parentNode.removeChild(dd.select);
		
		changeDifficulty.iframe.parentNode.removeChild(changeDifficulty.iframe);
		delete changeDifficulty.iframe;
		
		dd();
		return;
	}
	
	var targets = doc.querySelectorAll('#settings_challenge input[type="radio"]');
//	if (!targets.length)
//	var targets = doc.querySelectorAll('#settingsinner > div:nth-child(2) [type="radio"]');
//console.log(targets);
	var target  = targets[dd.difficulties.indexOf(iframeLoad.difficulty)];

	delete iframeLoad.difficulty;
	
	if (!target) return;
	target.checked = true;
	
	doc.querySelector('[value="Apply Changes"]').click();

}

function changeDifficulty(e) {
	name = name.toLowerCase().replace(/^(.)/,function(a) { return a.toLowerCase(); }).replace(/IWBTH/i,'IWBTH').replace(/pfudor/i,'PFUDOR');
	e.target.style.display = 'none';
	changeDifficulty.loading = e.target.parentNode.appendChild(document.createElement('div'));
	changeDifficulty.loading.innerHTML = 'Working...';
	
	if (!changeDifficulty.iframe) {
		changeDifficulty.iframe = document.body.appendChild(document.createElement('iframe'));
		changeDifficulty.iframe.style.cssText = 'width: 0px; height: 0px; overflow: hidden; white-space: nowrap; visibility: hidden;';
		changeDifficulty.iframe.addEventListener('load',iframeLoad,false);
	}
	
	iframeLoad.difficulty = e.target.children[e.target.selectedIndex].innerHTML;
	// always reload to prevent stale settings
	changeDifficulty.iframe.src = 'https://hentaiverse.org/?s=Character&ss=se';

}

function dd() {
	if (!dd.el) return;
	
	if (!dd.select) {
		dd.select = dd.el.parentNode.appendChild(document.createElement('select'));
		dd.difficulties = ['Normal','Hard','Nightmare','Hell','Nintendo','IWBTH','PFUDOR'];
	
		dd.difficulties.forEach(function(x) {
			dd.select.appendChild(document.createElement('option')).innerHTML = x;
		});
		dd.select.onchange = changeDifficulty;
	}
	
	var currentDifficulty = toText(dd.el.innerHTML)
		.replace(/^(.)/,function(a) { return a.toUpperCase(); })
			.replace(/iwbth/i,'IWBTH')
        .replace(/pfudor/i,'PFUDOR');
	
	dd.select.selectedIndex = dd.difficulties.indexOf(currentDifficulty);
	dd.select.style.cssText = 'position:absolute; margin:0; padding:0; width: 100px;';
	var elRect = dd.el.getBoundingClientRect();
	dd.select.style.top = elRect.top-6 + 'px';
	dd.select.style.left = elRect.left + 'px';
	//dd.el.style.display = 'none';
}

//graphic font unsupported
function toText(HTML) {
	return HTML.replace(/<.+?>/g,'').replace(/\sLv.+/g,'');
}

if (document.querySelector('#navbar')) {
	//var target = document.querySelector('.cit + .cit tr:last-child > td > div');
	var target = document.querySelector('#level_readout > div:nth-child(1) > div:nth-child(1)');
	target.style.cursor = 'pointer';
	target.id = 'difficulty';
	dd.el = target;
	dd();
}