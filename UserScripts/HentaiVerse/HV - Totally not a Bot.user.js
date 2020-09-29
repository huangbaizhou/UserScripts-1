// ==UserScript==
// @name       HV - Totally not a Bot
// @namespace  Hentai Verse
// @version    2.1.0
// @author     Svildr
// @match      https://hentaiverse.org/?s=Battle*
// @match      https://hentaiverse.org/?encounter=*
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==

//## Mage BoT
///TODO: Use Spirit, Defend, Focus.


/* This bot is better used with 
  ** HV Statistics (Saving Monster Stats) -- If you don`t use set ScanCreatures to false
  ** HV Inline Difficulty Changer -- If you don`t use set ChangeArenaDifficulty to false
  ** RiddleLimiter Plus -- Is recommended, but not necessary
*/

// All are in Percentage -- To remove any specific Potion change the value to -1
// Don't change the name or the type unless you know exacly what you are doing.
var Potions = {
    Active: true,
    UseMysticGem: true,
    PriorityOrder: [ "Health", "Mana", "Spirit" ],
    Health: [
        { Type: "Potion", Name: "Health Elixir", UseAt: 10 },
        { Type: "Potion", Name: "Health Potion", UseAt: 30 }, //35
        { Type: "Potion", Name: "Health Draught", UseAt: 60 }, // 40
        { Type: "Gem", Name: "Health Gem", UseAt: 50 }, //60
        { Type: "Skill", Name: "Cure", UseAt: 40 },  // 50
        { Type: "Skill", Name: "FullCure", UseAt: 20 }
    ],
    Mana: [
        { Type: "Potion", Name: "Mana Elixir", UseAt: 2 },
        { Type: "Potion", Name: "Mana Potion", UseAt: 15 },
        { Type: "Potion", Name: "Mana Draught", UseAt: 40 },
        { Type: "Gem", Name: "Mana Gem", UseAt: 55 }
    ],
    Spirit: [
        { Type: "Potion", Name: "Spirit Elixir", UseAt: -1 }, //2
        { Type: "Potion", Name: "Spirit Potion", UseAt: -1 }, //10
        { Type: "Potion", Name: "Spirit Draught", UseAt: -1 }, //30
        { Type: "Gem", Name: "Spirit Gem", UseAt: 100 } // 100
    ]
};

var scanCreatures = true,
    attack = true,
    useBuff = true,
    useDebuff = true,
    doRiddle = true,
    advanceWhenVict = true,
    autoStartArena = false, // Be aware of your items, it`ll not repair or use enchant
    startArenaWithStamina = true, // Only starts arena if you stamina is over 80%, if set to false it`ll start arena if you stamina is over 20% (afterall there is no use of doing arena if you don`t get anything)
    changeArenaDifficulty = true; // false;//  Changes difficulty to the highest you played that arena. -- works with the script "Inline Difficulty Changer"

// 1 - AoE in the Middle
// 2 - Attack the weakest
// 3 - Attack the one with the lower health
// 4 - Attack in the disposition order
var attackOrder = 3;


/*** OLD HEALING METHOD *** /
var useCureAt = 40, useFullCureAt = 20;

var useHElixirAt = 10, useHPotionAt = 30, useHDraughtAt = 60, useHGemAt = 50,  //Health 
    useMElixirAt = 2, useMPotionAt = 15, useMDraughtAt = 40, useMGemAt = 60,  //Mana
    useSElixirAt = 2, useSPotionAt = 15, useSDraughtAt = 30, useSGemAt = 100; //Spirit

var useHeal = true,
    useHealthPot = true,
    useManaPot = true,
    useSpiritPot = false,
    useGem = true;
/************/


// They`ll be used in the order;
var buffToUse = ["Spark of Life", "Absorb", "Haste", "Regen", "Protection", "Shadow Veil", "Arcane Focus", "Spirit Shield"]; // , Heartseeker
var debuffToUse = ["Imperil"]; //, "Weaken", "Slow"


/////////////////////////////////////////////////////////////////////////////////////////////
//
//  DONT CHANGE ANYTHING FROM HERE ON
//
/////////////////////////////////////////////////////////////////////////////////////////////
////#Extras
var thisUrl = window.location.href;

function $(b) {
    if (b.indexOf("#") > -1) {
        var tempNum;
        
        if ((tempNum = parseInt(b[b.indexOf("#") + 1])) != NaN) {
            b = b.replace(b[b.indexOf("#") + 1], CSS.escape(b[b.indexOf("#") + 1]))
        }
    }

    return document.querySelectorAll(b);
}

