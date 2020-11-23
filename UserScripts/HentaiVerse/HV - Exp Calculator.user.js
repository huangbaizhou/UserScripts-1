// ==UserScript==
// @name       HV - EXP Calculator
// @namespace  Hentai Verse
// @match      https://hentaiverse.org/?s=Battle&ss=ar*
// @grant      none
// @version    1.0
// @author     Svildr
// @icon       http://e-hentai.org/favicon.ico
// @description 10/4/2020, 4:12:53 PM
// ==/UserScript==

if (!document.querySelector("#difficulty"))
    return;

window.getExp = (nrml, boss, lege, ulti, level, expMod) => {
    /* Bonus */
    var abilityModifier = 4.25; // 300% Adept Learner + 25% Thinking Cap
    var forumBonus = 2; // 2x Posting on forum every 30 days.

    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    var playerLevel = document.querySelector("#difficulty").innerText;
    playerLevel = parseInt(playerLevel.substring(playerLevel.indexOf(".") + 1));

    var stamina = document.querySelector("#stamina_readout").innerText;
    stamina = parseInt(stamina.substring(stamina.indexOf(":") + 1));

    var nrmMod = 2.064592419747144, // Calculated using as base the Killzone (Total Exp / 227) / (All Modifiers)
        bosMod = 2.4,
        legMod = 2.1,
        ultMod = 2.8;

    var diffMod = 1;
    switch (level) {
        case "Hard": diffMod = 2; break;
        case "Nightmare": diffMod = 4; break;
        case "Hell": diffMod = 7; break;
        case "Nintendo": diffMod = 10; break;
        case "IWBTH": diffMod = 15; break;
        case "PFUDOR": diffMod = 20; break;
    }
    
    return playerLevel * ((nrml * nrmMod) + (boss * bosMod) + (lege * legMod) + (ulti * ultMod)) * (stamina > 79 ? 2 : 1) * diffMod * expMod * abilityModifier * forumBonus;
}

window.getExpByChallange = (challange, level, expMod) => {
    var totalExp = "";

    switch (challange) {
        case "First Blood":
            totalExp = getExp(5, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Learning Curves":
            totalExp = getExp(9, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Graduation":
            totalExp = getExp(27, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Road Less Traveled":
            totalExp = getExp(52, 0, 0, 0, level, expMod ?? 1);
            break;
        case "A Rolling Stone":
            totalExp = getExp(77, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Fresh Meat":
            totalExp = getExp(126, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Dark Skies":
            totalExp = getExp(152, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Growing Storm":
            totalExp = getExp(177, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Power Flux":
            totalExp = getExp(202, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Killzone":
            totalExp = getExp(227, 0, 0, 0, level, expMod ?? 1);
            break;
        case "Endgame":
            totalExp = getExp(233, 1, 0, 0, level, expMod ?? 1);
            break;
        case "Longest Journey":
            totalExp = getExp(278, 1, 0, 0, level, expMod ?? 1.1);
            break;
        case "Dreamfall":
            totalExp = getExp(356, 1, 0, 0, level, expMod ?? 1.2);
            break;
        case "Exile":
            totalExp = getExp(385, 1, 0, 0, level, expMod ?? 1.3);
            break;
        case "Sealed Power":
            totalExp = getExp(351, 2, 0, 0, level, expMod ?? 1.5);
            break;
        case "New Wings":
            totalExp = getExp(350, 3, 0, 0, level, expMod ?? 1.6);
            break;
        case "To Kill a God":
            totalExp = getExp(474, 0, 1, 0, level, expMod ?? 1.8);
            break;
        case "Eve of Death":
            totalExp = getExp(452, 1, 1, 0, level, expMod ?? 1.9);
            break;
        case "The Trio and the Tree":
            totalExp = getExp(494, 0, 0, 4, level, expMod ?? 2);
            break;
        case "End of Days":
            totalExp = getExp(414, 2, 57, 0, level, expMod ?? 2.2);
            break;
        case "Eternal Darkness":
            totalExp = getExp(313, 3, 127, 0, level, expMod ?? 2.5);
            break;
        case "A Dance with Dragons":
            totalExp = getExp(558, 0, 224, 3, level, expMod ?? 3);
            break;
    }

    return Math.ceil(totalExp);
}

var numberSep = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/********************/

var list = document.querySelectorAll("tbody tr");
if (list.length > 0) {
    list[0].querySelectorAll("th")[5].querySelector("div > div").innerText = "EXP/Stamina";
    list[0].querySelectorAll("th")[6].querySelector("div > div").innerText = "Total EXP Aprox.";

    for (var i = 1; i < list.length; i++) {
        var line = list[i].querySelectorAll("td");

        var challange = line[0].innerText;
        var level = line[1].innerText;
        var rounds = line[3].querySelector("div > div");
        var roundStamina = (0.04 * parseInt(rounds.innerText)).toFixed(2);
        var expMod = parseFloat(line[4].querySelector("div > div").innerText.replace("X", ""));


        var totalExp = getExpByChallange(challange, level, expMod);
        var normal = getExpByChallange(challange, "Normal", expMod);
        var hard = getExpByChallange(challange, "Hard", expMod);
        var nightmare = getExpByChallange(challange, "Nightmare", expMod);
        var hell = getExpByChallange(challange, "Hell", expMod);
        var nintendo = getExpByChallange(challange, "Nintendo", expMod);
        var iwbth = getExpByChallange(challange, "IWBTH", expMod);
        var pfudor = getExpByChallange(challange, "PFUDOR", expMod);


        rounds.innerText += " (" + roundStamina + ")";

        if (line.length == 8) {
            line[5].querySelector("div > div").innerHTML = `
            <label title='Normal: ${numberSep(Math.ceil(normal / roundStamina))}
Hard: ${numberSep(Math.ceil(hard / roundStamina))}
Nightmare: ${numberSep(Math.ceil(nightmare / roundStamina))}
Hell: ${numberSep(Math.ceil(hell / roundStamina))}
Nintendo: ${numberSep(Math.ceil(nintendo / roundStamina))}
IWBTH: ${numberSep(Math.ceil(iwbth / roundStamina))}
PFUDOR: ${numberSep(Math.ceil(pfudor / roundStamina))}'>
                ${numberSep(Math.ceil(totalExp / roundStamina))}
            </label>`;

            line[6].querySelector("div > div").innerHTML = `
            <label title='Normal: ${numberSep(normal)}
Hard: ${numberSep(hard)}
Nightmare: ${numberSep(nightmare)}
Hell: ${numberSep(hell)}
Nintendo: ${numberSep(nintendo)}
IWBTH: ${numberSep(iwbth)}
PFUDOR: ${numberSep(pfudor)}'>
                ${numberSep(totalExp)}
            </label>`;
        }
    }
}