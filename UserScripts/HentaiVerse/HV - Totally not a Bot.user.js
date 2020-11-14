// ==UserScript==
// @name       HV - [NAT] Not A Bot
// @namespace  Hentai Verse
// @version    2.6.0
// @author     Svildr
// @match      https://hentaiverse.org/*
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==

var NABVersion = "2.6.0";
var isLogging = false;


///////////
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

window.LocalStorage = {
    NotABot: {
        Persona: "",
        ListPersona: [],
        Idle: false,
        IdlePos: -1,
        Riddle: {}
    },
    NABConfig: {},

    Update: function () {
        localStorage.NotABot = JSON.stringify(LocalStorage.NotABot);
    },
    Load: function () {
        if (localStorage.NotABot) {
            this.NotABot = JSON.parse(localStorage.NotABot)

            if (!this.NotABot.Persona && this.NotABot.ListPersona.length > 0) {
                this.NotABot.Persona = this.NotABot.ListPersona[0];
                this.Update();
            }
        }
        else
            localStorage.NotABot = JSON.stringify(this.NotABot);


        if (!this.NotABot.Persona && Url != "https://hentaiverse.org/")
            location.href = "https://hentaiverse.org/";

        if ($$("[name='persona_set'] [selected]")) /* Persona */
            this.CheckPersona($$("[name='persona_set'] [selected]").innerText);
    },

    UpdateConfig: function () {
        localStorage["NABConfig." + this.NotABot.Persona] = JSON.stringify(LocalStorage.NABConfig);
    },
    LoadConfig: function () {
        if (!this.NotABot.Persona)
            return;

        if (!localStorage["NABConfig." + this.NotABot.Persona]) {
            this.NewConfig();
            this.UpdateConfig();
        } else {
            this.NABConfig = JSON.parse(localStorage["NABConfig." + this.NotABot.Persona]);

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
                FleeCombat: true,
                ScanCreature: true,
                AttackCreature: true,
                AdvanceOnVictory: true,
                Order: 3,

                Buff: {
                    Active: true,
                    Use: ["Spark of Life", "Absorb", "Regen", "Protection", "Arcane Focus"],
                },

                Debuff: {
                    Active: true,
                    MinMana: 25,
                    MinHealth: 50000,
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
                Active: true
            },

            Idle: {
                Active: true,

                Character: {
                    Active: true,

                    Training: {
                        Active: true,
                        MinCredits: 400000,
                        PriorityOrder: ["Ability Boost", "Scavenger", "Luck of the Draw", "Assimilator", "Quartermaster", "Archaeologist"],
                    },

                },

                Battle: {
                    Active: true,
                    ChangeDifficulty: false,
                    UseRestoratives: false,
                    MaxStaminaToUseRestorative: 79,
                    MinimumStamina: 80,

                    Arena: {
                        Active: true,
                        List: ["A Dance with Dragons", "Eternal Darkness", "End of Days", "The Trio and the Tree", "Eve of Death"]
                    },

                    RingOfBlood: {
                        Active: true,
                        List: ["Flying Spaghetti Monster"]
                    },
                },

                Bazaar: {
                    Active: true,
                    IgnoreAlerts: true,

                    Equipment: {
                        Active: true,
                    },

                    Item: {
                        Active: true,
                        ListToBuy: [
                            // Potions - Check Forum
                            { Name: "Health Draught", Amount: 1000 },
                            { Name: "Health Potion", Amount: 200 },
                            { Name: "Health Elixir", Amount: 50 },

                            { Name: "Mana Draught", Amount: 1000 },
                            { Name: "Mana Potion", Amount: 100 },
                            { Name: "Mana Elixir", Amount: 50 },

                            { Name: "Spirit Draught", Amount: 500 },
                            { Name: "Spirit Potion", Amount: 50 },
                            { Name: "Spirit Elixir", Amount: 10 },

                            ////// Repair
                            { Name: "Scrap Cloth", Amount: 100 },
                            { Name: "Scrap Wood", Amount: 50 },
                            { Name: "Energy Cell", Amount: 50 },
                        ]
                    },

                    MonsterLab: {
                        Active: true,
                        FeedMonster: true,
                        DrugMonster: true,
                        UnlockSlot: true,
                    }
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

    CheckPersona: function (name) {
        if (!name.In(this.NotABot.ListPersona))
            this.NotABot.ListPersona.push(name);

        if (this.NotABot.Persona != name)
            this.NotABot.Persona = name;

        this.Update();
        this.LoadConfig();
    }
};

LocalStorage.Load();
LocalStorage.LoadConfig();
/**********/


if (Url.has("?NABConfig")) {
    var listOfBuffs = ["Regen", "Protection", "Haste", "Shadow Veil", "Absorb", "Spark of Life", "Spirit Shield", "Heartseeker", "Arcane Focus"];
    var listOfDebuffs = ["Drain", "Weaken", "Imperil", "Slow", "Sleep", "Confuse", "Blind", "Silence", "MagNet"];
    var listOfEnchants = ["Voidseeker's Blessing", "Suffused Aether", "Featherweight Charm", "Infused Flames", "Infused Frost", "Infused Lightning", "Infused Storm", "Infused Divinity", "Infused Darkness"];
    var listOfPotions = ["Health", "Mana", "Spirit"];
    var listOfTraining = ["Adept Learner", "Assimilator", "Ability Boost", "Manifest Destiny", "Scavenger", "Luck of the Draw", "Quartermaster", "Archaeologist", "Metabolism", "Inspiration", "Scholar of War", "Tincture", "Pack Rat", "Dissociation", "Set Collector"];

    var listOfArena = ["First Blood", "Learning Curves", "Graduation", "Road Less Traveled", "A Rolling Stone", "Fresh Meat", "Dark Skies", "Growing Storm", "Power Flux", "Killzone", "Endgame",
        "Longest Journey", "Dreamfall", "Exile", "Sealed Power", "New Wings", "To Kill a God", "Eve of Death", "The Trio and the Tree", "End of Days", "Eternal Darkness", "A Dance with Dragons"];
    var listOfROB = ["Konata", "Mikuru Asahina", "Ryouko Asakura", "Yuki Nagato", "Real Life", "Invisible Pink Unicorn", "Flying Spaghetti Monster", "Triple Trio and the Tree"];


    var multiButton = `<td style='width: 50px;'>
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
            <tbody class="checkMultiple orderTable">`;

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

    function GetBazaarTable() {
        var listItem = LocalStorage.NABConfig.Idle.Bazaar.Item.ListToBuy;
        var table = `
        <table>
            <thead>
                <tr>
                    <td>
                        <label class="tooltip">Item
                            <span class="tooltiptext">
                                Has to have the exact same spelling from the Item Shop
                            </span>
                        </label>
                    </td>
                    <td>
                        <label class="tooltip">Qnt.
                            <span class="tooltiptext">
                                The amount it'll try to keep in your inventory<br>
                                <i>E.g: If it's set to 10 and you already have 5 it'll only buy 5</i>
                            </span>
                        </label>
                    </td>
                    <td><button type='button' class='addItem'><span class="ui-icon ui-icon-plus" title="Add Line"></span></button></td>
                </tr>
            </thead>
            <tbody id='idleBazaarItemList'>`;

        for (var i = 0; i < listItem.length; i++) {
            table += `
            <tr>
                <td><input type='text' class='itemName' value='${listItem[i].Name}'/></td>
                <td><input type='number' class='itemAmount' value='${listItem[i].Amount}'/></td>
                <td><button type='button' class='removeItem'><span class="ui-icon ui-icon-trash" title="Delete"></span></button></td>
            </tr>
            `;
        }

        table += `
            </tbody>
        </table>`;

        return table;
    }

    function GetPotionTable() {
        var Health = LocalStorage.NABConfig.Fight.Potion.Health;
        var Mana = LocalStorage.NABConfig.Fight.Potion.Mana;
        var Spirit = LocalStorage.NABConfig.Fight.Potion.Spirit;

        //LocalStorage.NABConfig.Fight.Potion
        var tableBody = `
        <span class="item-title">{0}</span>
        <table>
            <thead>
                <tr>
                    <td>Type</td>
                    <td>Item</td>
                    <td>
                        <label class="tooltip">Use At
                            <span class="tooltiptext">
                                When your health/mana/spirit hits this percentage or lower
                            </span>
                        </label>
                    </td>
                    <td>
                        <label class="tooltip">Buffs
                            <span class="tooltiptext">
                                Don't use the item if you have this buff active
                            </span>
                        </label>
                    </td>
                    <td>
                        <label class="tooltip">Check Item
                            <span class="tooltiptext">
                                Check if you can use another item instead<br>
                                <i>if you want to check more than one item before using this one, separate them with comma</i>
                            </span>
                        </label>
                    </td>
                    <td><button type='button' class='addItem'><span class="ui-icon ui-icon-plus" title="Add Line"></span></button></td>
                    <td style='text-align: center;'>Order</td>
                </tr>
            </thead>
            <tbody id='{1}' class='orderTable'>
                {2}
            </tbody>
        </table>`;

        var htmlTable = tableBody
            .replace('{0}', 'Health Items/Spells')
            .replace('{1}', 'fightPotionHealth')
            .replace('{2}', GetPotionItem(Health)) + "<br>";

        htmlTable += tableBody
            .replace('{0}', 'Mana Items/Spells')
            .replace('{1}', 'fightPotionMana')
            .replace('{2}', GetPotionItem(Mana)) + "<br>";
        htmlTable += tableBody
            .replace('{0}', 'Spirit Items/Spells')
            .replace('{1}', 'fightPotionSpirit')
            .replace('{2}', GetPotionItem(Spirit));

        return htmlTable;
    }

    function GetPotionItem(list) {
        var tempString = "";

        for (var i = 0; i < list.length; i++) {
            var item = list[i];

            tempString += `
            <tr>
                <td>
                    <select class='type'>
                        <option value='Item' ${item.Type == "Item" ? "selected" : ""}>Item</option>
                        <option value='Spell'  ${item.Type == "Spell" ? "selected" : ""}>Spell</option>
                    </select>
                </td>
                <td><input type='text' class='name' value='${item.Name}'></td>
                <td><input type='number' class='useAt' value='${item.UseAt}'></td>
                <td><input type='text' class='checkBuff' value='${item.CheckBuff ? item.CheckBuff : ""}'></td>
                <td><input type='text' class='checkBuff' value='${item.CheckItem ? item.CheckItem.toString() : ""}'></td>
                <td><button type='button' class='removeItem'><span class="ui-icon ui-icon-trash" title="Delete"></span></button></td>
                ${multiButton}
            </tr>`;
        }

        return tempString;
    }

    var configHTML = `
<style>
    #mainpane {
        position: fixed;
    }

    #settings_outer {
        height: 100vh !important;
        font-size: 9pt;
        margin: 0 auto;
        padding-top: 5px;
        overflow: auto;
        overflow-x: hidden;
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
        padding: 10px 0 15px;
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

    table select:not(multiple) {
        width: 100px;
    }

    td.label {
        position: relative;
        vertical-align: top;
        padding-top: 8px;
    }

    input[type="text"], input[type="number"], 
    textarea, select, option {
        font-size: 8pt;
        color: #5C0D11;
        background: #EDEADA;
        border: 1px solid #5C0D11;
        margin: 4px 1px 0 1px;
        padding: 2px 3px 2px 3px;
    }


    input[type="text"] {
        width: 100px;
    }

    input[type="number"] {
        width: 60px;
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
    .checkMultiple > tr > td:first-child {
        text-align: center;
    }

    .checkMultiple > tr.selected {
        background: #9f9fb7;
        color: white;
    }

    /** Order Table **/
    .orderTable > tr > td:last-child {
        text-align: center;
    }

    .addItem, .removeItem, .orderTable button.rotate {
        padding: 0 6px 2px;
        cursor: pointer;
    }

    .orderTable button.rotate {
        transform: rotate(90deg);
    }

        .orderTable button.rotate + button.rotate {
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
                    <option value="Fire Mage" ${LocalStorage.NABConfig.CharacterType == "Fire Mage" ? "selected" : ""}>Fire Mage</option>
                    <option value="Ice Mage" ${LocalStorage.NABConfig.CharacterType == "Ice Mage" ? "selected" : ""}>Ice Mage</option>
                    <option value="Electric Mage" ${LocalStorage.NABConfig.CharacterType == "Electric Mage" ? "selected" : ""}>Electric Mage</option>
                    <option value="Wind Mage" ${LocalStorage.NABConfig.CharacterType == "Wind Mage" ? "selected" : ""}>Wind Mage</option>
                    <option value="Holy Mage" ${LocalStorage.NABConfig.CharacterType == "Holy Mage" ? "selected" : ""}>Holy Mage</option>
                    <option value="Dark Mage" ${LocalStorage.NABConfig.CharacterType == "Dark Mage" ? "selected" : ""}>Dark Mage</option>
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
                <input type="checkbox" id="fightFleeCombat" ${LocalStorage.NABConfig.Fight.FleeCombat ? "checked" : ""}> 
                <label class="tooltip" for="fightFleeCombat">
                    Flee
                    <span class="tooltiptext">
                        Saves your money from Item Repair <br>
                        Uses it when: <br>
                        <i>
                            &emsp;• HP is lower than 15% <br>
                            &emsp;• Mana is lower than 15%<br>
                            &emsp;• Can't use Potion<br>
                            &emsp;• Can't use Defend Action<br>
                            &emsp;• There are more than 3 monsters
                        </i>
                    </span>
                </label>
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
            <p>
                <label for="fightDebuffMinHealth" class="tooltip">Min Health
                    <span class="tooltiptext">
                        Only Debuffs Monsters that have at least this much health
                    </span>
                </label>
                <input type="number" maxlength="3" id="fightDebuffMinHealth" value="${LocalStorage.NABConfig.Fight.Debuff.MinHealth}" />
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
                ${GetPotionTable()}
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
                <tbody class='checkMultiple orderTable'>
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
                            Enable all Battle Related Bot Activities.
                        </span>
                    </label>
                </p>
                <p>
                    <label for="idleBattleMinimumStamina" class="tooltip">Minimum Stamina:
                        <span class="tooltiptext">
                            Minimum stamina needed to auto-start the challange <br>
                            <i>"Your Stamina" - "Stamina Needed to Complete Challange" >= "Minimum Stamina"</i>
                        </span>
                    </label>
                    <input type="number" id="idleBattleMinimumStamina" value="${LocalStorage.NABConfig.Idle.Battle.MinimumStamina}">
                </p>
                <p>
                    <input type="checkbox" id="idleBattleChangeDifficulty" ${LocalStorage.NABConfig.Idle.Battle.ChangeDifficulty ? "checked" : ""}>
                    <label for="idleBattleChangeDifficulty" class="tooltip">Change Challange Level
                        <span class="tooltiptext">
                            Changes <b>CL</b> to the highest you played the starting challenge <br>
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
                <p>
                    <input type="checkbox" id="idleBattleArenaActive" ${LocalStorage.NABConfig.Idle.Battle.Arena.Active ? "checked" : ""}>
                    <label for="idleBattleArenaActive">Auto-start Arena</label>
                </p>
                ${GetMultiple("idleBattleArenaList", "Do", LocalStorage.NABConfig.Idle.Battle.Arena.List, listOfArena)}

                <p>
                    <input type="checkbox" id="idleBattleRingOfBloodActive" ${LocalStorage.NABConfig.Idle.Battle.RingOfBlood.Active ? "checked" : ""}>
                    <label for="idleBattleRingOfBloodActive" class="tooltip">Auto-Start RoB
                        <span class="tooltiptext">
                            Auto-start Ring of Blood<br>
                            <i>Only works if you have enough tokens</i>
                        </span>
                    </label>
                </p>
                ${GetMultiple("idleBattleRingOfBloodList", "Do", LocalStorage.NABConfig.Idle.Battle.RingOfBlood.List, listOfROB)}
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
                        Minimum amount of credits you have to have in order to auto-start Training
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
                <input type="checkbox" id="idleBazaarIgnoreAlerts" ${LocalStorage.NABConfig.Idle.Bazaar.IgnoreAlerts ? "checked" : ""}>
                <label for="idleBazaarIgnoreAlerts">Ignore Sell/Buy Alerts</label>
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
            ${GetBazaarTable()}
            <p>
                <input type="checkbox" id="idleBazaarMonsterLabActive" ${LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.Active ? "checked" : ""}>
                <label for="idleBazaarMonsterLabActive" class="tooltip">Monster Lab
                    <span class="tooltiptext">
                        Disable/Enable All Monster Lab related Activities
                    </span>
                </label>
            </p>
            <p>
                <input type="checkbox" id="idleBazaarMonsterLabFeedMonster" ${LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.FeedMonster ? "checked" : ""}>
                <label for="idleBazaarMonsterLabFeedMonster">Feed Monsters</label>
            </p>
            <p>
                <input type="checkbox" id="idleBazaarMonsterLabDrugMonster" ${LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.DrugMonster ? "checked" : ""}>
                <label for="idleBazaarMonsterLabDrugMonster">Drug Monsters</label>
            </p>
            <p>
                <input type="checkbox" id="idleBazaarMonsterLabUnlockSlot" ${LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.UnlockSlot ? "checked" : ""}>
                <label for="idleBazaarMonsterLabUnlockSlot">Unlock New Slots</label>
            </p>
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
            LocalStorage.NABConfig.Fight.FleeCombat = $$("#fightFleeCombat").checked;
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
            LocalStorage.NABConfig.Fight.Debuff.MinHealth = parseInt($$("#fightDebuffMinHealth").value);
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
            LocalStorage.NABConfig.Idle.Battle.MinimumStamina = parseInt($$("#idleBattleMinimumStamina").value);
            LocalStorage.NABConfig.Idle.Battle.ChangeDifficulty = $$("#idleBattleChangeDifficulty").checked;
            LocalStorage.NABConfig.Idle.Battle.UseRestoratives = $$("#idleBattleUseRestoratives").checked;
            LocalStorage.NABConfig.Idle.Battle.MaxStaminaToUseRestorative = parseInt($$("#idleBattleMaxStaminaToUseRestorative").value);

            LocalStorage.NABConfig.Idle.Battle.Arena.Active = $$("#idleBattleArenaActive").checked;
            LocalStorage.NABConfig.Idle.Battle.Arena.List = getSelectValues($("#idleBattleArenaList"));

            LocalStorage.NABConfig.Idle.Battle.RingOfBlood.Active = $$("#idleBattleRingOfBloodActive").checked;
            LocalStorage.NABConfig.Idle.Battle.RingOfBlood.List = getSelectValues($("#idleBattleRingOfBloodList"));

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
            LocalStorage.NABConfig.Idle.Bazaar.IgnoreAlerts = $$("#idleBazaarIgnoreAlerts").checked;
            LocalStorage.NABConfig.Idle.Bazaar.Equipment.Active = $$("#idleBazaarEquipmentActive").checked;
            LocalStorage.NABConfig.Idle.Bazaar.Item.Active = $$("#idleBazaarItemActive").checked;
            LocalStorage.NABConfig.Idle.Bazaar.Item.ListToBuy = getItemList($$("#idleBazaarItemList"));

            LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.Active = $$("#idleBazaarMonsterLabActive").checked;
            LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.FeedMonster = $$("#idleBazaarMonsterLabFeedMonster").checked;
            LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.DrugMonster = $$("#idleBazaarMonsterLabDrugMonster").checked;
            LocalStorage.NABConfig.Idle.Bazaar.MonsterLab.UnlockSlot = $$("#idleBazaarMonsterLabUnlockSlot").checked;

            // UPDATE
            LocalStorage.UpdateConfig();

            //
            location.reload();
        }

        $(".orderTable .moveUp").forEach(e => e.onclick = function () {
            var tr = this.parentNode.parentNode
            var prev = tr.previousElementSibling;

            if (prev && prev.nodeName == "TR")
                prev.before(tr);
        });

        $(".orderTable .moveDown").forEach(e => e.onclick = function () {
            var tr = this.parentNode.parentNode
            var next = tr.nextElementSibling;

            if (next && next.nodeName == "TR")
                next.after(tr);
        });

        function removeItem() {
            var tr = this.parentElement.parentElement;
            tr.remove();
        }

        $(".addItem").forEach(e => e.onclick = function () {
            var tbody = this.parentElement.parentElement.parentElement
                .parentElement.querySelector("tbody");

            var tr = document.createElement("tr");

            tr.innerHTML = `
                <td><input type='text' class='itemName' value=''/></td>
                <td><input type='number' class='itemAmount' value=''/></td>
                <td><button type='button' class='removeItem'>Remove</button></td>`;

            tbody.appendChild(tr);

            $(".removeItem").forEach(e => e.onclick = removeItem);
        });

        $(".removeItem").forEach(e => e.onclick = removeItem);

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

        function getItemList(tbody) {
            var children = tbody.children;
            var ListItem = [];

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var Name = child.querySelector(".itemName")?.value;
                var Amount = child.querySelector(".itemAmount")?.value;

                if (Name && Name != "" && Amount && (Amount = parseInt(Amount))) {
                    ListItem.push({ Name, Amount });
                }
            }

            return ListItem;
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

            var infoText = document.createElement("a");
            var idleMaster = document.createElement("a");

            if ($$("#pane_log")) {
                if (!localStorage.amoutRandomEncounter)
                    localStorage.amoutRandomEncounter = 0;

                infoText.style = "position: absolute; top: 1px; right: 110px; cursor: pointer;";
                infoText.id = "startStopBot";
                infoText.innerHTML = `Stop Bot <br>${totalExp.toFixed(2)}% - ${localStorage.amoutRandomEncounter}`;

                infoText.onclick = function () {
                    if (NotABot.Interval > 0)
                        NotABot.Stop();
                    else
                        NotABot.Start();
                };
            } else {
                infoText.style = "position: absolute; top: 5px; right: 65px; font-size: 13px; font-weight: bold; cursor: default;";
                infoText.innerHTML = LocalStorage.NotABot.LastMatch;
            }

            var idleMasterStyle = "position: absolute; top: 6px; right: 290px; font-size: 13px; font-weight: bold; cursor: pointer;"

            if (LocalStorage.NotABot.Idle) {
                idleMasterStyle += " color: blue;";
                idleMaster.innerHTML = "Idle Active";
            } else {
                idleMasterStyle += " color: red;";
                idleMaster.innerHTML = "Idle Inactive";
            }

            idleMaster.className = "startStopIdle";
            idleMaster.style = idleMasterStyle;

            $$("#mainpane").appendChild(infoText);
            $$("#mainpane").appendChild(idleMaster);

            $$(".startStopIdle").onclick = function () {
                if (this.innerText == "Idle Active") {
                    LocalStorage.NotABot.Idle = false;
                    LocalStorage.Update();

                    this.style.color = "red";
                    this.innerText = "Idle Inactive"

                } else {
                    LocalStorage.NotABot.Idle = true;
                    LocalStorage.NotABot.IdlePos = -1;
                    LocalStorage.Update();

                    this.style.color = "blue";
                    this.innerText = "Idle Active"
                    location.reload();
                }
            }
        },
        Start: function () {
            if ($$("#pane_log")) {
                //Reset IdleMaster
                if (LocalStorage.NotABot.IdlePos != -1) {
                    LocalStorage.NotABot.IdlePos = -1;
                    LocalStorage.Update();
                }

                this.Interval = setInterval(() => NotABot.Run(), 100);
            }
            else
                NotABot.Run();

            if ($$("#startStopBot"))
                $$("#startStopBot").innerText = $$("#startStopBot").innerText.replace("Start Bot", "Stop Bot");

            Log("Bot Started");
        },
        Stop: function () {
            clearInterval(this.Interval);
            this.Interval = 0;

            if ($$("#startStopBot"))
                $$("#startStopBot").innerText = $$("#startStopBot").innerText.replace("Stop Bot", "Start Bot");

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

                return this.Fight.Start();
            }
            else if ($$("#riddlemaster"))
                return this.Riddle.Start();
            else
                return this.Idle.Start();


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

                    if (this.Flee())
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
                List: {
                    // "Searing Skin", "Coalesced Mana", "Blunted Attack"
                    // "Breached Defense", "Deep Burns", "Turbulent Air", 
                    "Drain": "Vital Theft",
                    "Weaken": "Weakened",
                    "Imperil": "Imperiled",
                    "Slow": "Slowed",
                    "Sleep": "Asleep",
                    "Confuse": "Confused",
                    "Blind": "Blinded",
                    "Silence": "Silenced",
                    "MagNet": "Magically Snared",
                },

                Start: function () {
                    if (this.Active && NotABot.Fight.Player.Mana > this.MinMana) {
                        //Order by Higher HP to Lower
                        var monsterList = NotABot.Fight.Monsters.List
                            .filter((o => o.Health > 1 && o.Health >= this.MinHealth) || (o.Health <= 1 && o.Health > (this.MinHealth / 100)))
                            .sort((o, r) => r.Health - o.Health);

                        for (let i = 0; i < monsterList.length; i++) {
                            var monster = monsterList[i];
                            var listDebuff = this.Use.filter(o => !this.List[o].In(monster.Debuff) && !NotABot.LastLog.has(monster.Name + " gains the effect " + o));
                            //!o.In(monster.Debuff) && 

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

                    if (thisItem.has("Health")) {
                        if (thisItem.has("Elixir") && usedItem.has("Gem"))
                            LocalStorage.NotABot.Economy += 500;
                        else if (thisItem.has("Elixir") && usedItem.has("Potion"))
                            LocalStorage.NotABot.Economy += 450;
                        else if (thisItem.has("Potion") && usedItem.has("Gem"))
                            LocalStorage.NotABot.Economy += 50;
                    } else {
                        if (thisItem.has("Elixir") && usedItem.has("Gem"))
                            LocalStorage.NotABot.Economy += 1000;
                        else if (thisItem.has("Elixir") && usedItem.has("Potion"))
                            LocalStorage.NotABot.Economy += 900;
                        else if (thisItem.has("Potion") && usedItem.has("Gem"))
                            LocalStorage.NotABot.Economy += 100;
                    }

                    LocalStorage.Update();

                    return true;
                }
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
                            this.Overcharge = $("#vcp").length * 10; // Each Ball == 10% Of total or 25 OC
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

            Monsters: Object.assign({}, {
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
                        var Health = Object.querySelector("img[src='/y/s/nbargreen.png']").width / 120;

                        var Debuff = [];
                        var Click = function () {
                            Log('    Monster: ' + this.Name);
                            this.Object.click();
                        };

                        if (roundContext && roundContext.length > 0) {
                            var mContext = roundContext[i].scanResult;
                            var Health = parseInt(Object.querySelector(".hvstat-monster-health").innerText.split('/')[0]);

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
                    var monster = this.List.filter(r => r.Name.startsWith(name));

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
                        } else if ($$("#btcp").innerText.has("You have run away!")) {
                            let counter = ""
                            if ($$(".hvstat-round-counter"))
                                counter = $$(".hvstat-round-counter").innerHTML;

                            message = "You fleed at: " + counter;
                        } else if ($$("#btcp").innerText.has("You are victorious!"))
                            message = "You won!";
                        else
                            message = "Error";

                        Log(message, 'info');

                        LocalStorage.NotABot.LastMatch = message;
                        LocalStorage.Update();

                        //common.goto_arena();

                        location.href = "https://hentaiverse.org/";

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
                            let monsterName = newMonsters[i].parentElement.querySelector(".btm3").innerText;

                            if (!monsterName.In(this.NotScanList)) {
                                this.NotScanList.push(monsterName);

                                if (NotABot.UseSpell("Scan")) {
                                    Log('    Monster: ' + monsterName);
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

                        function setElementalMage(spell1stCircle, spell2ndCircle, spell3rdCircle) {
                            if (this.Monsters.List.length > 7 && !spell.In(spell3rdCircle, spell2ndCircle, spell1stCircle))
                                spell = spell3rdCircle;
                            else if (this.Monsters.List.length > 5 && !spell.In(spell2ndCircle, spell1stCircle))
                                spell = spell2ndCircle;
                            else if (spell != spell1stCircle)
                                spell = spell1stCircle;
                            else
                                playerClass = "Mage Melee"
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
                                case "Mage 3rd Circle": // Will not check if have spell available, this way you can attack the monster with his weakest element with a lower tier Spell
                                    switch (monster.Weakness) {
                                        case "COLD": spell = "Fimbulvetr"; break;
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

                                case "Fire Mage":
                                    setElementalMage("Fiery Blast", "Inferno", "Flames of Loki");
                                    break;
                                case "Ice Mage":
                                    setElementalMage("Freeze", "Blizzard", "Fimbulvetr");
                                    break;
                                case "Electric Mage":
                                    setElementalMage("Shockblast", "Chained Lightning", "Wrath of Thor");
                                    break;
                                case "Wind Mage":
                                    setElementalMage("Gale", "Downburst", "Storms of Njord");
                                    break;
                                case "Holy Mage":
                                    setElementalMage("Smite", "Banishment", "Paradise Lost");
                                    break;
                                case "Dark Mage":
                                    setElementalMage("Corruption", "Disintegrate", "Ragnarok");
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

                        function AttackElementalMage(spell1stCircle, spell2ndCircle, spell3rdCircle) {
                            if (NotABot.Fight.Monsters.List.length > 7 && AttackMonster(spell3rdCircle))
                                return true;

                            if (NotABot.Fight.Monsters.List.length > 5 && AttackMonster(spell2ndCircle))
                                return true;

                            if (AttackMonster(spell1stCircle))
                                return true;

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
                                    if (AttackMonster("Fimbulvetr") || AttackMonster("Ragnarok") || AttackMonster("Wrath of Thor") || AttackMonster("Flames of Loki") || AttackMonster("Paradise Lost") || AttackMonster("Storms of Njord"))
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

                                case "Fire Mage":
                                    if (AttackElementalMage("Fiery Blast", "Inferno", "Flames of Loki"))
                                        return true;

                                    return false;
                                    break;
                                case "Ice Mage":
                                    if (AttackElementalMage("Freeze", "Blizzard", "Fimbulvetr"))
                                        return true;

                                    return false;
                                    break;
                                case "Electric Mage":
                                    if (AttackElementalMage("Shockblast", "Chained Lightning", "Wrath of Thor"))
                                        return true;

                                    return false;
                                    break;
                                case "Wind Mage":
                                    if (AttackElementalMage("Gale", "Downburst", "Storms of Njord"))
                                        return true;

                                    return false;
                                    break;
                                case "Holy Mage":
                                    if (AttackElementalMage("Smite", "Banishment", "Paradise Lost"))
                                        return true;

                                    return false;
                                    break;
                                case "Dark Mage":
                                    if (AttackElementalMage("Corruption", "Disintegrate", "Ragnarok"))
                                        return true;

                                    return false;
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
            Flee: function () {
                if (this.FleeCombat) {
                    /*
                        • HP is lower than 15%
                        • Mana is lower than 15%
                        • Can't use Potion -- If he could have used potion, would have returned before
                        • Can't use Defend Action  -- If he could have Defended, would have returned before
                        • There are more than 3 monsters
                    */
                    if (this.Player.Health < 15 && this.Player.Mana < 15 && this.Monsters.List.length > 3)
                        if (NotABot.UseSpell("Flee"))
                            return true;
                }

                return false;
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
                            LocalStorage.NotABot.Riddle[src] = $$("#riddleanswer").value;
                            LocalStorage.Update();
                        });

                        beep();
                        setInterval(beep, 150);
                    }

                    return true;
                }

                return false;
            },
            //Probe This 
            Combinations: Object.assign({}, LocalStorage.NotABot.Riddle, {
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
                "ea093c0e86": "A", "e72f190d05": "A", "5cd07d958b": "A", "7c05726ecd": "A", "7fbb9b90d8": "A", "9ca27d8526": "A", "10f1ba9357": "A", "41aee1049f": "A",
                "855ae12123": "A", "09278dff2c": "A", "246748dd0a": "A", "700872e3c5": "A", "a5edf667aa": "A", "aafa869477": "A", "aec6bd3f0a": "A", "e0bea84472": "A",
                "eb24ec3810": "A", "ec4fb0b88f": "A", "f0d8e1cd2c": "A", "ff7b24f341": "A", "3f22b7bb10": "A", "4c0a794508": "A", "5e09d4dc0c": "A", "8a7abb35f0": "A",
                "90ce44f0f9": "A", "0362f10319": "A", "3742e7330d": "A", "6529f66e60": "A", "8225e3b411": "A", "12768d3c8e": "A", "68392596ba": "A", "137756928f": "A",
                "ada2dbf6e6": "A", "b34125fb55": "A", "c91b77a537": "A", "d0bc5f53b8": "A", "da5ea8bc4b": "A", "db8a312c7d": "A", "f2eb622819": "A", "f3551250ad": "A",
                "dcda99d668": "A", "b9266c4dd7": "A", "0998a0a162": "A", "156b2f6dd7": "A", "7919b6ed0f": "A", "2229925caa": "A", "bf0162d857": "A", "f01733fce3": "A",
                "0ef0c00731": "A", "b6aadc0284": "A", "60c9c87514": "A", "86a866c6e2": "A", "a459455d5c": "A", "c715148d51": "A", "5238600f03": "A", "319c787d26": "A",
                "bd91e5c59c": "A", "3aae5a771e": "A", "cfade5a316": "A", "cd370b7734": "A", "ceaff4bb65": "A", "e8a6539db7": "A", "67a3c837f2": "A", "35935b435d": "A",
                "026452cc97": "A", "5fe85249de": "A", "21292c4a71": "A", "a10615d568": "A", "eb795a6749": "A", "3b2d6a27fd": "A", "15304c1b8c": "A", "cab2749fbd": "A",
                "6da8f0ad23": "A", "e7c5448ee1": "A", "c50fe70a15": "A", "1a873f1255": "A", "208ceea194": "A", "f01b777940": "A", "bebbc11c11": "A", "45f5d94f03": "A",
                "ebe409ac7f": "A", "a703db90e6": "A", "51c1f7e4ec": "A", "efafe12393": "A", "5994dac83f": "A", "8f1e9d0dcf": "A", "834fca704b": "A", "92d8427d9b": "A",
                "800204c37e": "A", "1be7eb132d": "A", "b57fbf9ed7": "A", "76665be407": "A", "5150bc64eb": "A", "9c2803aade": "A", "c9c4431d6c": "A", "c6a5062cf5": "A",
                "ff1d3415e7": "A", "6baf5d0cf5": "A", "73ca37d6e6": "A", "fc6c1baf21": "A",



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
                "e5dcace5b0": "B", "eb56ed9cd9": "B", "fecd79b20d": "B", "684cd7a565": "B", "0f762ab728": "B", "2b568a1989": "B", "4f589dc684": "B", "5e82d729e3": "B",
                "7e4b4a782a": "B", "7bcc97d792": "B", "9f18da9e5f": "B", "39d99629bb": "B", "68caa0f6dd": "B", "80f6a233f9": "B", "89a51e62af": "B", "265aaa26c5": "B",
                "412e4479e1": "B", "0671e890a0": "B", "4297a84ba8": "B", "9397b60432": "B", "95665ac969": "B", "abe73f8245": "B", "acddea5b21": "B", "b05cf84bb0": "B",
                "b7398377ff": "B", "c2ade282e9": "B", "c6a8b0bd52": "B", "ec1dc9ad71": "B", "f7a3a90b28": "B", "0fec6f0d27": "B", "1b5b02e4a9": "B", "1baadea221": "B",
                "2ebdd42ce5": "B", "4aec148add": "B", "5e2b32a72e": "B", "34cff07e57": "B", "206b350aea": "B", "353d1951c6": "B", "457ad7dadb": "B", "530dee99e8": "B",
                "833c05dbbc": "B", "6446bad39c": "B", "2017733df2": "B", "0738419324": "B", "b4cee52ef7": "B", "b7b1e8f909": "B", "b4618a842b": "B", "c3a4651233": "B",
                "c7fa8a93c5": "B", "c214727e2c": "B", "c290573db7": "B", "c911584551": "B", "cbb953843a": "B", "d1e3e26a62": "B", "d5fb10d354": "B", "c244012693": "B",
                "933bc74856": "B", "533889d6cb": "B", "1613522c07": "B", "80c79d0779": "B", "28f812be3b": "B", "afa1248143": "B", "25b3b4f2be": "B", "734cf47872": "B",
                "9353472a37": "B", "0b471b4970": "B", "dfe11e5916": "B", "d955a3acd3": "B", "7ea5aeede6": "B", "ac4f27a47b": "B", "17647e99ae": "B", "d9653a36a1": "B",
                "617b3c4c26": "B", "e97cc3ade1": "B", "aef5b73e95": "B", "f2a1a0cb27": "B", "99d2fe8d13": "B", "a69dbf2fe3": "B", "4f864f5772": "B", "537321892e": "B",
                "13e0a6ddf6": "B", "131088353e": "B", "0f5db99cd3": "B", "c2ed99b9bd": "B", "d36e3dd4ba": "B", "b2e5da4b98": "B", "97ced38d90": "B", "05029caf12": "B",
                "68a0541b50": "B", "625c5e3926": "B", "5e8f28f309": "B", "9e33fe4b1f": "B", "3b7138e708": "B", "2538a7072b": "B", "5b892f8bfc": "B", "d435ae8351": "B",
                "3d563f2b4f": "B", "fadfe7a670": "B", "fe140de717": "B", "b88b7c1eb8": "B", "13a189db2d": "B", "bd321164d0": "B", "7bd403fed1": "B", "9b715c637c": "B",
                "5435fbca05": "B", "2b6bb235fc": "B",



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
                "5055d73a6a": "C", "40062a32f7": "C", "a730a860d3": "C", "dff16b6b10": "C", "4deb8a6d40": "C", "03a45c49fd": "C", "3eba3bdfdd": "C", "4d08ecceee": "C",
                "8c94873cd9": "C", "17f14ad0e8": "C", "034b0e40b1": "C", "69a057ea47": "C", "157c06fe9c": "C", "485c3d617c": "C", "629e7cbb53": "C", "6165ca0769": "C",
                "6309c017b9": "C", "17176eec86": "C", "039784fe46": "C", "4020000a23": "C", "6094522456": "C", "a912f24d97": "C", "af64a27d49": "C", "b587528934": "C",
                "bf43644bfb": "C", "e562ff18b2": "C", "e58526036c": "C", "f159d33c68": "C", "2ba6c0240f": "C", "3d16be3599": "C", "9d6dc1a952": "C", "65fc678579": "C",
                "75ab866587": "C", "534d5a8a18": "C", "773ba6614e": "C", "1589d4facc": "C", "4205bd92cd": "C", "92584af0d0": "C", "379710fe46": "C", "53496081eb": "C",
                "5784203513": "C", "a41ef36fef": "C", "ab7c21f398": "C", "af3a18e77f": "C", "c217c741d6": "C", "20d8e4ad65": "C", "7c89830e69": "C", "6d06f105dd": "C",
                "0c1fd30327": "C", "757e3889ba": "C", "38aa11ff70": "C", "3586ad1f7a": "C", "eb556f8ce9": "C", "3dfb14690f": "C", "8595b278b5": "C", "b2ac073d6f": "C",
                "e54d101f40": "C", "971e8a7f85": "C", "f7585d44d4": "C", "88d7350bac": "C", "8ae23eb6e9": "C", "cbb732092b": "C", "49c689ada2": "C", "f06db21731": "C",
                "147beb2ed8": "C", "a2b6393ec0": "C", "f8c0b4fb3f": "C", "c83f96bd39": "C", "3c9557f51e": "C", "1f49136bf9": "C", "0908540489": "C", "560f002119": "C",
                "bcca72a5c4": "C", "8b3e34ccb9": "C", "ac413585eb": "C", "a340baab2f": "C", "18f3f30f7e": "C", "47f65a08d6": "C", "03618a113c": "C", "7f1146aa85": "C",
                "695a9b04f9": "C", "2034c2701a": "C", "fe1999f59a": "C", "d6ccd5c2c3": "C", "8e61cbc9c6": "C", "f661cf224a": "C", "6aade9862e": "C", "7134c04239": "C",
                "1de584d275": "C", "e41e88d6e9": "C", "bb0f26f6b2": "C",


            })
        }),
        Idle: Object.assign({}, LocalStorage.NABConfig.Idle, {
            Start: function () {
                if (this.Active) {
                    //TODO: Start Idling Sending people from one side to the other. Check if it's not in the page first,
                    // also be aware to not be thrown in a loop, going from one page to another instead of doing the rest

                    if (Url.has("s=Character") || Url == "https://hentaiverse.org/")
                        if (this.Character.Start())
                            return true;

                    if (Url.has("s=Bazaar"))
                        if (this.Bazaar.Start())
                            return true;

                    if (Url.has("s=Battle"))
                        if (this.Battle.Start())
                            return true;

                    if (Url.has("s=Forge"))
                        if (this.Forge.Start())
                            return true;

                    if (this.IdleMaster())
                        return true;
                }

                return false;
            },

            Character: Object.assign({}, LocalStorage.NABConfig.Idle.Character, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("ss=ch") || Url == "https://hentaiverse.org/") // Character
                            return this.Character.Start();

                        if (Url.has("ss=eq")) // Equipment
                            return false; //TODO

                        if (Url.has("ss=ab")) // Abilities
                            return false; //TODO

                        if (Url.has("ss=tr")) //  Training
                            return this.Training.Start();

                        if (Url.has("ss=it")) // Item Inventory
                            return false; //TODO

                        if (Url.has("ss=in")) // Equip Inventory
                            return false; //TODO

                        if (Url.has("ss=se")) // Settings
                            return false; //TODO
                    }

                    return false;
                },

                Character: {
                    Start: function () {
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

                        return false;
                    }
                },

                Training: Object.assign({}, LocalStorage.NABConfig.Idle.Character.Training, {
                    ListTrain: {
                        "Adept Learner": 50,
                        "Assimilator": 51,
                        "Ability Boost": 80,
                        "Manifest Destiny": 81,
                        "Scavenger": 70,
                        "Luck of the Draw": 71,
                        "Quartermaster": 72,
                        "Archaeologist": 73,
                        "Metabolism": 84,
                        "Inspiration": null,
                        "Scholar of War": 90,
                        "Tincture": 91,
                        "Pack Rat": 98,
                        "Dissociation": 88,
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

            }),

            Bazaar: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("&ss=es")) // Equipment Shop
                            return this.Equipment.Sell();

                        if (Url.has("&ss=is")) // Item Shop
                            return this.Item.Buy();

                        if (Url.has("&ss=ib")) // Item Bot
                            return false; //TODO

                        if (Url.has("&ss=ml")) // Monster Lab
                            return this.MonsterLab.Start();

                        if (Url.has("&ss=ss")) // Shrine
                            return false; //TODO

                        if (Url.has("&ss=mm")) // Mail
                            return false; //TODO

                        if (Url.has("&ss=ss")) //Shrine
                            return false; //TODO

                        if (Url.has("&ss=lt")) // Armor Lottery
                            return false; //TODO

                        if (Url.has("&ss=la")) // Weapon Lottery
                            return false; //TODO
                    }

                    return false;
                },

                Equipment: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar.Equipment, {
                    QualityList: ['Crude', 'Fair', 'Average', 'Fine', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'],

                    Sell: function () {
                        if (this.Active) {
                            var items = $("#item_pane.cspp .eqp > div:not(.iu):not(.il)[data-locked='0']");
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

                            if (NotABot.Idle.Bazaar.IgnoreAlerts) {
                                equipshop.commit_transaction = function () {
                                    var selected = $(".eqp > div:not(.iu):not(.il)[style^='color']");

                                    if (selected) {
                                        var str_selected = "";
                                        selected.forEach(e => str_selected += e.id.replace("e", "") + ",");

                                        $$("#select_eids").value = str_selected.substring(0, str_selected.length - 1);
                                        $$("#select_group").value = selected[0].parentElement.parentElement.parentElement.id;
                                        $$("#shopform").submit()
                                    }
                                }
                            }

                            if (itemsSelected > 0) {
                                equipshop.commit_transaction();
                                return true;
                            }
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

                                        if (NotABot.Idle.Bazaar.IgnoreAlerts) {
                                            itemshop.commit_transaction = function () {
                                                var selected = $$("td > div:not(.iu)[style^='color']");

                                                if (selected) {
                                                    var mode = selected.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                                                    var item = selected.onclick.toString().split(',')[1];
                                                    var count = $$("#count_field").value;

                                                    $$("#select_mode").value = mode;
                                                    $$("#select_item").value = item;
                                                    $$("#select_count").value = count;
                                                    $$("#shopform").submit();

                                                }
                                            }
                                        }

                                        if (item.Amount - youHave > 1)
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

                MonsterLab: Object.assign({}, LocalStorage.NABConfig.Idle.Bazaar.MonsterLab, {
                    Start: function () {
                        if (this.Active) {
                            if (this.Feed())
                                return true;

                            if (this.Drug())
                                return true;

                            if (this.Slot())
                                return true;
                        }

                        return false;
                    },

                    Feed: function () {
                        if (this.FeedMonster) {
                            var feedAll = $$("img[src='/y/monster/feedallmonsters.png']");

                            if (feedAll) {
                                feedAll.click();
                                return true;
                            }
                        }

                        return false;
                    },

                    Drug: function () {
                        if (this.DrugMonster) {
                            var drugAll = $$("img[src='/y/monster/drugallmonsters.png']");

                            if (drugAll) {
                                drugAll.click();
                                return true;
                            }
                        }

                        return false;
                    },

                    Slot: function () {
                        if (this.UnlockSlot) {
                            var unlSlot = $$("img[src='/y/monster/unlock_slot.png']");

                            if (unlSlot) {
                                unlSlot.click();
                                return true;
                            }
                        }

                        return false;
                    },
                }),
            }),

            Battle: Object.assign({}, LocalStorage.NABConfig.Idle.Battle, {
                ListArena: [],

                Start: function () {
                    if (this.Active) {
                        if (this.Restoratives())
                            return true;

                        if (Url.has("&ss=ar")) // Arena
                            return this.Arena.Start();

                        if (Url.has("&ss=rb")) // Ring of Blood
                            return this.RingOfBlood.Start();

                        if (Url.has("&ss=gr")) // Grindfest
                            return true; //TODO

                        if (Url.has("&ss=iw")) // Item World
                            return true; //TODO
                    }

                    return false;
                },

                Restoratives: function () {
                    if (this.UseRestoratives) {
                        var playerStamina = this.GetStamina();

                        if (playerStamina > 0 && playerStamina < this.MaxStaminaToUseRestorative) {
                            $$('#recoverform').submit()
                            return true;
                        }
                    }

                    return false;
                },

                Arena: Object.assign({}, LocalStorage.NABConfig.Idle.Battle.Arena, {
                    ArenaList: [],

                    Start: function () {
                        if (this.Active) { // Auto start arena future
                            this.LoadArena();
                            let playerStamina = NotABot.Idle.Battle.GetStamina();

                            if (this.CheckRandomEncounters())
                                return true;


                            if (this.ArenaList.length > 0 && playerStamina > 0) {
                                for (var i = 0; i < this.ArenaList.length; i++) {
                                    var Arena = this.ArenaList[i];

                                    if (playerStamina - Arena.Stamina >= NotABot.Idle.Battle.MinimumStamina) {
                                        if (NotABot.Idle.Battle.SetDifficulty(Arena.Difficulty)) {
                                            setTimeout(() => location.reload(), 300);
                                            return true;
                                        }


                                        //Start Arena
                                        window["init_battle"] = function (id, entrycost, token) {
                                            $$("#initid").value = id;
                                            $$("#inittoken").value = token;
                                            $$("#initform").submit();
                                        }

                                        Arena.Click();

                                        return true;
                                    }
                                }

                            } else if (this.ArenaList.length == 0 && !Url.has("&page=2")) {
                                window.location.href += "&page=2";
                                return true;
                            }
                        }

                        return false;
                    },

                    LoadArena: function () {
                        var listArena = $("#arena_list tr > td:last-child > img[src='/y/arena/startchallenge.png']");

                        for (var i = 0; i < listArena.length; i++) {
                            var Arena = listArena[i];
                            var Difficulty = Arena.parentElement.parentElement.children[1].innerText.trim();
                            var Name = Arena.parentElement.parentElement.children[0].innerText.trim();
                            var Stamina = this.GetStaminaNeeded(Name);
                            var Click = function () { this.Arena.click(); }

                            this.ArenaList.push({ Arena, Difficulty, Name, Stamina, Click });
                        }

                        this.ArenaList = this.ArenaList.filter(e => e.Name.In(this.List))
                    },

                    CheckRandomEncounters: function () {
                        let lastChild = $$("body > :last-child");

                        if (lastChild.innerText == "Ready") {
                            lastChild.querySelector("a").click();

                            return true;
                        }

                        return false;
                    },

                    GetStaminaNeeded: function (arenaName) {
                        switch (arenaName) {
                            case "First Blood": return .2;
                            case "Learning Curves": return .28;
                            case "Graduation": return .48;
                            case "Road Less Traveled": return .6;
                            case "A Rolling Stone": return .8;
                            case "Fresh Meat": return 1;
                            case "Dark Skies": return 1.2;
                            case "Growing Storm": return 1.4;
                            case "Power Flux": return 1.6;
                            case "Killzone": return 1.8;
                            case "Endgame": return 2;
                            case "Longest Journey": return 2.2;
                            case "Dreamfall": return 2.4;
                            case "Exile": return 2.6;
                            case "Sealed Power": return 2.8;
                            case "New Wings": return 3;
                            case "To Kill a God": return 3.2;
                            case "Eve of Death": return 3.6;
                            case "The Trio and the Tree": return 4;
                            case "End of Days": return 4.4;
                            case "Eternal Darkness": return 5;
                            case "A Dance with Dragons": return 6;
                        }
                    }
                }),

                RingOfBlood: Object.assign({}, LocalStorage.NABConfig.Idle.Battle.RingOfBlood, {
                    RingOfBloodList: [],

                    Start: function () {
                        if (this.Active) {
                            this.LoadRingOfBlood();
                            let playerStamina = NotABot.Idle.Battle.GetStamina();

                            if (this.RingOfBloodList.length > 0 && playerStamina > 0) {
                                for (var i = 0; i < this.RingOfBloodList.length; i++) {
                                    var RingOfBlood = this.RingOfBloodList[i];

                                    if (playerStamina - RingOfBlood.Stamina > NotABot.Idle.Battle.MinimumStamina) {
                                        if (NotABot.Idle.Battle.SetDifficulty(RingOfBlood.Difficulty)) {
                                            setTimeout(() => location.reload(), 300);
                                            return true;
                                        }

                                        //Start Arena
                                        window["init_battle"] = function (id, entrycost, token) {
                                            $$("#initid").value = id;
                                            $$("#inittoken").value = token;
                                            $$("#initform").submit();
                                        }

                                        RingOfBlood.Click();

                                        return true;
                                    }
                                }
                            }
                        }
                    },

                    LoadRingOfBlood: function () {
                        var listRoB = $("#arena_list tr > td:last-child > img[src='/y/arena/startchallenge.png']");

                        for (var i = 0; i < listRoB.length; i++) {
                            var RingOfBlood = listRoB[i];
                            var Difficulty = RingOfBlood.parentElement.parentElement.children[1].innerText.trim();
                            var Name = RingOfBlood.parentElement.parentElement.children[0].innerText.trim();
                            var Stamina = 0.04; // this.GetStaminaNeeded(Name);
                            var Click = function () { this.RingOfBlood.click(); }

                            this.RingOfBloodList.push({ RingOfBlood, Difficulty, Name, Stamina, Click });
                        }

                        this.RingOfBloodList = this.RingOfBloodList.filter(e => e.Name.In(this.List))
                    },
                }),

                SetDifficulty: function (difficulty) {
                    // Change Difficulty
                    if (this.ChangeDifficulty && difficulty != '-') {
                        if ($$(".fc4.far.fcb select").style.display == 'none') return;

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

                GetStamina: function () {
                    if ($$(".fc4.far.fcb"))
                        return parseInt($$(".fc4.far.fcb").innerText.replace("Stamina:", ""));

                    return -1;
                },
            }),

            Forge: Object.assign({}, LocalStorage.NABConfig.Idle.Forge, {
                Start: function () {
                    if (this.Active) {
                        if (Url.has("&ss=re")) // Repair
                            return this.Repair.Start();

                        if (Url.has("&ss=up")) // Upgrade
                            return false;

                        if (Url.has("&ss=en")) // Enchant
                            return this.Enchant.Start();

                        if (Url.has("&ss=sa")) // Salvage
                            return this.Salvage.Start();

                        if (Url.has("&ss=fo")) // Reforge
                            return false; //TODO

                        if (Url.has("&ss=fu")) // Soulfuse
                            return false; //TODO
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

                Salvage: Object.assign({}, LocalStorage.NABConfig.Idle.Forge.Salvage, {
                    Start: function () {
                        var eqp = $$(".eqp div:not(.iu)");

                        if (eqp)
                            eqp.click();

                        return true;
                    }
                }),
            }),

            IdleMaster: function () {
                /*Change Idle Pages
                   -> Repair Equip
                   -> Buy Items
                   -> Sell Trash
                   -> Feed/Unlock/Drug Monsters
                   -> Train
                   -> Ring of Blood
                   -> Arena
                */
                if (LocalStorage.NotABot.Idle) {
                    if (Url.has("riddlemaster"))
                        return true;

                    if (LocalStorage.NotABot.IdlePos == null)
                        this.UpdateIdlePos(-1);

                    var idlePos = LocalStorage.NotABot.IdlePos;

                    if (this.Forge.Repair.Active && idlePos < 0) {
                        this.UpdateIdlePos(0);
                        location.href = "?s=Forge&ss=re";
                    }
                    else if (this.Bazaar.Item.Active && idlePos < 1) {
                        this.UpdateIdlePos(1);
                        location.href = "?s=Bazaar&ss=is";
                    }
                    else if (this.Bazaar.Equipment.Active && idlePos < 2) {
                        if (Url.has("&filter=alight")) {
                            location.href = "?s=Bazaar&ss=es&filter=aheavy";
                            this.UpdateIdlePos(2);
                        }
                        else if (Url.has("&filter=acloth"))
                            location.href = "?s=Bazaar&ss=es&filter=alight";
                        else if (Url.has("&filter=shield"))
                            location.href = "?s=Bazaar&ss=es&filter=acloth";
                        else if (Url.has("&filter=staff"))
                            location.href = "?s=Bazaar&ss=es&filter=shield";
                        else if (Url.has("&filter=2handed"))
                            location.href = "?s=Bazaar&ss=es&filter=staff";
                        else if (Url.has("?s=Bazaar&ss=es"))
                            location.href = "?s=Bazaar&ss=es&filter=2handed";
                        else
                            location.href = "?s=Bazaar&ss=es";

                    }
                    else if (this.Bazaar.MonsterLab.Active && idlePos < 3) {
                        this.UpdateIdlePos(3);
                        location.href = "?s=Bazaar&ss=ml";
                    }
                    else if (this.Character.Training.Active && idlePos < 4) {
                        this.UpdateIdlePos(4);
                        location.href = "?s=Character&ss=tr";
                    }
                    else if (this.Battle.RingOfBlood.Active && idlePos < 5) {
                        this.UpdateIdlePos(5);
                        location.href = "?s=Battle&ss=rb";
                    }
                    else if (this.Battle.Arena.Active && idlePos < 6) {
                        this.UpdateIdlePos(6);
                        location.href = "?s=Battle&ss=ar";
                    } else if (idlePos < 7) {
                        LocalStorage.NotABot.Idle = false;
                        this.UpdateIdlePos(7);
                        location.href = "?s=Character&ss=ch";
                    }

                    return true;
                }

                return false;
            },

            UpdateIdlePos: function (pos) {
                LocalStorage.NotABot.IdlePos = pos;
                LocalStorage.Update();
            },
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
            "Freeze": 121, "Blizzard": 122, "Fimbulvetr": 123,
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