function Spell(spellName) {
    var spell = $("#" + magicSpell[spellName])[0];

    if (spell.style.opacity != "0.5") {
        spell.click();
        //console.log("Spell Used: " + spellName);
        return true;
    }

    //console.log("Could not use Spell:" + spellName); 
    return false;
}
function Item(itemType) {
    var items = $("#pane_item div[id^='ikey_']");

    items = Array.prototype.filter.call(items, function (element) {
        return RegExp(itemType).test(element.textContent);
    });

    if (items.length > 0) {
        items[0].click();

        //console.log("Item Used " + itemType);
        return true;
    }

    return false;
}
function getMonsterByName(name) {
    var monsterList = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']");

    monsterList = Array.prototype.filter.call(monsterList, function (element) {
        return RegExp(name).test(element.textContent);
    });

    if (monsterList.length > 0) {
        return monsterList[0];
    }

    return null;
}

function In(list, str) {
    for (var i = 0; i < list.length; i++)
        if (list[i].indexOf(str) > -1)
            return true;

    return false;
}
function Has(str, str2) {
    return str.indexOf(str2) > -1;
}


/////////////// KEYS
var magicSpell = {
    //Skills
    "Scan": 1011,
    "Concussive Strike": 2501,

    "Fiery Blast": 111, "Inferno": 112, "Flames of Loki": 113,  //"Fire": { 
    "Freeze": 121, "Blizzard": 122, "Fimbulvertr": 123,     //"Cold": { 
    "Shockblast": 131, "Chained Lightning": 132, "Wrath of Thor": 133,   //"Elec": { 
    "Gale": 141, "Downburst": 142, "Storms of Njord": 143, //"Wind": { 
    "Smite": 151, "Banishment": 152, "Paradise Lost": 153,   //"Holy": { 
    "Corruption": 161, "Disintegrate": 162, "Ragnarok": 163,        //"Dark": { 

    //Deprecating
    "Drain": 211, "Weaken": 212, "Imperil": 213,
    "Slow": 221, "Sleep": 222, "Confuse": 223,
    "Blind": 231, "Silence": 232, "MagNet": 233,

    //Curative
    "Cure": 311, "Regen": 312, "FullCure": 313,

    //Supportive
    "Protection": 411, "Haste": 412, "Shadow Veil": 413,
    "Absorb": 421, "Spark of Life": 422, "Spirit Shield": 423,
    "Heartseeker": 431, "Arcane Focus": 432
}

var riddleMaster = {
    "500d9639f0": "A", "c040b1cf0e": "A", "4693637779": "A", "6621d9201a": "A", "a0fe68a1e1": "A", "637a3dd556": "A", "cfdaabf41b": "A", "31d426a146": "A",
    "2260367281": "A", "86cd089cb4": "A", "52093b0bf9": "A", "b8c0a5c1f2": "A", "e61491ee54": "A", "712953d5f0": "A", "d6ebb0c744": "A", "126965ee78": "A",
    "f573e87f84": "A", "ddb1c99260": "A", "9898df62f7": "A", "a3cea27f08": "A", "2eecad477c": "A", "2e748a532e": "A", "c727bb52db": "A", "4eaf25d099": "A",
    "8e73159fd8": "A", "da7a5af305": "A", "6ae1a72220": "A", "6574e82166": "A", "68d3878db4": "A", "13fb1c539a": "A", "f3c423a3c3": "A",


    "404543f2b2": "B", "89a4ecdacd": "B", "7811dfe40d": "B", "8480600ebd": "B", "cd035d1831": "B", "0af3b04e8d": "B", "5086ec68ed": "B", "3f61d24447": "B",
    "182d227be2": "B", "daefa9752a": "B", "27900890bd": "B", "010cac29dc": "B", "3fa836e583": "B", "2d1cef08dd": "B", "5877a95912": "B", "6728d3c5fb": "B",
    "a92887a00d": "B", "983f700578": "B", "e7cd6e413c": "B", "80aa025f23": "B", "39954aa3b8": "B", "99794cbcf5": "B", "b305f18a51": "B", "a00b2b82cc": "B",
    "9a585d1555": "B", "06b7fce8e3": "B", "284e31f095": "B", "3469f0a205": "B", "1f5ab6f560": "B",

    "0401027bc9": "C", "15fd621b9e": "C", "c636d8ec4f": "C", "9518ec52e5": "C", "9983bf2c32": "C", "ac54f4fe00": "C", "394fb8d004": "C", "24006660f5": "C",
    "454e9d852b": "C", "bd5cc28054": "C", "1a45149570": "C", "5f82e0f9c9": "C", "20fd0048ff": "C", "0861b61cdc": "C", "18fb4b4a6e": "C", "a036f0ba2b": "C",
    "1b87a375a0": "C", "08893df887": "C", "6d02b7f91f": "C", "7be47fe5c0": "C", "dead34f02c": "C", "2da78f830e": "C", "e2af2b85b7": "C", "679c46d24f": "C",
    "5fd15f8441": "C", "dff931677d": "C", "5d77db91eb": "C", "e644af1f91": "C"

}

