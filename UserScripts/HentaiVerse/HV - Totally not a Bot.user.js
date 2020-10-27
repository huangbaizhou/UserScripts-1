// ==UserScript==
// @name       HV - [NAT] Not A Bot
// @namespace  Hentai Verse
// @version    2.5.8
// @author     Svildr
// @match      https://hentaiverse.org/*
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==
/*
TODO List
  Fight: https://ehwiki.org/wiki/Battles#Combat
    * Flee
*/

var NABVersion = "2.5.9";

if (!localStorage.NABVersion || localStorage.NABVersion != NABVersion) {
    localStorage.removeItem("NotABot");
    localStorage.removeItem("NABConfig");
    localStorage.NABVersion = NABVersion;
    console.log("Cleared Cache of old LocalStorage");
}


window.LocalStorage = {
    NotABot: {},
    NABConfig: {},
    Persona: "",
    ListPersona: [],

    Update: function () {
        localStorage.NotABot = JSON.stringify(LocalStorage.NotABot);
    },
    Load: function () {
        if (localStorage.NotABot)
            this.NotABot = JSON.parse(localStorage.NotABot)
        else
            localStorage.NotABot = "{}";
    },

    UpdateConfig: function () {
        localStorage["NABConfig." + this.Persona] = JSON.stringify(LocalStorage.NABConfig);
    },
    LoadConfig: function () {
        if (!localStorage["NABConfig." + this.Persona]) {
            this.NewConfig();
            this.UpdateConfig();
        } else {
            this.NABConfig = JSON.parse(localStorage["NABConfig." + this.Persona]);

            if (this.NABConfig.Version != NABVersion) {
                this.NewConfig();
                this.UpdateConfig();
                console.log("Cleared Cache of old LocalStorage");
            }
        }
    },
    NewConfig: function () {
        this.NABConfig = {
            Version: NABVersion,
            CharacterType: "Arch-Mage",
            VitalBar: "Utilitarian",

            Fight: {
                Active: true,
                ScanCreature: true,
                AttackCreature: true,
                AdvanceOnVictory: true,
                Order: 3,

                Buff: {
                    Active: true,
                    Use: ["Spark of Life", "Absorb", "Regen", "Protection", "Arcane Focus", "Spirit Shield"],
                },

                Debuff: {
                    Active: true,
                    MinMana: 25,
                    Use: ["Weaken", "Imperil", "Drain"]
                },

                Potion: {
                    Active: true,
                    UseMysticGem: true,
                    PriorityOrder: ["Health", "Mana", "Spirit"],
                    Health: [
                        { Type: "Item", Name: "Health Elixir", UseAt: 10, CheckBuff: "Regeneration", CheckItem: ["Health Gem", "Health Potion"] },
                        { Type: "Item", Name: "Health Potion", UseAt: 40, CheckItem: ["Health Gem"] },
                        { Type: "Item", Name: "Health Draught", UseAt: 70, CheckBuff: "Regeneration" },
                        { Type: "Item", Name: "Health Gem", UseAt: 50 },
                        { Type: "Spell", Name: "Cure", UseAt: 60 },
                        { Type: "Spell", Name: "Full-Cure", UseAt: 20 }
                    ],
                    Mana: [
                        { Type: "Item", Name: "Mana Elixir", UseAt: 5, CheckItem: ["Mana Gem", "Mana Potion"] },
                        { Type: "Item", Name: "Mana Potion", UseAt: 40, CheckItem: ["Mana Gem"] },
                        { Type: "Item", Name: "Mana Draught", UseAt: 70, CheckBuff: "Replenishment" },
                        { Type: "Item", Name: "Mana Gem", UseAt: 55 }
                    ],
                    Spirit: [
                        { Type: "Item", Name: "Spirit Elixir", UseAt: 5, CheckItem: ["Spirit Gem", "Spirit Potion"] },
                        { Type: "Item", Name: "Spirit Potion", UseAt: 40, CheckItem: ["Spirit Gem"] },
                        { Type: "Item", Name: "Spirit Draught", UseAt: 60, CheckBuff: "Refreshment" },
                        { Type: "Item", Name: "Spirit Gem", UseAt: 70 }
                    ]
                },

                Spirit: {
                    Active: false,
                    PriorityOrder: ["Focus", "Spirit", "Defend"],

                    Spirit: {
                        Active: true,
                        Mana: { EnableAt: 65, DisableAt: 70 },
                        Overcharge: { EnableAt: 50 }
                    },

                    Defend: {
                        Active: true,
                        Health: { EnableAt: 30 },
                        Overcharge: { EnableAt: 10 }
                    },

                    Focus: {
                        Active: true,
                        Mana: { EnableAt: 5 },
                        Overcharge: { EnableAt: 10 }
                    },
                },
            },

            Riddle: {
                Active: true,
                Combinations: {},
            },

            Idle: {
                Active: true,

                Character: {
                    Active: true,

                    Training: {
                        Active: true,
                        MinCredits: 400000,
                        PriorityOrder: ["Adept Learner", "Ability Boost", "Scavenger", "Luck of the Draw", "Assimilator", "Quartermaster", "Archaeologist"],
                    },

                },

                Battle: {
                    Active: false,
                    DoRingOfBlood: false,
                    MinimumStamina: 80,
                    ChangeDifficulty: true,
                    UseRestoratives: true,
                    MaxStaminaToUseRestorative: 79,
                },

                Bazaar: {
                    Active: true,

                    Equipment: {
                        Active: true,
                    },

                    Item: {
                        Active: true,
                        ListToBuy: [
                            // Potions - Check Forum

                            ////// Repair
                            { Name: "Scrap Cloth", Amount: 100 },
                            { Name: "Scrap Wood", Amount: 50 },
                            { Name: "Energy Cell", Amount: 50 },

                            ////// Enchants - Check Forum
                        ]
                    },
                },

                Forge: {
                    Active: true,

                    Repair: {
                        Active: true,
                    },

                    Enchant: {
                        Active: false,
                        Use: ["Infused Flames", "Infused Frost", "Infused Lightning", "Infused Storm", "Infused Divinity", "Infused Darkness"]
                    },
                },

            },
        };

        LocalStorage.UpdateConfig();
    },

    LoadPersona: function () {
        if (this.ListPersona.length == 0 && localStorage["NAB.ListPersona"])
            this.ListPersona = localStorage["NAB.ListPersona"].split(",");

        if (!this.Persona || this.Persona == "")
            this.Persona = localStorage["NAB.Persona"];

        if ((!this.Persona || this.Persona == "") && this.ListPersona.length > 0) {
            this.Persona = this.ListPersona[0];
            localStorage["NAB.Persona"] = this.Persona;
        }

        if (!this.Persona || this.Persona == "")
            location.href = "https://hentaiverse.org/";
    },
    CheckPersona: function (name) {
        if (!name.In(this.ListPersona)) {
            this.ListPersona.push(name);
            localStorage["NAB.ListPersona"] = this.ListPersona.toString();
        }

        if (this.Persona != name) {
            this.ChangePersona(name);
        }
    },
    ChangePersona: function (name) {
        this.Persona = name;
        localStorage["NAB.Persona"] = this.Persona;

        this.CheckPersona(name);
        this.LoadConfig();
    }
};

LocalStorage.Load();
LocalStorage.LoadPersona();
LocalStorage.LoadConfig();

/**********/

////#Extras
var Url = window.location.href;

function $$(b) {
    if (b.has("#"))
        if (parseInt(b[b.indexOf("#") + 1]))
            b = b.replace(b[b.indexOf("#") + 1], CSS.escape(b[b.indexOf("#") + 1]))

    return document.querySelector(b);
}
function $(b) {
    if (b.has("#"))
        if (parseInt(b[b.indexOf("#") + 1]))
            b = b.replace(b[b.indexOf("#") + 1], CSS.escape(b[b.indexOf("#") + 1]))

    return Array.from(document.querySelectorAll(b));
}

var isLogging = false;

function Log(obj, logLevel) {
    switch (logLevel) {
        case "info":
            if (isLogging)
                console.info(obj);
            break;
        case "warn":
            console.warn(obj);
            break;
        case "error":
            console.warn("-----------------------------------------");
            console.warn("------------  *** ERROR ***  ------------");
            console.warn("-----------------------------------------");
            console.error(obj);
            break;
        default:
            if (isLogging)
                console.log(obj);
            break;
    }
}

String.prototype.In = function (list) {
    for (var i = 0; i < list.length; i++)
        if (list[i].has(this))
            return true;

    return false;
}

String.prototype.has = function (val) {
    return this.indexOf(val) > -1;
}

Object.prototype.contains = function (name) {
    return Array.prototype.filter.call(this, function (element) {
        return RegExp(name).test(element.textContent ?? element);
    });
}

window["beep"] = function () {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}


if ($$("#child_Character > div"))
    $$("#child_Character > div").innerHTML += `
    <div onclick="document.location='https://hentaiverse.org/?NABConfig'">
        <div class="fc4 fal fcb" style="width:76px">
            <div>Not Bot Config</div>
        </div>
    </div>
`;
////// 


