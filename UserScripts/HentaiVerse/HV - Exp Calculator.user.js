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

var playerLevel = document.querySelector("#difficulty").innerText;
playerLevel = parseInt(playerLevel.substring(playerLevel.indexOf(".") + 1));

var stamina = document.querySelector("#stamina_readout").innerText;
stamina = parseInt(stamina.substring(stamina.indexOf(":") + 1));


var nrmMod = 2.064592419747144, // Calculated using as base the Killzone (Total Exp / 227) / (All Modifiers)
    bosMod = 2.4,
    legMod = 2.1,
    ultMod = 2.8;

var abilityModifier = 3.83;

var getExp = (nrml, boss, lege, ulti, diffMod, expMod) => {
    return playerLevel * ((nrml * nrmMod) + (boss * bosMod) + (lege * legMod) + (ulti * ultMod)) * (stamina > 79 ? 2 : 1) * diffMod * expMod * abilityModifier;
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
        var expMod = parseInt(line[4].querySelector("div > div").innerText.replace("X", ""));


        var diffMod = 1;
        switch (level) {
            case "Hard": diffMod = 2; break;
            case "Nightmare": diffMod = 4; break;
            case "Hell": diffMod = 7; break;
            case "Nintendo": diffMod = 10; break;
            case "IWBTH": diffMod = 15; break;
            case "PFUDOR": diffMod = 20; break;
        }


        var totalExp = "";
        switch (challange) {
            case "First Blood":
                totalExp = getExp(5, 0, 0, 0, diffMod, expMod);
                break;
            case "Learning Curves":
                totalExp = getExp(9, 0, 0, 0, diffMod, expMod);
                break;
            case "Graduation":
                totalExp = getExp(27, 0, 0, 0, diffMod, expMod);
                break;
            case "Road Less Traveled":
                totalExp = getExp(52, 0, 0, 0, diffMod, expMod);
                break;
            case "A Rolling Stone":
                totalExp = getExp(77, 0, 0, 0, diffMod, expMod);
                break;
            case "Fresh Meat":
                totalExp = getExp(126, 0, 0, 0, diffMod, expMod);
                break;
            case "Dark Skies":
                totalExp = getExp(152, 0, 0, 0, diffMod, expMod);
                break;
            case "Growing Storm":
                totalExp = getExp(177, 0, 0, 0, diffMod, expMod);
                break;
            case "Power Flux":
                totalExp = getExp(202, 0, 0, 0, diffMod, expMod);
                break;
            case "Killzone":
                totalExp = getExp(227, 0, 0, 0, diffMod, expMod);
                break;
            case "Endgame":
                totalExp = getExp(233, 1, 0, 0, diffMod, expMod);
                break;
            case "Longest Journey":
                totalExp = getExp(278, 1, 0, 0, diffMod, expMod);
                break;
            case "Dreamfall":
                totalExp = getExp(356, 1, 0, 0, diffMod, expMod);
                break;
            case "Exile":
                totalExp = getExp(385, 1, 0, 0, diffMod, expMod);
                break;
            case "Sealed Power":
                totalExp = getExp(351, 2, 0, 0, diffMod, expMod);
                break;
            case "New Wings":
                totalExp = getExp(350, 3, 0, 0, diffMod, expMod);
                break;
            case "To Kill a God":
                totalExp = getExp(474, 0, 1, 0, diffMod, expMod);
                break;
            case "Eve of Death":
                totalExp = getExp(452, 1, 1, 0, diffMod, expMod);
                break;
            case "The Trio and the Tree":
                totalExp = getExp(494, 0, 0, 4, diffMod, expMod);
                break;
            case "End of Days":
                totalExp = getExp(414, 2, 57, 0, diffMod, expMod);
                break;
            case "Eternal Darkness":
                totalExp = getExp(313, 3, 127, 0, diffMod, expMod);
                break;
            case "A Dance with Dragons":
                totalExp = getExp(558, 0, 224, 3, diffMod, expMod);
                break;
        }

        rounds.innerText += " (" + roundStamina + ")";


        if (line.length == 8) {
            line[5].querySelector("div > div").innerText = numberSep(Math.ceil(totalExp / roundStamina));
            line[6].querySelector("div > div").innerText = numberSep(Math.ceil(totalExp));
        }
    }
}