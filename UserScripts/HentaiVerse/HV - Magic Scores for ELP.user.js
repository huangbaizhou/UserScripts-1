// ==UserScript==
// @copyright  2012+, You
// @name		  HV - Magic Scores for ELP
// @namespace     Hentai Verse
// @description   Displays a list of magic scores. Score = MDB * (1+EDB/100) * (1 + crit/200)
// @icon          http://e-hentai.org/favicon.ico
// @match		  *://*.hentaiverse.org/?s=Bazaar&ss=es*
// @match		  *://*.hentaiverse.org/?s=Bazaar&ss=l*
// @match		  *://*.hentaiverse.org/?s=Character&ss=eq*
// @match		  *://*.hentaiverse.org/?s=Character&ss=in*
// @match		  *://*.hentaiverse.org/pages/showequip.php?eid=*&key=*
// @match		  *://*.hentaiverse.org/equip/*
// @match		  *://*.hentaiverse.org/?s=Battle&ss=iw*
// @match         http://e-hentai.org/index.php?showtopic=*
// @version		  2.0.3.2
// @run-at		  document-end
// ==/UserScript==

var useCritChance = true;

/* * * * * * * * * * * * * * * * * * * * * * * */

// fix statistics pane (v1 used to do that)
if (document.getElementById('stats_pane')) {
	var style = document.createElement('style');
	style.innerHTML = '#stats_pane > div { height: auto !important; }';
	document.head.appendChild(style);
}

if (!document.querySelector('#popup_box, #showequip')) return;

/* * * * * * * * * * * * * * * * * * * * * * * */

var Parser = {

	parse: function(source) {

		// decorator for _parseObject
		var result;
		if (!!source && source.constructor == String) {
			var tokens = source.match(/'.+?'/g), temp = document.createElement('div');
			temp.innerHTML = tokens[2].slice(1,tokens[2].length-1);
			result = Parser._parseObject(temp.firstElementChild);
			result.Info.Name = tokens[1].slice(1,tokens[1].length-1);
			return result;
		}

		var doc = !!source?source:document;
		if (doc.querySelector('#showequip')) {
			result = Parser._parseObject(doc.querySelector('#showequip > #equip_extended > div'));
			result.Info.Name = doc.querySelector('#showequip > div').textContent;
			return result;
		}

		var popup = doc.querySelector('#popup_box');
		if (popup && popup.childElementCount) {
			result = Parser._parseObject(doc.querySelector('#popup_box > div > .eq'));
			result.Info.Name = doc.querySelector('#popup_box > div').textContent;
			return result;
		}
	},

	_hasChildren: function(object) {
		if (!object) return false;
		for (var x in object) return true;
		return false;
	},

	_filterSection: function(section,name) {

		if (!section) return null;
		if (name == 'Spell Damage' || name == 'Info') return section;

		var allowed =
			name == 'Stats' ? ['Magic Damage','Magic Crit Chance','Spell Crit Damage'] :
			name == 'Proficiency' ? ['Elemental','Divine','Forbidden'] :
			name == 'Primary Attributes' ? ['Intelligence','Wisdom'] :
			null;

		if (!allowed) return null;

		else for (var x in section) {
			if (allowed.indexOf(x) == -1)
				delete section[x];
		}

		if (!Parser._hasChildren(section)) return null;

		return section;

	},

	_parseObject: function(source) {

		if (source.constructor == String) {
			var temp = document.createElement('div');
			temp.innerHTML = source;
			return parseObject(temp);
		}

		var res = { Info: { } }, n = source.childNodes.length;
		var section = null, sectionContents = { };
		for (var i=0;i<n;i++) {

			var child = source.childNodes[i];

			// check for equipment info
			if (!child.className) {
				var tokens;
				var childText = child.textContent;
			/*** add code***/
				if (childText.indexOf('Soulbound') != -1) {
			       tokens = childText.match(/^\s*(.+?)\sSoulbound\s*$/);
			       res.Info.Type = tokens[1].trim();
				}
			/***************/

				if (childText.indexOf('Level') != -1) {
					// type, level and EXP
					// new format in HV-0.82; we actually capture more than we need here,
					// but so did the old version...
					tokens = childText.match(/^\s*(.+?)\s+Level (\w+)\s+(.+)$/);
					res.Info.Type = tokens[1].trim();
				}
				continue;
			}

			// check for section name
			if (!child.firstElementChild.childElementCount && child.textContent.trim().length) {

				var temp = Parser._filterSection(sectionContents,section || 'Stats');
				if (Parser._hasChildren(temp)) // previous section or stats
					res[section||'Stats'] = temp; // clone

				section = child.firstElementChild.textContent;
				sectionContents = { };

			}

			if (section && !/(Spell Damage|Proficiency|Primary Attributes)/.test(section))
				section = null;

			// retrieve section contents
      		var targets = child.getElementsByTagName('div'), target = null, attributeName = null, attributeValue = null;

      		for (var j=0;j<targets.length;j++) {
        		target = targets[j];
		        if (target.textContent.length === 0) continue;
	    	    if (target.textContent.trim()[0] == '%') continue;

	    	    target = target.textContent.split('+');
	   		    if (target.length > 1 && target[0].length > 0 && target[1].length > 0) {
	          		attributeName = target[0].trim();
	          		attributeValue = target[1].trim();
	          		sectionContents[attributeName] = parseFloat(attributeValue);
	        	} else {
	          		if (target.length == 1 || target[0].length > 0) // attribute name
	            		attributeName = target[0];
	          		else { // attribute value
	           			attributeValue = target[1];
	            		sectionContents[attributeName] = parseFloat(attributeValue);
	          		}
	        	}
	      	}
	    }

		var temp = Parser._filterSection(sectionContents,section || 'Stats');
		if (Parser._hasChildren(temp)) // previous section or stats
			res[section||'Stats'] = temp; // clone
		return res;

	}

};