if (Url.has("?NABConfig")) {
    var listOfBuffs = ["Regen", "Protection", "Haste", "Shadow Veil", "Absorb", "Spark of Life", "Spirit Shield", "Heartseeker", "Arcane Focus"];
    var listOfDebuffs = ["Drain", "Weaken", "Imperil", "Slow", "Sleep", "Confuse", "Blind", "Silence", "MagNet"];
    var listOfEnchants = ["Voidseeker's Blessing", "Suffused Aether", "Featherweight Charm", "Infused Flames", "Infused Frost", "Infused Lightning", "Infused Storm", "Infused Divinity", "Infused Darkness"];
    var listOfPotions = ["Health", "Mana", "Spirit"];
    var listOfTraining = ["Adept Learner", "Assimilator", "Ability Boost", "Manifest Destiny", "Scavenger", "Luck of the Draw", "Quartermaster", "Archaeologist", "Metabolism", "Inspiration", "Scholar of War", "Tincture", "Pack Rat", "Dissociation", "Set Collector"];

    var multiButton = `<td>
        <button type="button" class="rotate moveUp">&lsaquo;</button>
        <button type="button" class="rotate moveDown">&rsaquo;</button>
    </td>`;

    function GetMultiple(id, name, listUse, listTotal) {

        var str = `<table>
            <thead>
                <tr>
                    <th>Use</th>
                    <th style="width: 200px">${name}</th>
                    <th style="text-align: center;">Order</th>
                </tr>
            </thead>
            <tbody class="checkMultiple">`;

        listTotal = listTotal.filter(o => !o.In(listUse));

        for (var i = 0; i < listUse.length; i++) {
            var name = listUse[i];

            str += `
                <tr class='selected'>
                    <td><input id='${id}' type='checkbox' value='${name}' checked /></td>
                    <td class='pad-left'>${name}</td>
                    ${multiButton}
                </tr>`
        }

        for (var i = 0; i < listTotal.length; i++) {
            var name = listTotal[i];
            str += `
                <tr>
                    <td><input id='${id}' type='checkbox' value='${name}' /></td>
                    <td class='pad-left'>${name}</td>
                    ${multiButton}
                </tr>`;
        }

        str += `
            </tbody>
        </table>`;

        return str;
    }

    function GetSpiritTable() {
        var spirit = `
            <tr ${LocalStorage.NABConfig.Fight.Spirit.Spirit.Active ? "class='selected'" : ""}>
                <td class=center><input type="checkbox" id="fightSpiritPriorityOrder" value="Spirit" ${LocalStorage.NABConfig.Fight.Spirit.Spirit.Active ? "checked" : ""} /></td>
                <th>Spirit</th>
                <td><input type="number" id="fightSpiritSpiritManaEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Spirit.Mana.EnableAt}"/></td>
                <td><input type="number" id="fightSpiritSpiritManaDisableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Spirit.Mana.DisableAt}"/></td>
                <td><input type="number" disabled /></td>
                <td><input type="number" id="fightSpiritSpiritOverchargeEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Spirit.Overcharge.EnableAt}"/></td>
                ${multiButton}
            </tr>`
        var defend = `
            <tr ${LocalStorage.NABConfig.Fight.Spirit.Defend.Active ? "class='selected'" : ""}>
                <td class=center><input type="checkbox" id="fightSpiritPriorityOrder" value="Defend" ${LocalStorage.NABConfig.Fight.Spirit.Defend.Active ? "checked" : ""} /></td>
                <th>Defend</th>
                <td><input type="number" disabled /></td>
                <td><input type="number" disabled /></td>
                <td><input type="number" id="fightSpiritDefendHealthEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Defend.Health.EnableAt}" /></td>
                <td><input type="number" id="fightSpiritDefendOverchargeEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Defend.Overcharge.EnableAt}"/></td>
                ${multiButton}
            </tr>`

        var focus = `
            <tr ${LocalStorage.NABConfig.Fight.Spirit.Focus.Active ? "class='selected'" : ""}>
                <td class=center><input type="checkbox" id="fightSpiritPriorityOrder" value="Focus" ${LocalStorage.NABConfig.Fight.Spirit.Focus.Active ? "checked" : ""} /></td>
                <th>Focus</th>
                <td><input type="number" id="fightSpiritFocusManaEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Focus.Mana.EnableAt}"/></td>
                <td><input type="number" disabled /></td>
                <td><input type="number" disabled /></td>
                <td><input type="number" id="fightSpiritFocusOverchargeEnableAt" value="${LocalStorage.NABConfig.Fight.Spirit.Focus.Overcharge.EnableAt}"/></td>
                ${multiButton}
            </tr>`

        var str = "";

        for (var i = 0; i < LocalStorage.NABConfig.Fight.Spirit.PriorityOrder.length; i++) {
            var priority = LocalStorage.NABConfig.Fight.Spirit.PriorityOrder[i];

            if (priority == "Spirit")
                str += spirit;
            else if (priority == "Defend")
                str += defend;
            else if (priority == "Focus")
                str += focus;
        }

        var listRest = ["Spirit", "Defend", "Focus"].filter(o => !o.In(LocalStorage.NABConfig.Fight.Spirit.PriorityOrder));
        for (var i = 0; i < listRest.length; i++) {
            var priority = listRest[i];

            if (priority == "Spirit")
                str += spirit;
            else if (priority == "Defend")
                str += defend;
            else if (priority == "Focus")
                str += focus;
        }

        return str;
    }

    var configHTML = `
<style>
    #settings_outer {
        height: 100%;
        font-size: 9pt;
        margin: 0 auto;
        padding-top: 5px;
        overflow: auto;
    }

        #settings_outer > div {
            width: 650px;
            text-align: justify;
            margin: 0 auto 30px;
        }

    .settings_block {
        padding-top: 20px;
        clear: both;
        text-align: left;
    }

    #settings_apply {
        padding-top: 10px;
        text-align: center;
    }

    p {
        padding: 3px 1px;
        margin: 1px;
    }
    
    .title {
        font-weight: bolder;
        text-transform: uppercase;
        font-size: 13.5px;
        padding-bottom: 15px;
    }

    .item-title {
        font-weight: bold;
    }

    .center {
        text-align: center;
    }

    select:not(multiple) {
        width: 200px;
    }

    td.label {
        position: relative;
        vertical-align: top;
        padding-top: 8px;
    }

    input[type="button"] {
        font-size: 8pt;
        color: #5C0D11;
        background: #EDEADA;
        border: 2px outset #5C0D11;
        height: 21px;
        margin: 4px 1px 0 1px;
        padding: 0 4px 1px 4px;
        cursor: pointer;
    }

    table {
        margin: 0 auto;
    }

    .pad-left {
        padding-left: 8px;
    }

    /** Select Multiple **/
    .checkMultiple > tr > td:first-child,
    .checkMultiple > tr > td:last-child {
        text-align: center;
    }

    .checkMultiple > tr.selected {
        background: #9f9fb7;
        color: white;
    }

    .checkMultiple button.rotate {
        transform: rotate(90deg);
        padding: 0 6px 2px;
        cursor: pointer;
    }

        .checkMultiple button.rotate + button.rotate {
            margin-left: -2px;
        }

    /** Tooltip **/
    .tooltip {
        display: inline-block;
        border-bottom: 1px dotted #AAA;
        cursor: pointer;
        position: relative;
    }

        .tooltiptext > i {
          font-size: 11px;
          color: #dbd6d6;
  
        }

        .tooltip .tooltiptext {
            visibility: hidden;
            background-color: #3e3636c2;
            color: #fff;
            border-radius: 6px;
            padding: 8px 10px;

            width: intrinsic;           /* Safari/WebKit uses a non-standard name */
            width: -moz-max-content;    /* Firefox/Gecko */
            width: -webkit-max-content; /* Chrome */
            width: max-content;

            position: absolute;
            z-index: 1;
            text-align: inherit;
            margin: -8px 0 0 6px;
        }

            .tooltip .tooltiptext::after {
              content: " ";
              position: absolute;
              top: 15.5px; /*50%;*/
              right: 100%;
              margin-top: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent #3e3636c2 transparent transparent;
            }

        .tooltip:hover .tooltiptext {
            visibility: visible;
        }
    /* End Tooltip */
</style>
<div id="settings_outer">
    <div>
        <div class="settings_block">
            <div class="title">Not a Bot - Configuration</div>
            <span class="item-title">Info</span>
            <p>
                <b>NaB</b> is better used with: <br>
                <b>&emsp;** HVSTAT</b> - To save and check monster weaknesses and resistences <br>
                <b>&emsp;** Inline Difficulty Changer</b> - To auto-set game difficulty when using Auto-Battle <br>
                <b>&emsp;** Random Encounter Notification</b> - To auto-start Random Encounters <br>
                <b>&emsp;** RiddleLimiter Plus</b> - To do Riddles faster
            </p>
        </div>

        <div class="settings_block">
            <span class="item-title">Basic Settings</span>
            <p>
                <label for="VitalBar">Vital Bar Style</label>
                <select id="VitalBar">
                    <option value="Standard" ${LocalStorage.NABConfig.VitalBar == "Standard" ? "selected" : ""}>Standard</option>
                    <option value="Utilitarian" ${LocalStorage.NABConfig.VitalBar == "Utilitarian" ? "selected" : ""}>Utilitarian</option>
                </select>
            </p>
            <p>
                <label class="tooltip" for="CharacterType">
                    Character Type
                    <span class="tooltiptext">
                        <b>Arch-Mage</b> will scale it's magic between circles according with the amount of monsters.
                        <br>
                        <b>Mage 3rd Circle</b> uses the strongest spells, uses more MP, good against higher amount of monsters
                        <br>
                        <b>Mage 2nd Circle</b> uses the intermediate spells, uses less MP than the 3rd circle, good area
                        <br>
                        <b>Mage 1st Circle</b> uses the weak spells, uses less MP than 2nd circle, good against small amount of monsters
                        <br>
                    </span>
                </label>

                <select id="CharacterType">
                    <option value="Arch-Mage" ${LocalStorage.NABConfig.CharacterType == "Arch-Mage" ? "selected" : ""}>Arch-Mage</option>
                    <option value="Mage 3rd Circle" ${LocalStorage.NABConfig.CharacterType == "Mage 3rd Circle" ? "selected" : ""}>Mage 3rd Circle</option>
                    <option value="Mage 2nd Circle" ${LocalStorage.NABConfig.CharacterType == "Mage 2nd Circle" ? "selected" : ""}>Mage 2nd Circle</option>
                    <option value="Mage 1st Circle" ${LocalStorage.NABConfig.CharacterType == "Mage 1st Circle" ? "selected" : ""}>Mage 1st Circle</option>
                    <option value="One-Handed" ${LocalStorage.NABConfig.CharacterType == "One-Handed" ? "selected" : ""}>One-Handed</option>
                    <option value="Dual Wielding" ${LocalStorage.NABConfig.CharacterType == "Dual Wielding" ? "selected" : ""}>Dual Wielding</option>
                    <option value="2-Handed Weapon" ${LocalStorage.NABConfig.CharacterType == "2-Handed Weapon" ? "selected" : ""}>2-Handed Weapon</option>
                    <option value="Niten Ichiryu" ${LocalStorage.NABConfig.CharacterType == "Niten Ichiryu" ? "selected" : ""}>Niten Ichiryu</option>
                </select>
            </p>
        </div>

        <div class="settings_block">
            <span class="item-title">Fighting</span>
            <p>
                <input type="checkbox" id="fightActive" ${LocalStorage.NABConfig.Fight.Active ? "checked" : ""}>
                <label for="fightActive">Active</label>
            </p>
            <p>
                <input type="checkbox" id="fightScanCreature" ${LocalStorage.NABConfig.Fight.ScanCreature ? "checked" : ""}> 
                <label class="tooltip" for="fightScanCreature">
                    Scan Monsters
                    <span class="tooltiptext">
                        If you are <b>not</b> using HVSTAT <b>disable</b> this
                    </span>
                </label>
            </p>
            <p>
                <input type="checkbox" id="fightAttackCreature" ${LocalStorage.NABConfig.Fight.AttackCreature ? "checked" : ""}>
                <label for="fightAttackCreature">Use Attack Skills</label>
            </p>
            <p>
                <input type="checkbox" id="fightAdvanceOnVictory" ${LocalStorage.NABConfig.Fight.AdvanceOnVictory ? "checked" : ""}>
                <label for="fightAdvanceOnVictory">Advance on Victory</label>
            </p>
            <p>
                <label for="fightOrder">Attack Priority</label>
                <select id="fightOrder">
                    <option value="1" ${LocalStorage.NABConfig.Fight.Order == 1 ? "selected" : ""}>AoE in the Middle</option>
                    <option value="2" ${LocalStorage.NABConfig.Fight.Order == 2 ? "selected" : ""}>Weaker</option>
                    <option value="3" ${LocalStorage.NABConfig.Fight.Order == 3 ? "selected" : ""}>Lower HP</option>
                    <option value="4" ${LocalStorage.NABConfig.Fight.Order == 4 ? "selected" : ""}>Displayed Order</option>
                </select>
            </p>
        </div>


        <div class="settings_block">
            <span class="item-title">Riddle</span>
            <p>
                <input type="checkbox" id="riddleActive" ${LocalStorage.NABConfig.Riddle.Active ? "checked" : ""}> 
                <label class="tooltip" for="riddleActive">
                    Try to do Riddle
                    <span class="tooltiptext">
                        The code has a small database of riddles. <br>
                        <i>If it's unable to do it a sound alert will be activated</i>
                    </span>
                </label>
            </p>
        </div>

        <div class="settings_block">
            <span class="item-title">Buff Self</span>
            <p>
                <input type="checkbox" id="fightBuffActive" ${LocalStorage.NABConfig.Fight.Buff.Active ? "checked" : ""}> 
                <label for="fightBuffActive">Active</label>
            </p>
            <p>

            ${GetMultiple("fightBuffUse", "Buff", LocalStorage.NABConfig.Fight.Buff.Use, listOfBuffs)}
        </div>

        <div class="settings_block">
            <span class="item-title">Debuff Monsters</span>
            <p>
                <input type="checkbox" id="fightDebuffActive" ${LocalStorage.NABConfig.Fight.Debuff.Active ? "checked" : ""}> 
                <label for="fightDebuffActive">Active</label>
            </p>
            <p>
                <label for="fightDebuffMinMana" class="tooltip">Mana Min (%)
                    <span class="tooltiptext">
                        Only use Debuffs if Mana is at the % or Higher <br>
                        <i>Change to -1 if you want to remove this Validation</i>
                    </span>
                </label>
                <input type="number" maxlength="3" id="fightDebuffMinMana" value="${LocalStorage.NABConfig.Fight.Debuff.MinMana}" />
            </p>
            ${GetMultiple("fightDebuffUse", "Debuff", LocalStorage.NABConfig.Fight.Debuff.Use, listOfDebuffs)}
        </div>

        <div class="settings_block">
            <span class="item-title">Use Potion</span>
                <p>
                    <input type="checkbox" id="fightPotionActive" ${LocalStorage.NABConfig.Fight.Potion.Active ? "checked" : ""}>
                    <label for="fightPotionActive">Active</label>
                </p>
                <p>
                    <input type="checkbox" id="fightPotionUseMysticGem" ${LocalStorage.NABConfig.Fight.Potion.UseMysticGem ? "checked" : ""}>
                    <label for="fightPotionUseMysticGem">Use Mystic Gem</label>
                </p>
                
                ${GetMultiple("fightPotionPriorityOrder", "Potions", LocalStorage.NABConfig.Fight.Potion.PriorityOrder, listOfPotions)}

<!--
--This will probably become a Table
                // All are in Percentage -- To remove any specific Potion change the value to -1
                // Don't change the name or the type unless you know exacly what you are doing.
                Health: [
                    { Type: "Item", Name: "Health Elixir", UseAt: 10 },
                    { Type: "Item", Name: "Health Potion", UseAt: 30 },
                    { Type: "Item", Name: "Health Draught", UseAt: 60 }, 
                    { Type: "Item", Name: "Health Gem", UseAt: 50 },
                    { Type: "Spell", Name: "Cure", UseAt: 40 },
                    { Type: "Spell", Name: "Full-Cure", UseAt: 20 }
                ],
                Mana: [
                    { Type: "Item", Name: "Mana Elixir", UseAt: 2 },
                    { Type: "Item", Name: "Mana Potion", UseAt: 15 },
                    { Type: "Item", Name: "Mana Draught", UseAt: 40 },
                    { Type: "Item", Name: "Mana Gem", UseAt: 55 }
                ],
                Spirit: [
                    { Type: "Item", Name: "Spirit Elixir", UseAt: 4 },
                    { Type: "Item", Name: "Spirit Potion", UseAt: 30 },
                    { Type: "Item", Name: "Spirit Draught", UseAt: 40 },
                    { Type: "Item", Name: "Spirit Gem", UseAt: 70 }
                ]
-->
        </div>

        <div class="settings_block">
            <span class="item-title">Spirit Abilities</span>
            <p>
                <input type="checkbox" id="fightSpiritActive" ${LocalStorage.NABConfig.Fight.Spirit.Active ? "checked" : ""}>
                <label for="fightSpiritActive">Active</label>
            </p>
            <table>
                <thead>
                    <tr>
                        <th class=center>Use</th>
                        <th class=center>Ability</th>
                        <th class=center colspan=2>Mana</th>
                        <th class=center>Health</th>
                        <th class=center>Overcharge</th>
                        <th>&emsp;&emsp;&emsp;&emsp;</th>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td class=center>
                            <label class="tooltip">Enable At (%)
                                <span class="tooltiptext">
                                    Will active ability if your mana percentage is this or lower
                                </span>
                            </label>
                        </td>
                        <td class=center>
                            <label class="tooltip">Disable At (%)
                                <span class="tooltiptext">
                                    Will disable ability if your mana percentage is this or higher
                                </span>
                            </label>
                        </td>
                        <td class=center>
                            <label class="tooltip">Enable At (%)
                                <span class="tooltiptext">
                                    Will active ability if your health percentage is this or lower
                                </span>
                            </label>
                        </td>
                        <td class=center>
                            <label class="tooltip">Enable At (%)
                                <span class="tooltiptext">
                                    Will active ability if your overcharge percentage is this or higher <br>
                                    Overcharge Goes up to 250, but this percentage is of the total so 100 => 250, 50 => 125
                                </span>
                            </label>
                        </td>
                        <td style="text-align: center;">Order</td>
                    </tr>
                </thead>
                <tbody class='checkMultiple'>
                    ${GetSpiritTable()}
                </tbody>
            </table>
        </div>

        <div class="settings_block">
            <span class="item-title">Idle</span>
                <p>
                    <input type="checkbox" id="idleActive" ${LocalStorage.NABConfig.Idle.Active ? "checked" : ""}>
                    <label for="idleActive" class="tooltip">Active
                        <span class="tooltiptext">
                            Enable/disable all out of combat activities<br>
                            <i>As Auto-Start Battle, Training, Item Repair, Item Enchant and Shopping</i>
                        </span>
                    </label>
                </p>
        </div>

        <div class="settings_block">
            <span class="item-title">Auto-Start Battle</span>
                <p>
                    <input type="checkbox" id="idleBattleActive" ${LocalStorage.NABConfig.Idle.Battle.Active ? "checked" : ""}>
                    <label for="idleBattleActive" class="tooltip">Active
                        <span class="tooltiptext">
                            Auto start all enabled battles one after another <br>
                            <i>Be aware of your items, it'll not repair or enchant them</i>
                        </span>
                    </label>
                </p>
                <p>
                    <input type="checkbox" id="idleBattleDoRingOfBlood" ${LocalStorage.NABConfig.Idle.Battle.DoRingOfBlood ? "checked" : ""}>
                    <label for="idleBattleDoRingOfBlood" class="tooltip">Ring of Blood
                        <span class="tooltiptext">
                            Auto-start Ring of Blood, only "Flying Spaghetti Monster" <br>
                            <i>Only works if you have enough tokens</i>
                        </span>
                    </label>
                </p>
                <p>
                    <label for="idleBattleMinimumStamina" class="tooltip">Minimum Stamina:
                        <span class="tooltiptext">
                            Minimum stamina needed to auto-start the challange
                        </span>
                    </label>
                    <input type="number" id="idleBattleMinimumStamina" value="${LocalStorage.NABConfig.Idle.Battle.MinimumStamina}">
                </p>
                <p>
                    <input type="checkbox" id="idleBattleChangeDifficulty" ${LocalStorage.NABConfig.Idle.Battle.ChangeDifficulty ? "checked" : ""}>
                    <label for="idleBattleChangeDifficulty" class="tooltip">Change Challange Level
                        <span class="tooltiptext">
                            Changes <b>CL</b> to the highest you played the next challenge <br>
                            <i>You need <b>Inline Difficulty Changer</b> for it to work</i>
                        </span>
                    </label>
                </p>

                <p>
                    <input type="checkbox" id="idleBattleUseRestoratives" ${LocalStorage.NABConfig.Idle.Battle.UseRestoratives ? "checked" : ""}>
                    <label for="idleBattleUseRestoratives">Use Restoratives</label>
                </p>
                <p>
                    <label for="idleBattleMaxStaminaToUseRestorative" class="tooltip">Max. Stamina Restore
                        <span class="tooltiptext">
                            You have to have this much of stamina or less for it to auto-use a restorative
                        </span>
                    </label>
                    <input type="number" id="idleBattleMaxStaminaToUseRestorative" value="${LocalStorage.NABConfig.Idle.Battle.MaxStaminaToUseRestorative}">
                </p>
        </div>

        <div class="settings_block">
            <span class="item-title">Character</span>
            <p>
                <input type="checkbox" id="idleCharacterActive" ${LocalStorage.NABConfig.Idle.Character.Active ? "checked" : ""}>
                <label for="idleCharacterActive">Active</label>
            </p>

            <p>
                <input type="checkbox" id="idleCharacterTrainingActive" ${LocalStorage.NABConfig.Idle.Character.Training.Active ? "checked" : ""}>
                <label for="idleCharacterTrainingActive">Training</label>
            </p>
            <p>
                <label for="idleCharacterTrainingMinCredits" class="tooltip">Minimum Credits:
                    <span class="tooltiptext">
                        Minimum amount of credits needed to train
                    </span>
                </label>
                <input type="number" id="idleCharacterTrainingMinCredits" value="${LocalStorage.NABConfig.Idle.Character.Training.MinCredits}">
            </p>
            ${GetMultiple("idleCharacterTrainingPriorityOrder", "Train", LocalStorage.NABConfig.Idle.Character.Training.PriorityOrder, listOfTraining)}
        </div>

        <div class="settings_block">
            <span class="item-title">Forge</span>
            <p>
                <input type="checkbox" id="idleForgeActive" ${LocalStorage.NABConfig.Idle.Forge.Active ? "checked" : ""}>
                <label for="idleForgeActive">Active</label>
            </p>

            <p>
                <input type="checkbox" id="idleForgeRepairActive" ${LocalStorage.NABConfig.Idle.Forge.Repair.Active ? "checked" : ""}>
                <label for="idleForgeRepairActive">Repair Items</label>
            </p>

            <p>
                <input type="checkbox" id="idleForgeEnchantActive" ${LocalStorage.NABConfig.Idle.Forge.Enchant.Active ? "checked" : ""}>
                <label for="idleForgeEnchantActive">Enchant Items</label>
            </p>

            ${GetMultiple("idleForgeEnchantUse", "Enchantment", LocalStorage.NABConfig.Idle.Forge.Enchant.Use, listOfEnchants)}
        </div>
        <div class="settings_block">
            <span class="item-title">Bazaar</span>
            <p>
                <input type="checkbox" id="idleBazaarActive" ${LocalStorage.NABConfig.Idle.Bazaar.Active ? "checked" : ""}>
                <label for="idleBazaarActive">Active</label>
            </p>
            <p>
                <input type="checkbox" id="idleBazaarEquipmentActive" ${LocalStorage.NABConfig.Idle.Bazaar.Equipment.Active ? "checked" : ""}>
                <label for="idleBazaarEquipmentActive" class="tooltip">Sell Trash Equipments
                    <span class="tooltiptext">
                        Rules of Selling:<br>
                        <b>Crude/Fair/Average/Fine</b> items that are worth more than 300 Credits<br>
                        <b>Superior</b> all items<br>
                        <b>Exquisite</b> items that are worth more than 700 Credits<br>
                        <i>&nbsp;• The ones not sold with these qualities are worth Salvaging<br>
                        &nbsp;• The ones with higher quality check if you can sell them in the forum</i>
                    </span>
                </label>
            </p>
            <p>
                <input type="checkbox" id="idleBazaarItemActive" ${LocalStorage.NABConfig.Idle.Bazaar.Item.Active ? "checked" : ""}>
                <label for="idleBazaarItemActive">Buy Items</label>
            </p>
<!-- TODO

                Bazaar: {
                    Active: true,

                    Equipment: {
                        Active: true,
                    },

                    Item: {
                        Active: true,
                        ListToBuy: [
                            // Potions - Check Forum

                            ////// Repair
                            { Name: "Scrap Cloth", Amount: 100 },
                            { Name: "Scrap Wood", Amount: 50 },
                            { Name: "Energy Cell", Amount: 50 },

                            ////// Enchants - Check Forum
                        ]
                    },
                }
-->
        </div>

        <div id="settings_apply">
            <input id="applyChanges" type="button" name="submit" value="Apply Changes">
        </div>
    </div>
</div>
`;

    $$("#mainpane").innerHTML = configHTML;

    setTimeout(function () {

        $$("#applyChanges").onclick = function () {
            //Validation, maybe later?

            LocalStorage.NABConfig.VitalBar = $$("#VitalBar").value;
            LocalStorage.NABConfig.CharacterType = $$("#CharacterType").value;

            // Fight
            LocalStorage.NABConfig.Fight.Active = $$("#fightActive").checked;
            LocalStorage.NABConfig.Fight.ScanCreature = $$("#fightScanCreature").checked;
            LocalStorage.NABConfig.Fight.AttackCreature = $$("#fightAttackCreature").checked;
            LocalStorage.NABConfig.Fight.AdvanceOnVictory = $$("#fightAdvanceOnVictory").checked;
            LocalStorage.NABConfig.Fight.Order = $$("#fightOrder").value;

            // Riddle
            LocalStorage.NABConfig.Riddle.Active = $$("#riddleActive").checked;

            // Buff
            LocalStorage.NABConfig.Fight.Buff.Active = $$("#fightBuffActive").checked;
            LocalStorage.NABConfig.Fight.Buff.Use = getSelectValues($("#fightBuffUse"));

            // Debuff
            LocalStorage.NABConfig.Fight.Debuff.Active = $$("#fightDebuffActive").checked;
            LocalStorage.NABConfig.Fight.Debuff.MinMana = parseInt($$("#fightDebuffMinMana").value);
            LocalStorage.NABConfig.Fight.Debuff.Use = getSelectValues($("#fightDebuffUse"));

            // Potion
            LocalStorage.NABConfig.Fight.Potion.Active = $$("#fightPotionActive").checked;
            LocalStorage.NABConfig.Fight.Potion.UseMysticGem = $$("#fightPotionUseMysticGem").checked;
            LocalStorage.NABConfig.Fight.Potion.PriorityOrder = getSelectValues($("#fightPotionPriorityOrder"));

            // Spirit Abilities
            LocalStorage.NABConfig.Fight.Spirit.Active = $$("#fightSpiritActive").checked;

            var spiritPriorityOrder = getSelectValues($("#fightSpiritPriorityOrder"));
            LocalStorage.NABConfig.Fight.Spirit.PriorityOrder = spiritPriorityOrder;

            LocalStorage.NABConfig.Fight.Spirit.Spirit.Active = "Spirit".In(spiritPriorityOrder);
            LocalStorage.NABConfig.Fight.Spirit.Spirit.Mana.EnableAt = parseInt($$("#fightSpiritSpiritManaEnableAt").value);
            LocalStorage.NABConfig.Fight.Spirit.Spirit.Mana.DisableAt = parseInt($$("#fightSpiritSpiritManaDisableAt").value);
            LocalStorage.NABConfig.Fight.Spirit.Spirit.Overcharge.EnableAt = parseInt($$("#fightSpiritSpiritOverchargeEnableAt").value);


            LocalStorage.NABConfig.Fight.Spirit.Defend.Active = "Defend".In(spiritPriorityOrder);
            LocalStorage.NABConfig.Fight.Spirit.Defend.Health.EnableAt = parseInt($$("#fightSpiritDefendHealthEnableAt").value);
            LocalStorage.NABConfig.Fight.Spirit.Defend.Overcharge.EnableAt = parseInt($$("#fightSpiritDefendOverchargeEnableAt").value);

            LocalStorage.NABConfig.Fight.Spirit.Focus.Active = "Focus".In(spiritPriorityOrder);
            LocalStorage.NABConfig.Fight.Spirit.Focus.Mana.EnableAt = parseInt($$("#fightSpiritFocusManaEnableAt").value);
            LocalStorage.NABConfig.Fight.Spirit.Focus.Overcharge.EnableAt = parseInt($$("#fightSpiritFocusOverchargeEnableAt").value);

            // Idle
            LocalStorage.NABConfig.Idle.Active = $$("#idleActive").checked;

            // Auto-Start Battle
            LocalStorage.NABConfig.Idle.Battle.Active = $$("#idleBattleActive").checked;
            LocalStorage.NABConfig.Idle.Battle.DoRingOfBlood = $$("#idleBattleDoRingOfBlood").checked;
            LocalStorage.NABConfig.Idle.Battle.MinimumStamina = parseInt($$("#idleBattleMinimumStamina").value);
            LocalStorage.NABConfig.Idle.Battle.ChangeDifficulty = $$("#idleBattleChangeDifficulty").checked;
            LocalStorage.NABConfig.Idle.Battle.UseRestoratives = $$("#idleBattleUseRestoratives").checked;
            LocalStorage.NABConfig.Idle.Battle.MaxStaminaToUseRestorative = parseInt($$("#idleBattleMaxStaminaToUseRestorative").value);

            // Character
            LocalStorage.NABConfig.Idle.Character.Active = $$("#idleCharacterActive").checked;
            LocalStorage.NABConfig.Idle.Character.Training.Active = $$("#idleCharacterTrainingActive").checked;
            LocalStorage.NABConfig.Idle.Character.Training.MinCredits = parseInt($$("#idleCharacterTrainingMinCredits").value);
            LocalStorage.NABConfig.Idle.Character.Training.PriorityOrder = getSelectValues($("#idleCharacterTrainingPriorityOrder"));

            // Forge
            LocalStorage.NABConfig.Idle.Forge.Active = $$("#idleForgeActive").checked;
            LocalStorage.NABConfig.Idle.Forge.Repair.Active = $$("#idleForgeRepairActive").checked;
            LocalStorage.NABConfig.Idle.Forge.Enchant.Active = $$("#idleForgeEnchantActive").checked;
            LocalStorage.NABConfig.Idle.Forge.Enchant.Use = getSelectValues($("#idleForgeEnchantUse"));


            // Bazaar
            LocalStorage.NABConfig.Idle.Bazaar.Active = $$("#idleBazaarActive").checked;
            LocalStorage.NABConfig.Idle.Bazaar.Equipment.Active = $$("#idleBazaarEquipmentActive").checked;
            LocalStorage.NABConfig.Idle.Bazaar.Item.Active = $$("#idleBazaarItemActive").checked;

            // UPDATE
            LocalStorage.UpdateConfig();

            //
            location.reload();
        }

        $(".checkMultiple .moveUp").forEach(e => e.onclick = function () {
            var tr = this.parentNode.parentNode
            var prev = tr.previousElementSibling;

            if (prev && prev.nodeName == "TR")
                prev.before(tr);
        });

        $(".checkMultiple .moveDown").forEach(e => e.onclick = function () {
            var tr = this.parentNode.parentNode
            var next = tr.nextElementSibling;

            if (next && next.nodeName == "TR")
                next.after(tr);
        });

        $(".checkMultiple input[type=checkbox]").forEach(e => e.onchange = function () {
            if (this.checked)
                this.parentNode.parentNode.className = 'selected';
            else
                this.parentNode.parentNode.className = '';
        });

        function getSelectValues(select) {
            var result = [];

            for (var i = 0; i < select.length; i++) {
                let opt = select[i];

                if (opt.checked)
                    result.push(opt.value);
            }

            return result;
        }

    }, 100);

}
else {
    window.NotABot = {
        CharacterType: LocalStorage.NABConfig.CharacterType,
        VitalBar: LocalStorage.NABConfig.VitalBar,

        Interval: 0,
        LastLog: "",
        LastRun: 0,

        Begin: function () {
            this.Start();

            let totalExp = $$("#expbar") ? $$("#expbar").width / 1235 * 100 : 0;
            var span = document.createElement("span");

            if ($("#arena_pages").length > 0 || Url.has("s=Character")) {
                span.style = "position: absolute; top: 5px; right: 65px; font-size: 13px; font-weight: bold;";
                span.innerHTML = LocalStorage.NotABot.LastMatch;
            } else {
                if (!localStorage.amoutRandomEncounter)
                    localStorage.amoutRandomEncounter = 0;

                span.style = "position: absolute; top: 1px; right: 110px; cursor: pointer;";
                span.innerHTML = "<span id='startStopBot'>Stop Bot</span><br>" + totalExp.toFixed(2) + "% - " + localStorage.amoutRandomEncounter;
                span.onclick = function () {
                    if (NotABot.Interval > 0)
                        NotABot.Stop();
                    else
                        NotABot.Start();
                };
            }

            document.querySelector("#mainpane").appendChild(span);

        },
        Start: function () {
            if ($$("#pane_log"))
                this.Interval = setInterval(() => NotABot.Run(), 100);
            else
                NotABot.Run();

            if ($$("#startStopBot"))
                $$("#startStopBot").innerText = "Stop Bot";

            Log("Bot Started");
        },
        Stop: function () {
            clearInterval(this.Interval);
            this.Interval = 0;

            if ($$("#startStopBot"))
                $$("#startStopBot").innerText = "Start Bot";

            Log("Bot Stopped");
        },
        Run: function () {
            if ($$("#pane_log")) {
                if ($$("#pane_log").innerText == this.LastLog)
                    return;

                if (this.LastRun != 0)
                    Log(`Sleep Timer: ${new Date() - this.LastRun} ms`);

                this.LastRun = new Date();
                this.LastLog = $$("#pane_log").innerText;

                if (this.Fight.Start())
                    return;

            } else if ($$("#riddlemaster")) {
                if (this.Riddle.Start())
                    return true;
            } else {
                if (this.Idle.Start())
                    return;
            }



            Log("Something Wrong isn't right.", 'warn');
            this.Stop();
        },
        ForceStop: function (param) {
            Log(param, 'error');

            this.Stop();
            throw "FORCE STOP";
        },

        Fight: Object.assign({}, LocalStorage.NABConfig.Fight, {
            NotScanList: [],

            Start: function () {
                if (this.Active) {
                    if (this.Advance())
                        return true;

                    if (this.Player.GetStatus())
                        return true;

                    if (this.Monsters.Load())
                        return true;

                    if (this.Potion.Start())
                        return true;

                    if (this.Spirit.Start())
                        return true;

                    if (this.Buff.Start())
                        return true;

                    if (this.Debuff.Start())
                        return true;

                    if (this.Scan())
                        return true;

                    if (this.Attack())
                        return true;
                }

                return false;
            },

            Buff: Object.assign({}, LocalStorage.NABConfig.Fight.Buff, {
                Start: function () {
                    if (this.Active && this.Use && this.Use.length > 0) {
                        for (let i = 0; i < this.Use.length; i++)
                            if (!this.Use[i].In(NotABot.Fight.Player.Buff))
                                if (NotABot.UseSpell(this.Use[i]))
                                    return true;
                    }

                    return false;
                }
            }),

            Debuff: Object.assign({}, LocalStorage.NABConfig.Fight.Debuff, {
                Start: function () {
                    if (this.Active && NotABot.Fight.Player.Mana > this.MinMana) {
                        //Order by Higher HP to Lower
                        var monsterList = NotABot.Fight.Monsters.List.sort((o, r) => r.Health - o.Health);

                        for (let i = 0; i < monsterList.length; i++) {
                            var monster = monsterList[i];
                            var listDebuff = this.Use.filter(o => !o.In(monster.Debuff) && !NotABot.LastLog.has(monster.Name + " gains the effect " + o));

                            for (var j = 0; j < listDebuff.length; j++) {
                                if (NotABot.UseSpell(listDebuff[j])) {
                                    monster.Click();

                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }
            }),

            Potion: Object.assign({}, LocalStorage.NABConfig.Fight.Potion, {
                Start: function () {
                    if (this.Active) {
                        if (this.UseMysticGem && NotABot.UseItem("Mystic Gem"))
                            return true;

                        for (var i = 0; i < this.PriorityOrder.length; i++) {
                            let priority = this.PriorityOrder[i];
                            let actualValue = NotABot.Fight.Player[priority];
                            let listPotion = this[priority].sort((a, b) => a.UseAt - b.UseAt);

                            for (var j = 0; j < listPotion.length; j++) {
                                let useAt = listPotion[j].UseAt;
                                let type = listPotion[j].Type;
                                let name = listPotion[j].Name;
                                let checkBuff = listPotion[j].CheckBuff;
                                let checkItem = listPotion[j].CheckItem;

                                if (actualValue <= useAt) {
                                    var hasBuff = false;

                                    if (checkBuff)
                                        hasBuff = $$(`#pane_effects img[onmouseover*='${checkBuff}']`);

                                    if (checkItem && ((checkBuff && hasBuff) || !checkBuff)) {
                                        if (typeof checkItem == "string")
                                            checkItem = [checkItem];

                                        for (let i = 0; i < checkItem.length; i++)
                                            if (NotABot.UseItem(checkItem[i]))
                                                return this.UpdateEconomy(name, checkItem[i]);
                                    }
                                    else if (hasBuff)
                                        continue;

                                    if ((type == "Item" && NotABot.UseItem(name)) || (type == "Spell" && NotABot.UseSpell(name)))
                                        return true;
                                }
                            }
                        }
                    }

                    return false;
                },

                UpdateEconomy: function (thisItem, usedItem) {
                    if (!LocalStorage.NotABot.Economy)
                        LocalStorage.NotABot.Economy = 0;

                    if (thisItem.has("Elixir") && usedItem.has("Gem"))
                        LocalStorage.NotABot.Economy += 1000;
                    else if (thisItem.has("Elixir") && usedItem.has("Potion"))
                        LocalStorage.NotABot.Economy += 900;
                    else if (thisItem.has("Potion") && usedItem.has("Gem"))
                        LocalStorage.NotABot.Economy += 100;

                    LocalStorage.Update();

                    return true;
                }
            }),

            Player: Object.assign({}, {
                Health: 0,
                Mana: 0,
                Spirit: 0,
                Overcharge: 0,
                Buff: [],
                GetStatus: function () {
                    try {
                        if (NotABot.VitalBar == "Utilitarian") {
                            this.Health = $$("#dvbh img").width / $$("#dvbh").clientWidth * 100;
                            this.Mana = $$("#dvbm img").width / $$("#dvbm").clientWidth * 100;
                            this.Spirit = $$("#dvbs img").width / $$("#dvbs").clientWidth * 100;
                            this.Overcharge = $$("#dvbc img").width / $$("#dvbc").clientWidth * 100;
                        } else {
                            this.Health = $$("#vbh img").width / $$("#vbh").clientWidth * 100;
                            this.Mana = $$("#vbm img").width / $$("#vbm").clientWidth * 100;
                            this.Spirit = $$("#vbs img").width / $$("#vbs").clientWidth * 100;
                            //this.Overcharge = $$("#vbc img").width / $$("#vbc").clientWidth * 100;
                        }

                        this.GetBuffs();

                        return false;
                    } catch (e) {
                        NotABot.ForceStop("Cound not get your life/mana/spirit/overcharge data.");
                    }

                    return true;
                },

                GetBuffs: function () {
                    this.Buff = [];

                    for (let i = 0; i < $("#pane_effects img").length; i++) {
                        var buff = $("#pane_effects img")[i].onmouseover.toString();
                        buff = buff.substr(buff.indexOf("effect('") + 8);
                        buff = buff.substr(0, buff.indexOf("\',"));

                        this.Buff.push(buff);
                    }
                },
            }),

            Spirit: Object.assign({}, LocalStorage.NABConfig.Fight.Spirit, {
                Start: function () {
                    if (this.Active)
                        for (let i = 0; i < this.PriorityOrder.length; i++)
                            if (this[this.PriorityOrder[i]].Start())
                                return true;

                    return false;
                },

                Spirit: Object.assign({}, LocalStorage.NABConfig.Fight.Spirit.Spirit, {
                    Start: function () {
                        if (this.Active) {
                            let isSet = $$("#ckey_spirit").src.has("spirit_s.png");
                            let isActive = $$("#ckey_spirit").src.has("spirit_a.png");

                            if (NotABot.Fight.Player.Mana <= this.Mana.EnableAt && NotABot.Fight.Player.Overcharge > this.Overcharge.EnableAt && !isActive && !isSet) {
                                Log("  Enabled Battle Spirit");
                                $$("#ckey_spirit").click();

                                return true;
                            }

                            ////// Toggle off not working
                            if (NotABot.Fight.Player >= this.Mana.DisableAt && isActive && !isSet) {
                                Log("  Disabled Battle Spirit");
                                $$("#ckey_spirit").click();

                                return true;
                            }
                        }

                        return false;
                    },
                }),
                Defend: Object.assign({}, LocalStorage.NABConfig.Fight.Spirit.Defend, {
                    Start: function () {
                        if (this.Active) {
                            if (NotABot.Fight.Player.Health <= this.Health.EnableAt && NotABot.Fight.Player.Overcharge > this.Overcharge.EnableAt) {
                                Log("  Defense Mode");
                                $$("#ckey_defend").click();
                                return true;
                            }
                        }

                        return false;
                    },
                }),
                Focus: Object.assign({}, LocalStorage.NABConfig.Fight.Spirit.Focus, {
                    Start: function () {
                        if (this.Active) {
                            if (NotABot.Fight.Player.Mana <= this.Mana.EnableAt && NotABot.Fight.Player.Overcharge > this.Overcharge.EnableAt) {
                                Log("  Focus Mode");
                                $$("#ckey_focus").click();
                                return true;
                            }
                        }

                        return false;
                    },
                })
            }),

            Advance: function () {
                if (this.AdvanceOnVictory) {
                    if ($$("#pane_completion #btcp")) {
                        var message = "";

                        if ($$("#btcp").onclick.toString().has("battle.battle_continue()")) {
                            battle.battle_continue();

                            NotABot.Stop();
                            return true;
                        } else if ($$("#btcp").innerText.has("You have been defeated!")) {
                            let counter = "";

                            if ($$(".hvstat-round-counter"))
                                counter = $$(".hvstat-round-counter").innerHTML;

                            message = "You lost at: " + counter;
                        } else
                            message = "You won!";

                        Log(message, 'info');

                        LocalStorage.NotABot.LastMatch = message;
                        LocalStorage.Update();
                        common.goto_arena();

                        NotABot.Stop();
                        return true;
                    }
                }

                return false;
            },
            Scan: function () {
                if (this.ScanCreature) {
                    var newMonsters = $(".hvstat-scan-button.hvstat-scan-button-highlight");

                    if (newMonsters.length > 0) {
                        var i = 0;

                        while (i < newMonsters.length && newMonsters[i].parentElement.innerText.In(this.NotScanList))
                            i++;

                        if (i < newMonsters.length) {
                            let monsterName = newMonsters[i].parentElement.innerText;

                            if (!monsterName.In(this.NotScanList)) {
                                this.NotScanList.push(monsterName);

                                if (NotABot.UseSpell("Scan")) {
                                    Log('    Monster: ' + newMonsters[i].parentNode.querySelector(".btm3").innerText);
                                    newMonsters[i].className += " scanned";
                                    newMonsters[i].parentElement.click();

                                    return true;
                                }
                            } else {
                                //setInterval(beep, 350);  
                                Log("Error Scan.", 'warn');
                                //NotABot.Stop();
                                //return;
                            }
                        }
                    }
                }

                return false;
            },
            Attack: function () {
                if (this.AttackCreature) {
                    var monster = this.Monsters.GetTarget()

                    if (monster == null)
                        NotABot.ForceStop("Can't find a monster to attack.")

                    let playerClass = NotABot.CharacterType;

                    if (monster.Weakness != "") {
                        var spell = "";

                        while (true) {
                            switch (playerClass) {
                                case "Arch-Mage":
                                    if (this.Monsters.List.length > 7)
                                        playerClass = "Mage 3rd Circle";
                                    else if (this.Monsters.List.length > 5)
                                        playerClass = "Mage 2nd Circle";
                                    else
                                        playerClass = "Mage 1st Circle";

                                    break;
                                case "Mage 3rd Circle": // Will not check if have spell available, this way you can attack the monster with his weakest element with a lower tier Spell
                                    switch (monster.Weakness) {
                                        case "COLD": spell = "Fimbulvertr"; break;
                                        case "DARK": spell = "Ragnarok"; break;
                                        case "ELEC": spell = "Wrath of Thor"; break;
                                        case "FIRE": spell = "Flames of Loki"; break;
                                        case "HOLY": spell = "Paradise Lost"; break;
                                        case "WIND": spell = "Storms of Njord"; break;
                                    }

                                    playerClass = "Mage 2nd Circle";
                                    break;
                                case "Mage 2nd Circle":
                                    switch (monster.Weakness) {
                                        case "COLD": spell = "Blizzard"; break;
                                        case "DARK": spell = "Disintegrate"; break;
                                        case "ELEC": spell = "Chained Lightning"; break;
                                        case "FIRE": spell = "Inferno"; break;
                                        case "HOLY": spell = "Banishment"; break;
                                        case "WIND": spell = "Downburst"; break;
                                    }

                                    playerClass = "Mage 1st Circle";
                                    break;
                                case "Mage 1st Circle":
                                    switch (monster.Weakness) {
                                        case "COLD": spell = "Freeze"; break;
                                        case "DARK": spell = "Corruption"; break;
                                        case "ELEC": spell = "Shockblast"; break;
                                        case "FIRE": spell = "Fiery Blast"; break;
                                        case "HOLY": spell = "Smite"; break;
                                        case "WIND": spell = "Gale"; break;
                                    }

                                    playerClass = "Mage Melee";
                                    break;
                                case "One-Handed":
                                    switch (monster.Weakness) {
                                        case "CRUSHING": spell = "Shield Bash"; break;
                                        case "PIERCING": spell = "Vital Strike"; break;
                                        case "SLASHING": spell = "Merciful Blow"; break;
                                    }

                                    playerClass = "Pony Damage";
                                    break;
                                case "Dual Wielding":
                                    switch (monster.Weakness) {
                                        case "CRUSHING": spell = "Iris Strike"; break;
                                        case "PIERCING": spell = "Backstab"; break;
                                        case "SLASHING": spell = "Frenzied Blows"; break;
                                    }

                                    playerClass = "Pony Damage";
                                    break;
                                case "2-Handed Weapon":
                                    switch (monster.Weakness) {
                                        case "CRUSHING": spell = "Great Cleave"; break;
                                        case "PIERCING": spell = "Rending Blow"; break;
                                        case "SLASHING": spell = "Shatter Strike"; break;
                                    }

                                    playerClass = "Pony Damage";
                                    break;
                                case "Niten Ichiryu":
                                    spell = "Skyward Sword";
                                    playerClass = "Dovahkiin";
                                    break;
                                case "Pony Damage":
                                    spell = "Orbital Friendship Cannon";
                                    playerClass = "Dovahkiin";
                                    break;
                                case "Dovahkiin":
                                    spell = "FUS RO DAH";
                                    playerClass = "Melee";
                                    break;

                                case "Mage Melee":
                                    spell = "Concussive Strike";
                                    playerClass = "Pony Damage";
                                    break;

                                case "Melee":
                                    spell = "Attack";
                                    playerClass = "Default";
                                    break;
                                default:
                                    Log("Could not use skill/spell", 'warn');
                                    return false;
                                    break;
                            }

                            if (spell != "" && NotABot.UseSpell(spell)) {
                                monster.Click();
                                return true;
                            }
                        }

                    } else { // Doesn't have HVStat

                        function AttackMonster(spell) {
                            if (spell != "" && NotABot.UseSpell(spell)) {
                                monster.Click();
                                return true;
                            }
                            return false;
                        }

                        while (true) {
                            switch (playerClass) {
                                case "Arch-Mage":
                                    if (this.Monsters.List.length > 7)
                                        playerClass = "Mage 3rd Circle";
                                    else if (this.Monsters.List.length > 5)
                                        playerClass = "Mage 2nd Circle";
                                    else
                                        playerClass = "Mage 1st Circle";

                                    break;
                                case "Mage 3rd Circle":
                                    if (AttackMonster("Fimbulvertr") || AttackMonster("Ragnarok") || AttackMonster("Wrath of Thor") || AttackMonster("Flames of Loki") || AttackMonster("Paradise Lost") || AttackMonster("Storms of Njord"))
                                        return true;

                                    playerClass = "Mage 2st Circle";
                                    break;
                                case "Mage 2nd Circle":
                                    if (AttackMonster("Blizzard") || AttackMonster("Disintegrate") || AttackMonster("Chained Lightning") || AttackMonster("Inferno") || AttackMonster("Banishment") || AttackMonster("Downburst"))
                                        return true;

                                    playerClass = "Mage 1st Circle";
                                    break;
                                case "Mage 1st Circle":
                                    if (AttackMonster("Freeze") || AttackMonster("Corruption") || AttackMonster("Shockblast") || AttackMonster("Fiery Blast") || AttackMonster("Smite") || AttackMonster("Gale"))
                                        return true;

                                    playerClass = "Mage Melee";
                                    break;
                                case "One-Handed":
                                    if (AttackMonster("Shield Bash") || AttackMonster("Vital Strike") || AttackMonster("Merciful Blow"))
                                        return true;

                                    playerClass = "Pony Damage";
                                    break;
                                case "Dual Wielding":
                                    if (AttackMonster("Iris Strike") || AttackMonster("Backstab") || AttackMonster("Frenzied Blows"))
                                        return true;

                                    playerClass = "Pony Damage";
                                    break;

                                case "2-Handed Weapon":
                                    if (AttackMonster("Great Cleave") || AttackMonster("Rending Blow") || AttackMonster("Shatter Strike"))
                                        return true;

                                    playerClass = "Pony Damage";
                                    break;

                                case "Niten Ichiryu":
                                    if (AttackMonster("Skyward Sword"))
                                        return true;

                                    playerClass = "Pony Damage";
                                    break;

                                case "Pony Damage":
                                    if (AttackMonster("Orbital Friendship Cannon"))
                                        return true;

                                    playerClass = "Dovahkiin";
                                    break;

                                case "Dovahkiin":
                                    if (AttackMonster("FUS RO DAH"))
                                        return true;

                                    playerClass = "Melee";
                                    break;

                                case "Mage Melee":
                                    if (AttackMonster("Concussive Strike"))
                                        return true;

                                    playerClass = "Pony Damage";
                                    break;

                                case "Melee":
                                    if (AttackMonster("Attack"))
                                        return true;

                                    playerClass = "Default";
                                    break;

                                default:
                                    Log("Could not use skill/spell", 'warn');
                                    return false;
                                    break;
                            }
                        }
                    }
                }

                return false;
            },

            Monsters: {
                List: [],
                Load: function () {
                    this.List = [];
                    var listMonster = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']");

                    var roundContext = localStorage["hvStat.roundContext"];

                    if (roundContext) {
                        roundContext = JSON.parse(roundContext).monsters;
                        roundContext = roundContext.filter(a => a.actualHealthPoint > 0);
                    }

                    for (var i = 0; i < listMonster.length; i++) {
                        var Object = listMonster[i];
                        var Name = Object.querySelector(".btm3").innerText;
                        var Weakness = "";
                        var WeaknessValue = 9999;
                        var Health = parseInt(Object.querySelector(".hvstat-monster-health").innerText.split('/')[0]);
                        var Debuff = [];
                        var Click = function () {
                            Log('    Monster: ' + this.Name);
                            this.Object.click();
                        };

                        if (roundContext) {
                            var mContext = roundContext[i].scanResult;

                            // Didn't scan this monster yet
                            if (mContext) {
                                mContext = mContext.defenseLevel;
                                function checkAttribute(attr) {
                                    if (mContext[attr] && mContext[attr] < WeaknessValue) {
                                        Weakness = attr;
                                        WeaknessValue = parseInt(mContext[attr]);
                                    }
                                }

                                if (["Arch-Mage", "Mage 3rd Circle", "Mage 2nd Circle", "Mage 1st Circle"].contains(NotABot.CharacterType)) {
                                    checkAttribute("COLD");
                                    checkAttribute("DARK");
                                    checkAttribute("ELEC");
                                    checkAttribute("FIRE");
                                    checkAttribute("HOLY");
                                    checkAttribute("WIND");
                                } else {
                                    checkAttribute("CRUSHING");
                                    checkAttribute("PIERCING");
                                    checkAttribute("SLASHING");
                                }

                                //checkAttribute("SOUL");
                                //checkAttribute("VOID");
                            }
                        }

                        var listDebuff = Object.querySelectorAll(".btm6 img");
                        for (let j = 0; j < listDebuff.length; j++) {
                            var debuff = listDebuff[j].onmouseover.toString();
                            debuff = debuff.substr(debuff.indexOf("effect('") + 8);
                            debuff = debuff.substr(0, debuff.indexOf("\',"));

                            Debuff.push(debuff);
                        }

                        this.List.push({ Name, Object, Weakness, WeaknessValue, Health, Debuff, Click });
                    }

                    return false;
                },

                GetByName: function (name) {
                    var monster = this.List.filter(r => r.Name == name);

                    if (monster.length > 0)
                        return monster[0];

                    return null;
                },

                GetWeakest: function () {
                    var monster = this.List.sort((a, b) => a.WeaknessValue - b.WeaknessValue)[0];

                    if (monster.WeaknessValue > 100)
                        return null;

                    return monster;
                },

                GetLowerHP: function () {
                    var monster = this.List.sort((a, b) => a.Health - b.Health)[0];

                    return monster;
                },

                GetBosses: function () {
                    /// Monsters to Focus Damage
                    var monster = this.GetByName("Yggdrasil");  //Heal

                    if (monster == null)
                        monster = this.GetByName("Flying Spaghetti Monster");  //Puff of Logic

                    //if(monster == null)
                    //  monster = this.GetByName("Drogon");
                    //
                    //if(monster == null)
                    //  monster = this.GetByName("Rhaegal");
                    //
                    //if(monster == null)
                    //  monster = this.GetByName("Viserion");
                    //
                    //if(monster == null)
                    //  monster = this.GetByName("Real Life");

                    return monster;
                },

                GetTarget: function () {
                    if (this.List.length == 0) {
                        this.Load();

                        if (this.List.length == 0)
                            return null;
                    }

                    var monster = this.GetBosses();

                    if (monster != null)
                        return monster;

                    switch (NotABot.Fight.Order.toString()) { // Tactics
                        case '1':  //  Use AoE middle
                            monster = this.List[this.List > 1 ? parseInt(this.List.length / 2) : 0];
                            break;
                        case '2': //  Kill the weakest first
                            monster = this.GetWeakest();

                            if (monster == null)
                                monster = this.GetLowerHP();

                            break;
                        case '3': //  Kill the Lower HP First
                            monster = this.GetLowerHP();
                            break;
                        default: //  Dumbest Strategy First in First Out.
                            monster = this.List[0];
                            break;
                    };

                    if (monster == null)
                        monster = this.List[0];

                    return monster;
                }
            },
        }),
        Riddle: Object.assign({}, LocalStorage.NABConfig.Riddle, {
            Start: function () {
                if (this.Active) {
                    var src = $$("#riddlebot img").src;
                    src = src.substr(src.indexOf("&v=") + 3);

                    var answer = this.Combinations[src];

                    if (answer != null) {
                        LocalStorage.NotABot.LastRiddleAnswer = "Your ass has been saved by the all mighty god. Answer: " + answer;
                        LocalStorage.Update();

                        Log(LocalStorage.NotABot.LastRiddleAnswer, 'info');

                        $$('#riddleanswer').value = answer;
                        $$('#riddleform').submit();
                    } else {
                        // Save Combination
                        $$("#riddleanswer").addEventListener('change', function () {
                            LocalStorage.NABConfig.Riddle.Combinations[src] = $$("#riddleanswer").value;
                            LocalStorage.UpdateConfig();
                        });

                        beep();
                        setInterval(beep, 150);
                    }

                    return true;
                }

                return false;
            },
            //Probe This 
            Combinations: Object.assign({}, LocalStorage.NABConfig.Riddle.Combinations, {
                "500d9639f0": "A", "c040b1cf0e": "A", "4693637779": "A", "6621d9201a": "A", "a0fe68a1e1": "A", "637a3dd556": "A", "cfdaabf41b": "A", "31d426a146": "A",
                "2260367281": "A", "86cd089cb4": "A", "52093b0bf9": "A", "b8c0a5c1f2": "A", "e61491ee54": "A", "712953d5f0": "A", "d6ebb0c744": "A", "126965ee78": "A",
                "f573e87f84": "A", "ddb1c99260": "A", "9898df62f7": "A", "a3cea27f08": "A", "2eecad477c": "A", "2e748a532e": "A", "c727bb52db": "A", "4eaf25d099": "A",
                "8e73159fd8": "A", "da7a5af305": "A", "6ae1a72220": "A", "6574e82166": "A", "68d3878db4": "A", "13fb1c539a": "A", "f3c423a3c3": "A", "afbdd89f1b": "A",
                "69ae72d5fd": "A", "01a5e680e3": "A", "975b585ef2": "A", "989888a608": "A", "cee8e2e514": "A", "15edb52243": "A", "2f008f459e": "A", "7fae3c5378": "A",
                "a1691c3bca": "A", "d3a232166a": "A", "417922cf6f": "A", "86bd55029d": "A", "ecd040753e": "A", "98f0b05812": "A", "0133dcf8ff": "A", "0db0d1e7ca": "A",
                "2f611c7e9d": "A", "800e90373a": "A", "350832f33b": "A", "5f9bc1e329": "A", "080aebe956": "A", "35718c3461": "A", "3152a5c492": "A", "577c9249b4": "A",
                "ea39531e99": "A", "80ef2d34ba": "A", "71a0540ab3": "A", "74aa048e5f": "A", "6104552404": "A", "3d9db08e8b": "A", "c1f3b70a0d": "A", "8dcf30cf81": "A",
                "5dd60754c0": "A", "5c004127ff": "A", "7ef6e104ed": "A", "43d715d790": "A", "328a375b54": "A", "447f89b1aa": "A", "24323f7591": "A", "41728c37ee": "A",
                "d61d979dc3": "A", "da031759a6": "A", "e7d9b3dfec": "A", "f962c97a60": "A", "5d3819f901": "A", "d87995248a": "A", "ff760cb6fa": "A", "0949f79b0d": "A",
                "59d5524260": "A", "0aade01716": "A", "1d5cbef3ee": "A", "3f5ec4383f": "A", "5f5e040a45": "A", "5fddd55baa": "A", "6c3e2b1858": "A", "9ca1ec8fd3": "A",
                "125d9d2f0d": "A", "213bb32b6b": "A", "854ed0bade": "A", "2253afffab": "A", "4246b4e95e": "A", "558818d786": "A", "b3b858b48a": "A", "bdff26caa2": "A",
                "c704934088": "A", "cc92cdb622": "A", "cf8c85583c": "A", "d679928a20": "A", "e5f9f8abc8": "A", "e8a2695658": "A", "5e4cde11e2": "A", "6c56fa21d2": "A",
                "7f88b35f55": "A", "8f6dfc9dca": "A", "045fe92900": "A", "70fd7170d9": "A", "82a815a1fc": "A", "aeb1cd41bf": "A", "cd900bb990": "A", "eea1c39409": "A",
                "0b8b6b712a": "A", "0cbe6bea25": "A", "4b9482ca7c": "A", "5e1860ee81": "A", "53c15f7ce0": "A", "9032d471c1": "A", "42598d740a": "A", "cb0ea0641e": "A",
                "d86498d578": "A", "fd154582fd": "A", "b806d988bb": "A", "5bd6f4650c": "A", "6d2ddb1099": "A", "2148fa674c": "A", "361813807d": "A", "a66bcfafc2": "A",
                "ea093c0e86": "A", "e72f190d05": "A",


                "404543f2b2": "B", "89a4ecdacd": "B", "7811dfe40d": "B", "8480600ebd": "B", "cd035d1831": "B", "0af3b04e8d": "B", "5086ec68ed": "B", "3f61d24447": "B",
                "182d227be2": "B", "daefa9752a": "B", "27900890bd": "B", "010cac29dc": "B", "3fa836e583": "B", "2d1cef08dd": "B", "5877a95912": "B", "6728d3c5fb": "B",
                "a92887a00d": "B", "983f700578": "B", "e7cd6e413c": "B", "80aa025f23": "B", "39954aa3b8": "B", "99794cbcf5": "B", "b305f18a51": "B", "a00b2b82cc": "B",
                "9a585d1555": "B", "06b7fce8e3": "B", "284e31f095": "B", "3469f0a205": "B", "1f5ab6f560": "B", "a7d8cc63ed": "B", "ec992e36b2": "B", "cddf856293": "B",
                "289c82d71f": "B", "4e10610033": "B", "04f4ea5393": "B", "1a7571fbc4": "B", "3c2f3077c6": "B", "2d9d279375": "B", "4636d7656c": "B", "bd6182d69a": "B",
                "a59e91221d": "B", "2d218742d1": "B", "3de66c069f": "B", "6c4f507af1": "B", "bee3e88016": "B", "f6c0f4a32d": "B", "7584915107": "B", "00827da8f1": "B",
                "96cd09f7a7": "B", "65802d548c": "B", "b776986bf6": "B", "2da4a7f68b": "B", "3e39cd2b93": "B", "6e3a791a83": "B", "040d29fafc": "B", "0345981b22": "B",
                "1248400ddd": "B", "a97c0754e4": "B", "af0ef68601": "B", "d8f2654483": "B", "e98c0df177": "B", "52866efc71": "B", "0f93b2989f": "B", "1d74c365cc": "B",
                "6d871fdccb": "B", "7f5ddf4bf2": "B", "676ece5b8d": "B", "797a27f695": "B", "838510f311": "B", "a5bdf6e7f6": "B", "a7a40bb35c": "B", "adb155e026": "B",
                "b42e26a312": "B", "d4d1e968d8": "B", "e09327199c": "B", "e9f76266a4": "B", "f24e4146b7": "B", "f3598206c6": "B", "8b1f535295": "B", "23c50130fe": "B",
                "38a4f15107": "B", "614b755d75": "B", "2371a167d0": "B", "6409d489ef": "B", "8083c26166": "B", "65520f5bab": "B", "b7d4f997c2": "B", "c5b4003837": "B",
                "d584219d07": "B", "e916efd5c4": "B", "28a1ffbecc": "B", "054cf7a313": "B", "059a67a6a4": "B", "611c5645a0": "B", "c135ae5d87": "B", "e86ff53284": "B",
                "8c5699fce7": "B", "83f78fd6fa": "B", "57003f680f": "B", "a7bb88d67a": "B", "b04f6cbfd5": "B", "b06459b9f5": "B", "b97f44709f": "B", "c78c1fe270": "B",
                "e5dcace5b0": "B", "eb56ed9cd9": "B", "fecd79b20d": "B", "684cd7a565": "B",



                "0401027bc9": "C", "15fd621b9e": "C", "c636d8ec4f": "C", "9518ec52e5": "C", "9983bf2c32": "C", "ac54f4fe00": "C", "394fb8d004": "C", "24006660f5": "C",
                "454e9d852b": "C", "bd5cc28054": "C", "1a45149570": "C", "5f82e0f9c9": "C", "20fd0048ff": "C", "0861b61cdc": "C", "18fb4b4a6e": "C", "a036f0ba2b": "C",
                "1b87a375a0": "C", "08893df887": "C", "6d02b7f91f": "C", "7be47fe5c0": "C", "dead34f02c": "C", "2da78f830e": "C", "e2af2b85b7": "C", "679c46d24f": "C",
                "5fd15f8441": "C", "dff931677d": "C", "5d77db91eb": "C", "e644af1f91": "C", "8df9c54ecd": "C", "0476ce9792": "C", "0a22ae7ab8": "C", "f21aec32a1": "C",
                "359872d4e2": "C", "359872d4e2": "C", "fa8bd05562": "C", "6a2049d80e": "C", "212b4b2e14": "C", "008a0e7da2": "C", "851e60e433": "C", "eb7730b6e9": "C",
                "850537ea00": "C", "915b437112": "C", "0f1c10d2c4": "C", "3167499740": "C", "2abcc758a0": "C", "47eb93fefd": "C", "648db2ffbd": "C", "eb5e0b6a1e": "C",
                "670a179c05": "C", "63879d1d3b": "C", "c409289cf9": "C", "db6ea25f49": "C", "423eec71f8": "C", "4bfe8af641": "C", "cce87a3fa1": "C", "e6c556688d": "C",
                "05f277f84c": "C", "77630db5f3": "C", "80e3f62a40": "C", "6bf9d9c0dd": "C", "4e84ef9d66": "C", "9137191227": "C", "abdd96e8b5": "C", "439d60f539": "C",
                "91d7cc49ec": "C", "6c13b1759e": "C", "6bb644d7dc": "C", "2a9145c902": "C", "7d59f43a5f": "C", "64bcacb74d": "C", "164d361036": "C", "393e649d8f": "C",
                "816569e0bb": "C", "551237152b": "C", "ad0abfc3d6": "C", "bd8efb9594": "C", "5e16633b1c": "C", "9720fe534a": "C", "ac1138287f": "C", "c66dded406": "C",
                "3dba4c6b4b": "C", "4e11d95f32": "C", "7f9517b7b4": "C", "7a5a2ba592": "C", "25e510f1cc": "C", "27cf3be022": "C", "81ebefc331": "C", "95d4bf1014": "C",
                "671a96664e": "C", "829cc3b035": "C", "951eeee4a5": "C", "2241d169cc": "C", "2567a160c8": "C", "8813ecb8dd": "C", "479871fdc6": "C", "34376007a5": "C",
                "ab0fb16121": "C", "af39a39a80": "C", "baa7060ef8": "C", "c5a0d1f62a": "C", "c885d3a521": "C", "ccae497e5f": "C", "d934e13eec": "C", "eb6b1a4f96": "C",
                "ff76d701b7": "C", "8f9636de64": "C", "113e1732e4": "C", "946d4b98ca": "C", "9832b0b8d4": "C", "271760f0aa": "C", "0381933a1e": "C", "604375f4d6": "C",
                "624114fc48": "C", "1789479028": "C", "a47407f629": "C", "b5b92bdd30": "C", "4c54913696": "C", "67ae24a491": "C", "2c5edddd31": "C", "53cf1b7ff6": "C",
                "5055d73a6a": "C", "40062a32f7": "C", "a730a860d3": "C", "dff16b6b10": "C", "4deb8a6d40": "C",

            })
        }),
        Idle: Object.assign({}, LocalStorage.NABConfig.Idle, {
            Start: function () {
                if (this.Active) {
                    //TODO: Start Idling Sending people from one side to the other. Check if it's not in the page first,
                    // also be away to no be thrown in a loop, going from one page to another instead of doing the rest

                    if (Url.has("s=Character") || Url == "https://hentaiverse.org/")
                        return this.Character.Start();

                    if (Url.has("s=Bazaar"))
                        return this.Bazaar.Start();

                    if (Url.has("s=Battle") && (Url.has("ss=ar") || Url.has("ss=rb")))
                        return this.Battle.Start();

                    if (Url.has("s=Forge"))
                        return this.Forge.Start();
                }

                return false;
            },

            Character: Object.assign({}, LocalStorage.NABConfig.Idle.Character, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("ss=ch") || Url == "https://hentaiverse.org/") // Character
                            return this.Character.Start();

                        if (Url.has("ss=eq")) // Equipment
                            return true;

                        if (Url.has("ss=ab")) // Abilities
                            return true;

                        if (Url.has("ss=tr")) //  Training
                            return this.Training.Start();

                        if (Url.has("ss=it")) // Item Inventory
                            return true;

                        if (Url.has("ss=in")) // Equip Inventory
                            return true;

                        if (Url.has("ss=se")) // Settings
                            return true;
                    }

                    return false;
                },

                Training: Object.assign({}, LocalStorage.NABConfig.Idle.Character.Training, {
                    ListTrain: {
                        "Adept Learner": 50,
                        "Assimilator": 51,
                        "Ability Boost": 80,
                        "Manifest Destiny": null,
                        "Scavenger": 70,
                        "Luck of the Draw": 71,
                        "Quartermaster": 72,
                        "Archaeologist": 73,
                        "Metabolism": null,
                        "Inspiration": null,
                        "Scholar of War": 90,
                        "Tincture": 91,
                        "Pack Rat": 98,
                        "Dissociation": null,
                        "Set Collector": 96
                    },

                    Start: function () {
                        if (this.Active) {
                            let credits = $(".fc4.fal.fcb").contains('Credits')[0].innerText.replace('Credits: ', '').replace(',', '');

                            credits = parseInt(credits);

                            if (credits > this.MinCredits) {
                                for (var i = 0; i < this.PriorityOrder.length; i++) {
                                    let num = this.ListTrain[this.PriorityOrder[i]];

                                    if (num && $$(`img[onclick='training.start_training(${num})']`)) {
                                        training.start_training(num);
                                        LocalStorage.NotABot.LastTraining = new Date();
                                        LocalStorage.Update();

                                        return true;
                                    }
                                }
                            }
                        }

                        return false;
                    },
                }),

                Character: {
                    Start: function () {
                        /* Persona */
                        var persona = $$("[name='persona_set'] [selected]").innerText;
                        LocalStorage.CheckPersona(persona);

                        /* Correct Bugs */
                        window.update_usable_exp = function () {
                            usable_exp = total_exp;

                            for (i in attr_keys) {
                                if (i == "contains") continue;
                                var current_level = attr_current[attr_keys[i]] + attr_delta[attr_keys[i]];
                                usable_exp -= get_total_expcost(current_level);
                            }
                        }

                        window.update_display = function (which) {
                            document.getElementById(which + "_display").innerHTML = common.get_dynamic_digit_string(attr_current[which] + attr_delta[which]);
                            document.getElementById(which + "_text").innerHTML = common.get_dynamic_digit_string(attr_delta[which]);
                            document.getElementById("remaining_exp").innerHTML = common.get_dynamic_digit_string(usable_exp);

                            for (i in attr_keys) {
                                if (i == "contains") continue;
                                var current_level = attr_current[attr_keys[i]] + attr_delta[attr_keys[i]];
                                var next_exp = get_next_expcost(current_level);
                                var enable_inc = next_exp <= usable_exp;
                                var enable_dec = attr_delta[attr_keys[i]] > 0 || (doovers > 0 && current_level > 0);

                                document.getElementById(attr_keys[i] + "_inc").src = "/y/character/inc" + (enable_inc ? "" : "_d") + ".png";
                                document.getElementById(attr_keys[i] + "_dec").src = "/y/character/dec" + (enable_dec ? "" : "_d") + ".png";
                                document.getElementById(attr_keys[i] + "_left").innerHTML = common.get_dynamic_digit_string(next_exp);
                            }
                        }

                        window.do_attr_post = function () {
                            for (i in attr_keys) {
                                if (i == "contains") continue;
                                document.getElementById(attr_keys[i] + "_delta").value = attr_delta[attr_keys[i]];
                            }

                            document.getElementById('attr_form').submit();
                        }

                        return true;
                    }
                },
            }),

            Bazaar: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("&ss=es")) // Equipment Shop
                            return this.Equipment.Sell();

                        if (Url.has("&ss=is")) // Item Shop
                            return this.Item.Buy();

                        if (Url.has("&ss=ib")) // Item Bot
                            return true;

                        if (Url.has("&ss=ml")) // Monster Lab
                            return true;

                        if (Url.has("&ss=ss")) // Shrine
                            return true;

                        if (Url.has("&ss=mm")) // Mail
                            return true;

                        if (Url.has("&ss=ss")) //Shrine
                            return true;

                        if (Url.has("&ss=lt")) // Armor Lottery
                            return true;

                        if (Url.has("&ss=la")) // Weapon Lottery
                            return true;
                    }

                    return false;
                },

                Equipment: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar.Equipment, {
                    QualityList: ['Crude', 'Fair', 'Average', 'Fine', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'],

                    Sell: function () {
                        if (this.Active) {
                            var items = $("#item_pane.cspp .eqp > div:not(.iu)");
                            var itemsSelected = 0;

                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                var itemId = item.id.replace("e", "")
                                var itemName = item.innerText;

                                var quality = this.GetItemQuality(itemName);
                                var price = eqvalue[itemId];

                                if ((quality.In(['Crude', 'Fair', 'Average', 'Fine']) && price > 300) || quality == 'Superior' || (quality == 'Exquisite' && price > 700)) {
                                    equipshop.set_equip(item, null, 'item_pane')
                                    itemsSelected++;
                                }
                            }

                            if (itemsSelected > 0)
                                $$("#accept_button").click()

                            return true;
                        }

                        return false;
                    },

                    GetItemQuality: function (item) {
                        for (var i = 0; i < this.QualityList.length; i++)
                            if (item.has(this.QualityList[i]))
                                return this.QualityList[i];

                        return "None"
                    },
                }),

                Item: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar.Item, {

                    Buy: function () {
                        if (this.Active) {
                            for (let i = 0; i < this.ListToBuy.length; i++) {
                                let item = this.ListToBuy[i];

                                var youHave = $("#item_pane tr").contains(item.Name);

                                if (youHave.length > 0) {
                                    youHave = youHave[0].querySelector("td:last-child").innerText;
                                    youHave = parseInt(youHave);
                                } else
                                    youHave = 0;

                                if (youHave < item.Amount) {
                                    let shop = $("#shop_pane td > div").contains(item.Name);

                                    if (shop.length > 0) {
                                        shop[0].click();

                                        itemshop.increase_count(item.Amount - youHave);
                                        itemshop.commit_transaction();

                                        return true;
                                    }
                                }
                            }
                        }

                        return false;
                    }
                }),
            }),

            Battle: Object.assign({}, LocalStorage.NABConfig.Idle.Battle, {
                Start: function () {
                    if (this.Active) { // Auto start arena future

                        if ($("#arena_list").length > 0) {
                            let tempStamina = 0;

                            if ($$(".fc4.far.fcb"))
                                tempStamina = parseInt($$(".fc4.far.fcb").innerText.replace("Stamina:", ""));

                            if (tempStamina > this.MinimumStamina && Url.has("&ss=ar") || this.DoRingOfBlood) {
                                var listArena = $("#arena_list tr > td:last-child > img[src='/y/arena/startchallenge.png']");

                                if (listArena.length == 0) {
                                    if (Url.has("&ss=ar") && !Url.has("&page=2"))
                                        window.location.href += "&page=2";
                                } else {
                                    var arena = listArena[0];

                                    if (this.SetDifficulty(arena))
                                        return true;

                                    //Start Arena
                                    window["init_battle"] = function (id, entrycost, token) {
                                        $$("#initid").value = id;
                                        $$("#inittoken").value = token;
                                        $$("#initform").submit();
                                    }

                                    arena.click();
                                }

                                return true;
                            }
                        }
                    }

                    return false;
                },

                SetDifficulty: function (arena) {
                    // Change Difficulty
                    if (this.ChangeDifficulty) {
                        if ($$(".fc4.far.fcb select").style.display == 'none') return;

                        var difficulty = arena.parentElement.parentElement.children[1].innerText.trim();
                        var selectedDifficulty = $$(".fc4.far.fcb select").value;

                        if (difficulty != selectedDifficulty) {
                            let option = $('.fc4.far.fcb select option').contains(difficulty);
                            option[0].selected = true;

                            var e = { "target": $$(".fc4.far.fcb select") };
                            e.target.onchange(e);

                            return true;
                        }
                    }

                    return false;
                },
            }),

            Forge: Object.assign({}, LocalStorage.NABConfig.Idle.Forge, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("&ss=re")) // Repair
                            return this.Repair.Start();

                        if (Url.has("&ss=up")) // Upgrade
                            return true;

                        if (Url.has("&ss=en")) // Enchant
                            return this.Enchant.Start();

                        if (Url.has("&ss=sa")) // Salvage
                            return true;

                        if (Url.has("&ss=fo")) // Reforge
                            return true;

                        if (Url.has("&ss=fu")) // Soulfuse
                            return true;
                    }

                    return false;
                },

                Repair: Object.assign({}, LocalStorage.NABConfig.Idle.Forge.Repair, {
                    Start: function () {
                        if (this.Active) {
                            if ($$('img[src="/y/shops/repairall.png"]')) {
                                if ($(".fc2.fac.fcr").contains("Insufficient materials.").length > 0)
                                    return true;

                                document.getElementById('repairall').submit();
                                return true;
                            }
                        }

                        return false;
                    }
                }),

                Enchant: Object.assign({}, LocalStorage.NABConfig.Idle.Forge.Enchant, {
                    List: {
                        "Voidseeker's Blessing": 'vseek',
                        "Suffused Aether": 'ether',
                        "Featherweight Charm": 'feath',
                        "Infused Flames": 'pfire',
                        "Infused Frost": 'pcold',
                        "Infused Lightning": 'pelec',
                        "Infused Storm": 'pwind',
                        "Infused Divinity": 'pholy',
                        "Infused Darkness": 'pdark'
                    },

                    Start: function () {
                        if (this.Active) {
                            var listEquip = $(".eqp > :last-child");

                            //if (!LocalStorage.NotABot.Enchant) {
                            //    LocalStorage.NotABot.Enchant = [];
                            //    LocalStorage.Update();
                            //}

                            if (listEquip.length > 0) { // First Page
                                //    if (LocalStorage.NotABot.Enchant.length == 0) {
                                //        for (let i = 0; i < listEquip.length; i++)
                                //            LocalStorage.NotABot.Enchant.push(listEquip[i].id.substring(1));
                                //
                                //        LocalStorage.NotABot.Enchant.push("End");
                                //        LocalStorage.Update();
                                //    }
                                //
                                //    let $equip = LocalStorage.NotABot.Enchant[0];
                                //
                                //    if ($equip == "End") {
                                //        Log("Finished Enchanting", 'info');
                                //        return true;
                                //    }
                                //
                                //
                                //    $$("#e" + $equip).click();
                                //    forge.commit_transaction()
                                //
                                //    LocalStorage.NotABot.Enchant.shift();
                                //    LocalStorage.Update();

                                return true;
                            } else { // Enchant Page
                                let isWeapon = $(".fc2.far.fcb").contains("Voidseeker's Blessing").length > 0;

                                for (let i = 0; i < this.Use.length; i++) {

                                    let $enchant = this.Use[i];
                                    let $code = this.List[$enchant];

                                    if (isWeapon && $code[0] == "p")
                                        $code = "s" + $code.substr(1);

                                    if (!isWeapon && $code[0] != "p" && $code != "feath")
                                        continue;

                                    let equip = $$("#ee")?.innerText;

                                    //Use Enchant
                                    if (!equip || !equip.has($enchant)) {
                                        $$('#enchantment').value = $code;
                                        $$('#forgeform').submit()

                                        return true;
                                    }
                                }

                                return true;
                                //this.GoBack();
                            }
                        }

                        return false;
                    },
                    GoBack: function () {
                        var goBack = "https://hentaiverse.org/?s=Forge&ss=en&filter=equipped";
                        location.href = goBack;
                    },
                }),
            }),
        }),

        ListSkill: {
            //Skills
            "Flee": 1001, "Scan": 1011, "Attack": "ckey_attack",

            // Niten Ichiryu
            "Skyward Sword": 2101,

            // One-Handed
            "Shield Bash": 2201, "Vital Strike": 2202, "Merciful Blow": 2203,

            // 2-Handed Weapon
            "Great Cleave": 2301, "Rending Blow": 2302, "Shatter Strike": 2303,

            // Dual Wielding
            "Iris Strike": 2401, "Backstab": 2402, "Frenzied Blows": 2403,

            // Staff
            "Concussive Strike": 2501,

            // Spells
            "Fiery Blast": 111, "Inferno": 112, "Flames of Loki": 113,
            "Freeze": 121, "Blizzard": 122, "Fimbulvertr": 123,
            "Shockblast": 131, "Chained Lightning": 132, "Wrath of Thor": 133,
            "Gale": 141, "Downburst": 142, "Storms of Njord": 143,
            "Smite": 151, "Banishment": 152, "Paradise Lost": 153,
            "Corruption": 161, "Disintegrate": 162, "Ragnarok": 163,

            // Deprecating
            "Drain": 211, "Weaken": 212, "Imperil": 213,
            "Slow": 221, "Sleep": 222, "Confuse": 223,
            "Blind": 231, "Silence": 232, "MagNet": 233,

            // Curative
            "Cure": 311, "Regen": 312, "Full-Cure": 313,

            // Supportive
            "Protection": 411, "Haste": 412, "Shadow Veil": 413,
            "Absorb": 421, "Spark of Life": 422, "Spirit Shield": 423,
            "Heartseeker": 431, "Arcane Focus": 432,

            // Specials
            "Orbital Friendship Cannon": 1111, "FUS RO DAH": 1101
        },
        UseSpell: function (spellName) {
            var spell = $$('#' + this.ListSkill[spellName]);

            if (spell && spell.style.opacity != "0.5") {
                Log('  Skill/Spell Used: ' + spellName);
                spell.click();

                return true;
            }

            //Log('  Could not use Skill/Spell: ' + spellName)
            return false;
        },
        UseItem: function (itemName) {
            var items = $("#pane_item div[id^='ikey_']").contains(itemName);

            if (items.length > 0) {
                Log("  Item Used " + itemName);
                items[0].click();

                return true;
            }

            //Log("  Could not use Item: " + itemName)
            return false;
        },
    };

    NotABot.Begin();
}