////////////////////////////////////////////
//
var notScanList = [];

function SuperBot() {
    //Arena
    if (autoStartArena) { // Auto start arena future
        if ($("#arena_list").length > 0) {
            let stamina = $(".fc4.far.fcb");
            stamina = stamina.length > 0 ? parseInt(stamina[0].innerText.replace("Stamina:", "")) : 0;

            if ((startArenaWithStamina && stamina > 80) || (!startArenaWithStamina && stamina > 20)) {
                if (thisUrl.indexOf("&ss=ar") > 0) {
                    var listArena = $("#arena_list tr > td:last-child > img[src='/y/arena/startchallenge.png']");
                } else {
                    var listArena = $("#arena_list tr");
                    listArena = Array.prototype.filter.call(listArena, function (element) {
                        return RegExp("Flying Spaghetti Monster").test(element.textContent); // Only do Spaghetti
                    });

                    if (listArena.length > 0)
                        listArena = listArena[0].querySelectorAll("td:last-child > img[src='/y/arena/startchallenge.png']");
                }


                if (listArena.length == 0) {
                    if (thisUrl.indexOf("&ss=ar") > 0 && thisUrl.indexOf("&page=2") == -1)
                        window.location.href = window.location.href + "&page=2";
                } else {
                    var arena = listArena[0];

                    // Change Difficulty
                    if (changeArenaDifficulty) {
                        if ($(".fc4.far.fcb select")[0].style.display == 'none') return;

                        var difficulty = arena.parentElement.parentElement.children[1].innerText.trim();
                        var selectedDifficulty = $(".fc4.far.fcb select")[0].value;

                        if (difficulty != selectedDifficulty) {
                            let listOption = $('.fc4.far.fcb select option');//.selected = true;

                            let option = Array.prototype.filter.call(listOption, function (element) {
                                return RegExp(difficulty).test(element.textContent);
                            });

                            option[0].selected = true;
                            var e = { "target": $(".fc4.far.fcb select")[0] };
                            e.target.onchange(e);

                            return;
                        }
                    }

                    //Start Arena 
                    window["init_battle"] = function (id, entrycost, token) {
                        $("#initid")[0].value = id;
                        $("#inittoken")[0].value = token;
                        $("#initform")[0].submit();
                    }

                    arena.click();
                }
            }
        }
    }

    //Advance Victory
    if (advanceWhenVict) {
        if($("#pane_completion #btcp").length > 0) {
            if($("#btcp")[0].onclick.toString().indexOf("battle.battle_continue()") > 0) {
                battle.battle_continue();
            } else if($("#btcp")[0].innerText.indexOf("You have been defeated!") > -1) {
                let counter = "";

                if ($(".hvstat-round-counter").length > 0)
                    counter = $(".hvstat-round-counter")[0].innerHTML;

                console.log("You lost at: " + counter);
                localStorage.lastMatch = "You lost at: " + counter;
                common.goto_arena();
            } else {
                console.log("You won!");
                localStorage.lastMatch = "You won!";
                common.goto_arena();
            }

            botStop();
            return;
        }
    }

    //Riddle
    if (doRiddle && $("#riddlemaster").length > 0) {
        let src = $("#riddlebot img")[0].src;
        src = src.substr(src.indexOf("&v=") + 3);

        var answer = riddleMaster[src];

        if (answer != null) {
            console.log("Your ass has been saved by the all mighty god. Answer: " + answer);

            $('#riddleanswer')[0].value = answer;
            $('#riddleform')[0].submit();
        } else {
            setInterval(beep, 150);
            //alert("HiddleAlert");
        }

        botStop();

        return;
    }

    //Get the List of Active Buffs
    var listOfBuffOn = [];
    for (let i = 0; i < $("#pane_effects img").length; i++) {
        var str = $("#pane_effects img")[i].onmouseover.toString();
        str = str.substr(str.indexOf("effect('") + 8);
        str = str.substr(0, str.indexOf("\',"));
        listOfBuffOn.push(str);
    }

    //Get the Status of your Heal/Mana/Spirit
    try {
        var actualHealth = $("#vbh img")[0].width / $("#vbh")[0].clientWidth * 100;
        var actualMana = $("#vbm img")[0].width / $("#vbm")[0].clientWidth * 100;
        var actualSpirit = $("#vbs img")[0].width / $("#vbs")[0].clientWidth * 100;
    } catch (e) {
        console.log("Cound get your life/mana/spirit data.");
        botStop();
        return;
    }

    // Potions
    if (Potions.Active) {
        if (Potions.UseMysticGem && Item("Mystic Gem"))
            return;
        
        for(var i = 0; i < Potions.PriorityOrder.length; i++) { 
            let priority = Potions.PriorityOrder[i];
            let actualValue = priority == "Health" ? actualHealth : priority == "Mana" ? actualMana : actualSpirit;

            let newList = Potions[priority].sort(function (a, b) { return a.UseAt - b.UsetAt });

            for(var j = 0; j < newList.length; j++) {
                let useAt = newList[j].UseAt;
                let type = newList[j].Type;
                let name = newList[j].Name;

                if(actualValue <= useAt) {
                    if((type == "Potion" || type == "Gem") && Item(name))
                        return;
                    else if (type == "Skill" && Spell(name))
                        return;
                    
                    //console.log(`Err: USE: ${useAt} || Type: ${type} || Name: ${name}`);
                }
            }
        }
    }
  
    //Buff
    if (useBuff && buffToUse != null && buffToUse.length > 0) {
        for (let i = 0; i < buffToUse.length; i++) {
            if (!In(listOfBuffOn, buffToUse[i])) {
                if (Spell(buffToUse[i]))
                    return;
            }
        }
    }

    // Debuff
    if (useDebuff && actualMana > 20) { // Don'' debuff if you have low mana
        var monsterList = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']");

        for (let i = 0; i < monsterList.length; i++) {
            var listOfDebuffsOn = [];
            var listDebuff = monsterList[i].querySelectorAll(".btm6 img");

            for (let j = 0; j < listDebuff.length; j++) {
                var str = listDebuff[j].onmouseover.toString();
                str = str.substr(str.indexOf("effect('") + 8);
                str = str.substr(0, str.indexOf("\',"));
                listOfDebuffsOn.push(str);
            }

            for (let j = 0; j < debuffToUse.length; j++) {
                if (!In(listOfDebuffsOn, debuffToUse[j])) {
                    if (Spell(debuffToUse[j])) {
                        monsterList[i].click();
                        return;
                    }
                }
            }
        }
    }

    // Scan
    if (scanCreatures) {
        var newMonsters = $(".hvstat-scan-button.hvstat-scan-button-highlight");

        if (newMonsters.length > 0) {
            var i = 0;
          
            while (i < newMonsters.length && In(notScanList, newMonsters[i].parentElement.innerText)) {
                i++;
            }

            //newMonsters.length != notScanList.length
            if (i < newMonsters.length && !In(newMonsters[i].parentElement.innerText)) {
                //console.log(i + "/" + newMonsters.length)
                notScanList.push(newMonsters[i].parentElement.innerText);

                if (Spell("Scan")) {
                    newMonsters[i].className += " scanned";
                    newMonsters[i].parentElement.click();
                    return;
                }
            } else {
                //setInterval(beep, 350);  
                console.log("Error Scan.");
                //botStop();
                //return;
            }
        }
    }

    // Attack 
    if (attack) {
        var monster = null;

        if (thisUrl.indexOf("&ss=rb") > 0) {
            monster = getMonsterByName("Yggdrasil");  //Heal

            if (monster == null)
                monster = getMonsterByName("Flying Spaghetti Monster");  //Puff of Logic

            //if(monster == null)
            //  monster = getMonsterByName("Drogon"); 
            //
            //if(monster == null)
            //  monster = getMonsterByName("Rhaegal");
            //
            //if(monster == null)
            //  monster = getMonsterByName("Viserion");
            //
            //if(monster == null)
            //  monster = getMonsterByName("Real Life");
            //  
        }

        if (monster == null) {
            monster = getTarget();
        }

        if (monster == null)
            return;

        var weakness = "", resistence = "";

        try {
            weakness = monster.querySelector('.hvstat-monster-status-weakness').innerText.replace("-", "");
            resistence = monster.querySelector('.hvstat-monster-status-resistance').innerText.replace("-", "");
        } catch (e) { } //Could not scan or Scan/HV Statistics is innactive.

        var spell = "";


        if (weakness == "")
            if (!Has(resistence, "Elemental")) // Put in the order from stronger to weaker
                if (!Has(resistence, "Cold")) spell = "Freeze";
                else if (!Has(resistence, "Wind")) spell = "Gale";
                else if (!Has(resistence, "Fire")) spell = "Fiery Blast";
                else spell = "Shockblast";
            else if (!Has(resistence, "Dark")) spell = "Corruption";
            else if (!Has(resistence, "Holy")) spell = "Smite";
            else spell = "Freeze"; // This motherfucker has all resistences. -- Strongest Element that I have
        else
            if (Has(weakness, "Cold")) spell = "Freeze";
            else if (Has(weakness, "Wind")) spell = "Gale";
            else if (Has(weakness, "Dark")) spell = "Corruption";
            else if (Has(weakness, "Fire")) spell = "Fiery Blast";
            else if (Has(weakness, "Elec")) spell = "Shockblast";
            else if (Has(weakness, "Holy")) spell = "Smite";
            else { /* I`m not sure what happened Here */
                alert("Some shit happened!!");
                console.log(monster);
                console.log(weakness);
            }

        if (Spell(spell)) {
            monster.click();
            return;
        }

        console.log("Could not use spell:" + spell);
    }
  
    console.log("Nothing to do here.");
    botStop();
}