/* * * * * * * * * * * * * * * * * * * * * * * */

var Cruncher = {

	_computeScore: function(magicDamage, EDB, proficiency, critChance, critDamage) {

		return magicDamage * (1 + EDB/100) * (useCritChance ? (1 + critChance * critDamage) : 1);

	},

	_getTotalStat: function(stat,multiplicative) {

		// multiplicative = false => returns stat1+stat2+stat3
		// multiplicative = true => returns (1-stat1)*(1-stat2)*...

		var result = multiplicative ? 1 : 0;
		for (var x in Cruncher.data.equipment) {
			for (var y in Cruncher.data.equipment[x]) {
				if (y != stat) continue;
				if (multiplicative) result *= (1 - Cruncher.data.equipment[x][y]/100);
				else result += Cruncher.data.equipment[x][y];
			}
		}

		return result;

	},

	update: function(overwrite) {

		function isEqual(obj1, obj2) {
			for (var x in obj1) {
				if (!obj2[x]) return false;
				for (var y in obj1[x]) {
					if (!obj2[x].hasOwnProperty(y) || obj2[x][y] != obj1[x][y])
					return false;
				}
			}
			return true;
		}

		// reset
		Cruncher.data = JSON.parse(JSON.stringify(Cruncher.originalData)); // clone
		if (!overwrite) return;

		var slot = Controller._extractSlot(overwrite.Info.Name,overwrite.Info.Type);
		var target = Cruncher.data.equipment[slot] || { };

		if (isEqual(overwrite,target)) return;

		// update primary attributes
		if (!overwrite['Primary Attributes']) overwrite['Primary Attributes'] = { };
		if (!target['Primary Attributes']) target['Primary Attributes'] = { };

		['Intelligence','Wisdom'].forEach(function(stat) {
			Cruncher.data.player.attributes[stat] += (overwrite['Primary Attributes'][stat] || 0) -
				(target['Primary Attributes'][stat] || 0);
			Cruncher.data.player.attributes[stat] = Math.max(0,Cruncher.data.player.attributes[stat]);
		});

		// update proficiencies
		if (!overwrite.Proficiency) overwrite.Proficiency = { };
		if (!target.Proficiency) target.Proficiency = { };

		['Elemental','Divine','Forbidden'].forEach(function(prof) {
			Cruncher.data.player.proficiencies[prof] += (overwrite.Proficiency[prof] || 0) -
				(target.Proficiency[prof] || 0);
			Cruncher.data.player.proficiencies[prof] = Math.max(0,Cruncher.data.player.proficiencies[prof]);
		});

		// update EDB
		if (!overwrite['Spell Damage']) overwrite['Spell Damage'] = { };
		if (!target['Spell Damage']) target['Spell Damage'] = { };

		['Fire','Cold','Elec','Wind','Holy','Dark'].forEach(function(EDB) {
			Cruncher.data.player.EDB[EDB] += (overwrite['Spell Damage'][EDB] || 0) -
				(target['Spell Damage'][EDB] || 0);
			Cruncher.data.player.EDB[EDB] = Math.max(0,Cruncher.data.player.EDB[EDB]);
		});

		// update critical
		if (!overwrite.Stats) overwrite.Stats = { };
		if (!target.Stats) target.Stats = { };

		if (overwrite.Stats['Magic Critical'] || target.Stats['Magic Critical']) {
			var temp = 1-Cruncher.data.player.critical;
			temp /= 1 - (target.Stats['Magic Critical'] || 0)/100;
			temp *= 1 - (overwrite.Stats['Magic Critical'] || 0)/100;
			Cruncher.data.player.critical = 1-temp;
		}

		//update MDB for Radiant equipment
		if (overwrite.Stats['Magic Damage'] || target.Stats['Magic Damage']) {
			//MDB changed; we need recalculate MDB of all slot
			if (overwrite.Stats['Magic Damage'])
				Cruncher.data.player.MDB += overwrite.Stats['Magic Damage'];
			if (target.Stats['Magic Damage'])
				Cruncher.data.player.MDB -= target.Stats['Magic Damage'];
		}
		//update CritDamage for Mystic equipment
		if (overwrite.Stats['Spell Crit Damage'] || target.Stats['Spell Crit Damage']) {
			//MDB changed; we need recalculate MDB of all slot
			if (overwrite.Stats['Spell Crit Damage'])
				Cruncher.data.player.CritDamage += overwrite.Stats['Spell Crit Damage'] / 100;
			if (target.Stats['Spell Crit Damage'])
				Cruncher.data.player.CritDamage -= target.Stats['Spell Crit Damage'] / 100;
		}
		// update object
		Cruncher.data.equipment[slot] = overwrite;

	},

	_getMagicDamage: function() {

		if (!Cruncher.data) Cruncher.update();
		if (!Cruncher.data.equipment.Main.Stats) Cruncher.data.equipment.Main.Stats = { };

		var weaponName = Cruncher.data.equipment.Main.Info;
		if (weaponName) weaponName = weaponName.Name;
		else weaponName = '';

		//New formula is (don't ask): log(3330 + stat1 * 2 + stat2, 1.0003) - 27039.81
		MDB = Cruncher.data.player.MDB +
			Math.log(Cruncher.data.player.attributes.Intelligence * 2 +
			Cruncher.data.player.attributes.Wisdom + 3330) / Math.log(1.0003) - 27039.81 +
			(/ Staff /i.test(weaponName) ? (Cruncher.data.player.proficiencies.Staff/2) : 0);
		return MDB;
	},

	getScores: function() {

		if (!Cruncher.originalData) return;
		if (!Cruncher.data) Cruncher.update();
		var result = { };
		var MDB = Cruncher._getMagicDamage();
		var proficiencies = Cruncher.data.player.proficiencies;

		['Fire','Cold','Elec','Wind','Holy','Dark'].forEach(function(EDB) {

			var proficiency =
				EDB == 'Holy' ? (proficiencies.Divine || 0) :
				EDB == 'Dark' ? (proficiencies.Forbidden || 0) :
				(proficiencies.Elemental || 0);

			result[EDB] = Cruncher._computeScore(
				MDB,
				Cruncher.data.player.EDB[EDB],
				proficiency,
				Cruncher.data.player.critical,
				Cruncher.data.player.CritDamage
			);

		});
		return result;

	}

};

/* * * * * * * * * * * * * * * * * * * * * * * */

var Controller = {

	_extractSlot: function(name,slot) {
		if (/Weapon|Staff/.test(slot)) return 'Main';
		if (/Shield/.test(slot)) return 'Off';
		if (/Cap|Helm|Coif/.test(name)) return 'Helmet';
		if (/Robe|Armor|Breastplate|Cuirass|Hauberk/.test(name)) return 'Body';
		if (/Gloves|Gauntlets|Mitons/.test(name)) return 'Hands';
		if (/Pants|Leggings|Greaves|Chausses/.test(name)) return 'Legs';
		return 'Feet';
	},

	saveData: function() {

		function getStat(section,stat) {
			var result = statistics.match(new RegExp(section + '(?:.|\n)+?' + '([\\d\\.]+)\\s*\\n[%\\s\\t]+' + stat,'i'))[1];
			return result == 'None' ? 0 : parseFloat(result);
		}

		var data;
		if (/slot/.test(window.location.href) && localStorage.hasOwnProperty('scoreData'))
			data = JSON.parse(localStorage.getItem('scoreData'));
		else
			data = { player: { }, equipment: { } };

		// equipment
		document.querySelectorAll('div[onmouseover^=equips]').forEach(function(x) {
			var item_number = x.getAttribute('onmouseover').match(/(\d+)/)[1];
			var temp_equip = dynjs_equip[item_number];
			var item = Parser.parse('\'-\'\''+temp_equip.t+'\'\''+temp_equip.d+'\'');
			var slot = Controller._extractSlot(item.Info.Name,item.Info.Type);
			data.equipment[slot] = item;
		});

		if (!data.equipment.Main) data.equipment.Main = { };

		// player stats
		var statistics = document.getElementById('stats_pane').textContent;

		data.player.proficiencies = { };
		['Staff','Elemental','Divine','Forbidden'].forEach(function(x) {
			data.player.proficiencies[x] = getStat('Effective Proficiency',x);
		});

		data.player.EDB = { };
		['Fire','Cold','Elec','Wind','Holy','Dark'].forEach(function(x) {
			data.player.EDB[x] = getStat('Spell Damage Bonus',x);
		});

		data.player.attributes = { };
		['Intelligence','Wisdom'].forEach(function(x) {
			data.player.attributes[x] = getStat('Effective Primary Stats',x);
		});

		data.player.critical = parseFloat(statistics.match(/magical(?:.|\n)+?([\d\.]+).*\n\s*% crit chance/i)[1])/100;

		//Add 2 new property for Radiant and Mystic equipment
		data.player.MDB = 0;
		data.player.CritDamage = 0.5;	//default 50% spell crit damage
		['Main', 'Off', 'Helmet', 'Body', 'Hands', 'Legs', 'Feet'].forEach(function(slotitem) {
			var equipitem = data.equipment[slotitem] || { };
			if (equipitem && equipitem.Stats && equipitem.Stats['Magic Damage'])
				data.player.MDB += equipitem.Stats['Magic Damage'];
			if (equipitem && equipitem.Stats && equipitem.Stats['Spell Crit Damage'])
				data.player.CritDamage += equipitem.Stats['Spell Crit Damage'] / 100;
		});

		// original scores
		Cruncher.originalData = data;
		data.scores = Cruncher.getScores();

		localStorage.setItem('scoreData',JSON.stringify(data));
	},

	loadData: function() {
		var data = JSON.parse(localStorage.getItem('scoreData'));
		if (!data) return;
		Cruncher.originalData = data;
	},

	getTarget: function() {
		return document.querySelector('#popup_box > div + div > div, #showequip > #equip_extended > div, .eq');
	},

	keyEvent: function(key) {
		var equipment = document.getElementById('Equipment');   //add code
		function getColor(n) {
			if (showOriginal) return '#5C0D11';
			if (n > 0) return 'darkgreen';
			if (n < 0) return 'red';
			return 'dodgerblue';
		}

		if(key != 's') return;

		if (equipment) equipment.parentElement.removeChild(equipment);  //add code
		var source = Parser.parse(), slot = Controller._extractSlot(source.Info.Name,source.Info.Type);
		if (source === null)
			alert('Null result of parse!');
		Cruncher.update(source);

		if (document.getElementById('MagicScores') !== null) {
			Controller.lastResult.parentNode.removeChild(Controller.lastResult);
			Controller.getTarget().style.display = null;
			return;
		}

		var scores = Cruncher.getScores(), differentialScores = { }, showOriginal = true;
		for (var x in Cruncher.originalData.scores) {
			differentialScores[x] = parseInt(scores[x] - Cruncher.originalData.scores[x],10);
			scores[x] = parseInt(scores[x]); // for showOriginal
			if (differentialScores[x] !== 0) showOriginal = false;
		}
		if (showOriginal) differentialScores = scores;

		var div = document.createElement('div');
		div.id = 'MagicScores';
		var HTML = '<div style="text-align: center; font-size: 120%;">Magic Scores</div>' +
			'<div style="border-top:1px solid #A47C78; margin:5px auto 2px; padding-top:2px">';

		for (var x in differentialScores) {
			HTML += '<div style="float:left; width:155px;"><div style="float:left; width:99px; padding:2px; text-align:center">' +
				x + '</div><div style="float:left; width:35px; padding:2px 0 2px 2px">' +
				(useCritChance?'':'<i>') + '<strong style="color: ' + getColor(differentialScores[x]) + '">' +
				(differentialScores[x] >= 0 ? '+' : '' ) + differentialScores[x] + '</strong>' + (useCritChance?'':'</i>') + '</div></div>';
		}
		HTML += '</div><div style="clear:both">';
		div.innerHTML = HTML;

		var target = Controller.getTarget();
		target.parentNode.insertBefore(div,target.nextSibling);
		target.style.display = 'none';

		Controller.lastResult = div;

	}

};

/* * * * * * * * * * * * * * * * * * * * * * * */

if (/ss=eq/.test(window.location.href) && !document.querySelector('#compare_pane')) Controller.saveData();
else Controller.loadData();

/**** add code ****/

if (Cruncher.originalData) {
	window.addEventListener('keyup', function(e){
		var key = String.fromCharCode(e.keyCode).toLowerCase();
		Controller.keyEvent(key);
	},false);
}

window.addEventListener('message', function(e) {Controller.keyEvent(e.data);});

/******************/