function getTarget() {
    var monsterList = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']");

    if (monsterList.length == 0)
        return null;

    var monster = monsterList[0];

    switch (attackOrder) { // Tactics
        case 1:  //  Use AoE middle
            monster = monsterList[monsterList.length > 1 ? parseInt(monsterList.length / 2) : 0];
            break;
        case 2: //  Kill the weaker first
            var monsterID = -1;

            for (var i = 0; i < monsterList.length; i++) {
                var hasWeakness = monsterList[i].querySelector('.hvstat-monster-status-weakness').innerText != "";

                if (hasWeakness) {
                    monsterID = i;
                    break; // Break For;
                }
            }

            if (monsterID > -1) {
                monster = monsterList[monsterID];
                break; //Break Case
            }

            // If can`t find any with weakness, get lower life instead.
            var lowerHealth = 9999999999999;
            monsterID = 0;

            for (var i = 0; i < monsterList.length; i++) {
                var hp = parseInt(monsterList[i].querySelector(".hvstat-monster-health").innerText.split('/')[0]);
                if (hp < lowerHealth) {
                    lowerHealth = hp;
                    monsterID = i;
                }
            }

            monster = monsterList[monsterID];

            break;
        case 3: //  Kill the Lower HP First
            var lowerHealth = 9999999999999;
            var lowerID = 0;

            for (var i = 0; i < monsterList.length; i++) {
                var hp = parseInt(monsterList[i].querySelector(".hvstat-monster-health").innerText.split('/')[0]);
                if (hp < lowerHealth) {
                    lowerHealth = hp;
                    lowerID = i;
                }
            }

            monster = monsterList[lowerID];
            break;
        default: //  Dumpest Strategy First in First Out.
            monster = monsterList[0];
            break;
    };

    return monster;
}

window["botInterval"] = setInterval(SuperBot, 300);

var totalExp = $("#expbar").length > 0 ? $("#expbar")[0].width / 1235 * 100 : 0;
var span = document.createElement("span");

if ($("#arena_pages").length > 0) {
    span.style = "position: absolute; top: 5px; right: 65px; font-size: 13px; font-weight: bold;";
    span.innerHTML = localStorage.lastMatch;
} else {
    span.style = "position: absolute; top: 1px; right: 65px; cursor: pointer;";
    span.innerHTML = "<span id='startStopBot'>Stop Bot</span><br>" + totalExp.toFixed(2) + "% - " + localStorage.amoutRandomEncounter;
    span.onclick = function () { botStop(); };    
}




document.querySelector("#mainpane").appendChild(span);

window["botStopped"] = false;
window["botStop"] = function () {
    console.log("Bot Stopped");
  
    if(window["botStopped"]) {
        window["botInterval"] = setInterval(SuperBot, 300);
        
        if($("#startStopBot").length > 0)
            $("#startStopBot")[0].innerText = "Stop Bot";
    } else {
        clearInterval(botInterval);
        
        if($("#startStopBot").length > 0)
            $("#startStopBot")[0].innerText = "Start Bot";
    }
  
    window["botStopped"] = !window["botStopped"];
}


window["beep"] = function () {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}
