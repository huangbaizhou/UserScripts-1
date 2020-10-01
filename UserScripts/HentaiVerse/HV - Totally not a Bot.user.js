// ==UserScript==
// @name       HV - Totally not a Bot
// @namespace  Hentai Verse
// @version    2.4.2
// @author     Svildr
// @match      https://hentaiverse.org/?s=Battle*
// @match      https://hentaiverse.org/?s=Character&ss=tr
// @match      https://hentaiverse.org/?s=Forge&ss=re*
// @match      https://hentaiverse.org/?s=Forge&ss=en*
// @match      https://hentaiverse.org/?s=Bazaar&ss=is*
// @match      https://hentaiverse.org/?encounter=*
// @icon       http://e-hentai.org/favicon.ico
// ==/UserScript==

/* This bot is better used with
  ** HV Statistics (Saving Monster Stats) -- If you don`t use set ScanCreature to false
  ** HV Inline Difficulty Changer -- If you don`t use set ChangeArenaDifficulty to false
  ** RiddleLimiter Plus -- Is recommended, but not necessary
*/

var BotConfig = {
    /*Time between each action. 
        Too fast might make you execute the same action twice unnecessarily, spending extra Mana/ Spirit and might even cost you the match.
        Too slow and it might become borish, and takes more time to finish.
        Normally takes about 350ms for the requisition to return, check your reqs, if it's faster for you, you can reduce it. (Add 50 to the final number).
    */
    SleepTimer: 400, // ms

    Fight: {
        Active: true,
        ScanCreature: true,
        AttackCreature: true,
        AdvanceOnVictory: true,

        // 1 - AoE in the Middle
        // 2 - Attack the weakest
        // 3 - Attack the one with the lower health
        // 4 - Attack in the disposition order
        Order: 3,

        Riddle: {
            Active: true
        },

        Buff: {
            Active: true,
            Use: ["Spark of Life", "Absorb", "Haste", "Regen", "Protection", "Shadow Veil", "Arcane Focus", "Spirit Shield"], // , Heartseeker
        },

        Debuff: {
            Active: true,
            MinMana: 25, // % -- To save your mana 
            Use: ["Weaken", "Imperil"] //, "Slow"
        },

        Potion: {
            Active: true,
            UseMysticGem: true,
            PriorityOrder: ["Health", "Mana", "Spirit"],

            // All are in Percentage -- To remove any specific Potion change the value to -1
            // Don't change the name or the type unless you know exacly what you are doing.
            Health: [
                { Type: "Item", Name: "Health Elixir", UseAt: 10 },
                { Type: "Item", Name: "Health Potion", UseAt: 30 }, //35
                { Type: "Item", Name: "Health Draught", UseAt: 60 }, // 40
                { Type: "Item", Name: "Health Gem", UseAt: 50 }, //60
                { Type: "Spell", Name: "Cure", UseAt: 40 },  // 50
                { Type: "Spell", Name: "Full-Cure", UseAt: 20 }
            ],
            Mana: [
                { Type: "Item", Name: "Mana Elixir", UseAt: 2 },
                { Type: "Item", Name: "Mana Potion", UseAt: 15 },
                { Type: "Item", Name: "Mana Draught", UseAt: 40 },
                { Type: "Item", Name: "Mana Gem", UseAt: 55 }
            ],
            Spirit: [
                { Type: "Item", Name: "Spirit Elixir", UseAt: 2 }, //2
                { Type: "Item", Name: "Spirit Potion", UseAt: 10 }, //10
                { Type: "Item", Name: "Spirit Draught", UseAt: 30 }, //30
                { Type: "Item", Name: "Spirit Gem", UseAt: 100 } // 100
            ]
        },

        Spirit: {
            Active: true,

            /// Defensive Stance = [ "Defend", "Spirit", "Focus" ]
            /// Offensive Stance = [ "Spirit", "Focus", "Defend" ]
            PriorityOrder: ["Focus", "Spirit", "Defend"],

            // Values In Percentage, Value or Less
            Spirit: {
                Active: true,
                Mana: { EnableAt: 50, DisableAt: 70 }
            },

            Defend: {
                Active: true,
                Health: { EnableAt: 30 }
            },

            // Charges Mana
            Focus: {
                Active: true,
                Mana: { EnableAt: 5 }
            },
        },
    },

    Idle: {
        Active: true,

        Arena: {
            // Be aware of your items, it`ll not repair or use enchant
            Active: false,

            // Will use your tokens, recommended you let it disabled.
            DoRingOfBlood: false,

            // Minimum Stamina Needed to Auto Start Arena
            // 100-80 (+ 100% Exp) || 79-10 (No Bonus) || 10-0 (Don't get Exp/Drop/Anything)
            MinimumStamina: 80,

            // Changes difficulty to the highest you played that arena.
            // Only works with the script "Inline Difficulty Changer"
            ChangeDifficulty: true,

            UseRestoratives: true,

            // If you have the perk "Long Gone Before Daylight" change this to 69
            MaxStaminaToUseRestorative: 79,

        },

        Training: {
            Active: true,
            MinCredits: 400000,
            PriorityOrder: ["Adept Learner", "Ability Boost", "Scavenger", "Luck of the Draw", "Assimilator", "Quartermaster", "Archaeologist"],
        },

        Repair: {
            Active: true,
        },

        Enchant: {
            Active: true,
            Use: ["Voidseeker's Blessing", "Suffused Aether", "Infused Flames", "Infused Frost", "Infused Lightning", "Infused Storm", "Infused Divinity", "Infused Darkness"]
        },

        Shop: {
            Active: true,

            // You can also add other items, by name. Like scrolls, Infusions, 
            // Amount to keep in your inventory of each item.
            ListToBuy: [
                { Name: "Health Draught", Amount: 1000 },
                { Name: "Health Potion", Amount: 500 },
                { Name: "Health Elixir", Amount: 100 },

                { Name: "Mana Draught", Amount: 1000 },
                { Name: "Mana Potion", Amount: 500 },
                { Name: "Mana Elixir", Amount: 100 },

                { Name: "Spirit Draught", Amount: 500 },
                { Name: "Spirit Potion", Amount: 250 },
                { Name: "Spirit Elixir", Amount: 10 },

                ////// Repair
                { Name: "Energy Cell", Amount: 50 },

                ////// Enchants
                { Name: "Voidseeker Shard", Amount: 30 },
                { Name: "Aether Shard", Amount: 30 },

                { Name: "Infusion of Flames", Amount: 100 },
                { Name: "Infusion of Frost", Amount: 100 },
                { Name: "Infusion of Lightning", Amount: 100 },
                { Name: "Infusion of Storms", Amount: 100 },
                { Name: "Infusion of Divinity", Amount: 100 },
                { Name: "Infusion of Darkness", Amount: 100 },
            ]
        }
    },
};

/*
 ***********************************************
 ***********************************************
 **     DO NOT CHANGE ANYTHING AFTER THIS     **
 ***********************************************
 ***********************************************
TODO List
  Fight: https://ehwiki.org/wiki/Battles#Combat
    * Flee
  Arena:
    * Use Restorative
    * Repair Equipments -- Buy Mat???
    * Buy Potions ???
 */

if (localStorage.Bot == null)
    localStorage.Bot = "{}";

window.LocalStorage = {
    Bot: {},
    Update: function () {
        localStorage.Bot = JSON.stringify(LocalStorage.Bot);
    },
    Load: function () {
        this.Bot = JSON.parse(localStorage.Bot)
    }
};

window.Bot = {
    SleepTimer: BotConfig.SleepTimer,
    Interval: 0,
    Begin: function () {
        this.Start();
        LocalStorage.Load();

        let totalExp = $$("#expbar") ? $$("#expbar").width / 1235 * 100 : 0;
        var span = document.createElement("span");

        if ($("#arena_pages").length > 0 || Url.has("s=Character")) {
            span.style = "position: absolute; top: 5px; right: 65px; font-size: 13px; font-weight: bold;";
            span.innerHTML = LocalStorage.Bot.LastMatch;
        } else {
            span.style = "position: absolute; top: 1px; right: 65px; cursor: pointer;";
            span.innerHTML = "<span id='startStopBot'>Stop Bot</span><br>" + totalExp.toFixed(2) + "% - " + localStorage.AmoutRandomEncounter;
            span.onclick = function () {
                if (Bot.Interval > 0)
                    Bot.Stop();
                else
                    Bot.Start();
            };
        }

        document.querySelector("#mainpane").appendChild(span);

        window["beep"] = function () {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            snd.play();
        }
    },
    Start: function () {
        this.Interval = setInterval(() => Bot.Run(), this.SleepTimer);

        if ($$("#startStopBot"))
            $$("#startStopBot").innerText = "Stop Bot";

        console.log("Bot Started");
    },
    Stop: function () {
        clearInterval(this.Interval);
        this.Interval = 0;

        if ($$("#startStopBot"))
            $$("#startStopBot").innerText = "Start Bot";

        console.log("Bot Stopped");
    },
    Run: function () {
        if (this.Idle.Start())
            return;

        if (this.Fight.Start())
            return;

        console.log("Nothing to do here.");
        this.Stop();
    },

    Fight: Object.assign(BotConfig.Fight, {
        NotScanList: [],

        Start: function () {
            if (this.Active) {
                if (this.Advance())
                    return true;

                if (this.Riddle.Start())
                    return true;

                if (this.Player.GetStatus())
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

        Buff: Object.assign(BotConfig.Fight.Buff, {
            ListOfBuffsOn: [],

            LoadActive: function () {
                this.ListOfBuffsOn = [];

                for (let i = 0; i < $("#pane_effects img").length; i++) {
                    var str = $("#pane_effects img")[i].onmouseover.toString();
                    str = str.substr(str.indexOf("effect('") + 8);
                    str = str.substr(0, str.indexOf("\',"));
                    this.ListOfBuffsOn.push(str);
                }
            },
            Start: function () {
                this.LoadActive();

                if (this.Active && this.Use && this.Use.length > 0)
                    for (let i = 0; i < this.Use.length; i++)
                        if (!In(this.ListOfBuffsOn, this.Use[i]))
                            if (Bot.UseSpell(this.Use[i]))
                                return true;

                return false;
            }
        }),

        Debuff: Object.assign(BotConfig.Fight.Debuff, {
            Start: function () {
                if (this.Active && Bot.Fight.Player.Mana > this.MinMana) { // Don't debuff if you have low mana
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

                        for (let j = 0; j < this.Use.length; j++) {
                            if (!In(listOfDebuffsOn, this.Use[j])) {
                                if (Bot.UseSpell(this.Use[j])) {
                                    monsterList[i].click();
                                    return true;
                                }
                            }
                        }
                    }
                }

                return false;
            }
        }),

        Potion: Object.assign(BotConfig.Fight.Potion, {
            Start: function () {
                if (this.Active) {
                    if (this.UseMysticGem && Bot.UseItem("Mystic Gem"))
                        return true;

                    for (var i = 0; i < this.PriorityOrder.length; i++) {
                        let priority = this.PriorityOrder[i];
                        let actualValue = Bot.Fight.Player[priority];
                        let listPotion = this[priority].sort(function (a, b) { return a.UseAt - b.UsetAt });

                        for (var j = 0; j < listPotion.length; j++) {
                            let useAt = listPotion[j].UseAt;
                            let type = listPotion[j].Type;
                            let name = listPotion[j].Name;

                            if (actualValue <= useAt) {
                                if (type == "Item" && Bot.UseItem(name))
                                    return true;
                                else if (type == "Spell" && Bot.UseSpell(name))
                                    return true;

                                //console.log(`Err: USE: ${useAt} || Type: ${type} || Name: ${name}`);
                            }
                        }
                    }
                }

                return false;
            }
        }),

        Player: Object.assign({}, {
            Health: 0,
            Mana: 0,
            Spirit: 0,
            GetStatus: function () {
                try {
                    this.Health = $$("#vbh img").width / $$("#vbh").clientWidth * 100;
                    this.Mana = $$("#vbm img").width / $$("#vbm").clientWidth * 100;
                    this.Spirit = $$("#vbs img").width / $$("#vbs").clientWidth * 100;

                    return false;
                } catch (e) {
                    //console.log("Cound get your life/mana/spirit data.");
                    Bot.Stop();
                }

                return true;
            }
        }),

        Riddle: Object.assign(BotConfig.Fight.Riddle, {
            Start: function () {
                if (this.Active && $("#riddlemaster").length > 0) {
                    let src = $$("#riddlebot img").src;
                    src = src.substr(src.indexOf("&v=") + 3);

                    var answer = this.Combinations[src];

                    if (answer != null) {
                        LocalStorage.Bot.LastRiddleAnswer = "Your ass has been saved by the all mighty god. Answer: " + answer;
                        LocalStorage.Update();

                        console.log(LocalStorage.Bot.LastRiddleAnswer);

                        $$('#riddleanswer').value = answer;
                        $$('#riddleform').submit();
                    } else {
                        beep();
                        setInterval(beep, 150);
                        //alert("HiddleAlert");
                    }

                    Bot.Stop();
                    return true;
                }

                return false;
            },
            Combinations: {
                "500d9639f0": "A", "c040b1cf0e": "A", "4693637779": "A", "6621d9201a": "A", "a0fe68a1e1": "A", "637a3dd556": "A", "cfdaabf41b": "A", "31d426a146": "A",
                "2260367281": "A", "86cd089cb4": "A", "52093b0bf9": "A", "b8c0a5c1f2": "A", "e61491ee54": "A", "712953d5f0": "A", "d6ebb0c744": "A", "126965ee78": "A",
                "f573e87f84": "A", "ddb1c99260": "A", "9898df62f7": "A", "a3cea27f08": "A", "2eecad477c": "A", "2e748a532e": "A", "c727bb52db": "A", "4eaf25d099": "A",
                "8e73159fd8": "A", "da7a5af305": "A", "6ae1a72220": "A", "6574e82166": "A", "68d3878db4": "A", "13fb1c539a": "A", "f3c423a3c3": "A", "afbdd89f1b": "A",
                "69ae72d5fd": "A", "01a5e680e3": "A",


                "404543f2b2": "B", "89a4ecdacd": "B", "7811dfe40d": "B", "8480600ebd": "B", "cd035d1831": "B", "0af3b04e8d": "B", "5086ec68ed": "B", "3f61d24447": "B",
                "182d227be2": "B", "daefa9752a": "B", "27900890bd": "B", "010cac29dc": "B", "3fa836e583": "B", "2d1cef08dd": "B", "5877a95912": "B", "6728d3c5fb": "B",
                "a92887a00d": "B", "983f700578": "B", "e7cd6e413c": "B", "80aa025f23": "B", "39954aa3b8": "B", "99794cbcf5": "B", "b305f18a51": "B", "a00b2b82cc": "B",
                "9a585d1555": "B", "06b7fce8e3": "B", "284e31f095": "B", "3469f0a205": "B", "1f5ab6f560": "B", "a7d8cc63ed": "B", "ec992e36b2": "B", "cddf856293": "B",

                "0401027bc9": "C", "15fd621b9e": "C", "c636d8ec4f": "C", "9518ec52e5": "C", "9983bf2c32": "C", "ac54f4fe00": "C", "394fb8d004": "C", "24006660f5": "C",
                "454e9d852b": "C", "bd5cc28054": "C", "1a45149570": "C", "5f82e0f9c9": "C", "20fd0048ff": "C", "0861b61cdc": "C", "18fb4b4a6e": "C", "a036f0ba2b": "C",
                "1b87a375a0": "C", "08893df887": "C", "6d02b7f91f": "C", "7be47fe5c0": "C", "dead34f02c": "C", "2da78f830e": "C", "e2af2b85b7": "C", "679c46d24f": "C",
                "5fd15f8441": "C", "dff931677d": "C", "5d77db91eb": "C", "e644af1f91": "C", "8df9c54ecd": "C", "0476ce9792": "C", "0a22ae7ab8": "C", "f21aec32a1": "C",
                "359872d4e2": "C", "359872d4e2": "C", "fa8bd05562": "C", "6a2049d80e": "C", "212b4b2e14": "C",

            }
        }),

        Spirit: Object.assign(BotConfig.Fight.Spirit, {
            Start: function () {
                if (this.Active)
                    for (let i = 0; i < this.PriorityOrder.length; i++) 
                        if (this[this.PriorityOrder[i]].Start())
                            return true;

                return false;
            },

            Spirit: Object.assign(BotConfig.Fight.Spirit.Spirit, {
                Start: function () {
                    if (this.Active) {
                        let isActive = $$("#ckey_spirit").src.has("spirit_s.png");

                        if (Bot.Fight.Player.Mana <= this.Mana.EnableAt && !isActive) {
                            $$("#ckey_spirit").click();
                            return true;
                        }

                        ////// Toggle off not working
                        if (Bot.Fight.Player >= this.Mana.DisableAt && isActive) {
                            $$("#ckey_spirit").click();
                            return true;
                        }
                    }

                    return false;
                },
            }),
            Defend: Object.assign(BotConfig.Fight.Spirit.Defend, {
                Start: function () {
                    if (this.Active) {
                        if (Bot.Fight.Player.Health <= this.Health.EnableAt) {
                            battle.lock_action(this, 0, 'defend')
                            $$("#ckey_defend").click();
                            return true;
                        }
                    }

                    return false;
                },
            }),
            Focus: Object.assign(BotConfig.Fight.Spirit.Focus, {
                Start: function () {
                    if (this.Active) {
                        if (Bot.Fight.Player.Mana <= this.Mana.EnableAt) {
                            //battle.lock_action(this,0,'focus')
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
                        Bot.Stop();

                        return true;
                    } else if ($$("#btcp").innerText.has("You have been defeated!")) {
                        let counter = "";

                        if ($$(".hvstat-round-counter"))
                            counter = $$(".hvstat-round-counter").innerHTML;

                        message = "You lost at: " + counter;
                    } else
                        message = "You won!";


                    console.log(message);
                    LocalStorage.Bot.LastMatch = message;
                    LocalStorage.Update();
                    common.goto_arena();

                    Bot.Stop();
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

                    while (i < newMonsters.length && In(this.NotScanList, newMonsters[i].parentElement.innerText))
                        i++;


                    if (i < newMonsters.length) {
                        let monsterName = newMonsters[i].parentElement.innerText;

                        if (!In(this.NotScanList, monsterName)) {
                            this.NotScanList.push(monsterName);

                            if (Bot.UseSpell("Scan")) {
                                newMonsters[i].className += " scanned";
                                newMonsters[i].parentElement.click();
                                return true;
                            }
                        } else {
                            //setInterval(beep, 350);  
                            console.log("Error Scan.");
                            //Bot.Stop();
                            //return;
                        }
                    }
                }
            }

            return false;
        },
        Attack: function () {
            if (this.AttackCreature) {
                var monster = null;

                if (Url.has("&ss=rb")) {
                    monster = this.GetMonsterByName("Yggdrasil");  //Heal

                    if (monster == null)
                        monster = this.GetMonsterByName("Flying Spaghetti Monster");  //Puff of Logic

                    //if(monster == null)
                    //  monster = this.GetMonsterByName("Drogon");
                    //
                    //if(monster == null)
                    //  monster = this.GetMonsterByName("Rhaegal");
                    //
                    //if(monster == null)
                    //  monster = this.GetMonsterByName("Viserion");
                    //
                    //if(monster == null)
                    //  monster = this.GetMonsterByName("Real Life");
                    //  
                }

                if (monster == null)
                    monster = this.GetTarget();


                if (monster == null) {
                    console.log("Can't find a monster to attack.")
                    return true;
                }

                var weakness = "", resistence = "";

                try {
                    weakness = monster.querySelector('.hvstat-monster-status-weakness').innerText.replace("-", "");
                    resistence = monster.querySelector('.hvstat-monster-status-resistance').innerText.replace("-", "");
                } catch (e) { } //Could not scan or Scan/HV Statistics is innactive.

                var spell = "";


                if (weakness == "")
                    if (!resistence.has("Elemental")) // Put in the order from stronger to weaker
                        if (!resistence.has("Cold")) spell = "Freeze";
                        else if (!resistence.has("Wind")) spell = "Gale";
                        else if (!resistence.has("Fire")) spell = "Fiery Blast";
                        else spell = "Shockblast";
                    else if (!resistence.has("Dark")) spell = "Corruption";
                    else if (!resistence.has("Holy")) spell = "Smite";
                    else spell = "Gale"; // This motherfucker has all resistences. -- Strongest Element that I have
                else
                    if (weakness.has("Cold")) spell = "Freeze";
                    else if (weakness.has("Wind")) spell = "Gale";
                    else if (weakness.has("Dark")) spell = "Corruption";
                    else if (weakness.has("Fire")) spell = "Fiery Blast";
                    else if (weakness.has("Elec")) spell = "Shockblast";
                    else if (weakness.has("Holy")) spell = "Smite";
                    else { /* I`m not sure what happened Here */
                        alert("Some shit happened!!");
                        console.log(monster);
                        console.log(weakness);
                    }

                if (Bot.UseSpell(spell)) {
                    monster.click();
                    return true;
                }

                console.log("Could not use spell:" + spell);
            }

            return false;
        },

        GetMonsterByName: function (name) {
            var monsterList = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']").contains(name);

            if (monsterList.length > 0)
                return monsterList[0];

            return null;
        },
        GetTarget: function () {
            var monsterList = $("#pane_monster div[id^='mkey_'][onmouseover^='battle']");

            if (monsterList.length == 0)
                return null;

            var monster = monsterList[0];

            switch (this.Attack.AttackOrder) { // Tactics
                case 1:  //  Use AoE middle
                    monster = monsterList[monsterList.length > 1 ? parseInt(monsterList.length / 2) : 0];
                    break;
                case 2: //  Kill the weaker first
                    var monsterID = -1;

                    for (var i = 0; i < monsterList.length; i++) {
                        var hasWeakness = monsterList[i].querySelector('.hvstat-monster-status-weakness').innerText != "";

                        if (hasWeakness) {
                            monsterID = i;
                            break; // Break For
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
                default: //  Dumbest Strategy First in First Out.
                    monster = monsterList[0];
                    break;
            };

            return monster;
        },
    }),
    Idle: Object.assign(BotConfig.Idle, {
        Start: function () {
            if (this.Active) {
                //Start Idling Sending people from one side to the other. Check if it's not in the page first,
                // also be away to no be thrown in a loop, going from one page to another instead of doing the rest


                if (Url.has("s=Character") && Url.has("ss=tr"))
                    if (this.Training.Start())
                        return true;

                if (Url.has("s=Battle") && (Url.has("ss=ar") || Url.has("ss=rb")))
                    if (this.Arena.Start())
                        return true;

                if (Url.has("s=Forge") && Url.has("ss=re"))
                    if (this.Repair.Start())
                        return true;

                if (Url.has("s=Forge") && Url.has("ss=en"))
                    if (this.Enchant.Start())
                        return true;

                if (Url.has("s=Bazaar") && Url.has("ss=is"))
                    if (this.Shop.Start())
                        return true;
            }

            return false;
        },

        Arena: Object.assign(BotConfig.Idle.Arena, {
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

        Training: Object.assign(BotConfig.Idle.Training, {
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
                                LocalStorage.Bot.LastTraining = new Date();
                                LocalStorage.Update();

                                return true;
                            }
                        }
                    }
                }

                return false;
            },
        }),

        Repair: Object.assign(BotConfig.Idle.Repair, {
            Start: function () {
                if (this.Active) {
                    if ($$('img[src="/y/shops/repairall.png"]')) {
                        document.getElementById('repairall').submit();
                        return true;
                    }
                }

                return false;
            }
        }),

        Enchant: Object.assign(BotConfig.Idle.Enchant, {
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

                    if (!LocalStorage.Bot.Enchant) {
                        LocalStorage.Bot.Enchant = [];
                        LocalStorage.Update();
                    }

                    if (listEquip.length > 0) { // First Page
                    //    if (LocalStorage.Bot.Enchant.length == 0) {
                    //        for (let i = 0; i < listEquip.length; i++)
                    //            LocalStorage.Bot.Enchant.push(listEquip[i].id.substring(1));
                    //
                    //        LocalStorage.Bot.Enchant.push("End");
                    //        LocalStorage.Update();
                    //    }
                    //
                    //    let $equip = LocalStorage.Bot.Enchant[0];
                    //
                    //    if ($equip == "End") {
                    //        console.log("Finished Enchanting");
                    //        return true;
                    //    }
                    //
                    //
                    //    $$("#e" + $equip).click();
                    //    forge.commit_transaction()
                    //
                    //    LocalStorage.Bot.Enchant.shift();
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

                        this.GoBack();
                    }
                }

                return false;
            },
            GoBack: function () {
                var goBack = "https://hentaiverse.org/?s=Forge&ss=en&filter=equipped";
                location.href = goBack;
            },
        }),

        Shop: Object.assign(BotConfig.Idle.Shop, {
            Start: function () {
                if (this.Active) {
                    this.ListToBuy;

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
								
								Bot.Stop();
                                return true;
                            }
                        }
                    }

                }

                return false;
            }
        }),
    }),

    ///
    ListSkill: {
        //Skills
        "Flee": 1001, "Scan": 1011,
        "Concussive Strike": 2501,

        //Spells
        "Fiery Blast": 111, "Inferno": 112, "Flames of Loki": 113,
        "Freeze": 121, "Blizzard": 122, "Fimbulvertr": 123,
        "Shockblast": 131, "Chained Lightning": 132, "Wrath of Thor": 133,
        "Gale": 141, "Downburst": 142, "Storms of Njord": 143,
        "Smite": 151, "Banishment": 152, "Paradise Lost": 153,
        "Corruption": 161, "Disintegrate": 162, "Ragnarok": 163,

        //Deprecating
        "Drain": 211, "Weaken": 212, "Imperil": 213,
        "Slow": 221, "Sleep": 222, "Confuse": 223,
        "Blind": 231, "Silence": 232, "MagNet": 233,

        //Curative
        "Cure": 311, "Regen": 312, "Full-Cure": 313,

        //Supportive
        "Protection": 411, "Haste": 412, "Shadow Veil": 413,
        "Absorb": 421, "Spark of Life": 422, "Spirit Shield": 423,
        "Heartseeker": 431, "Arcane Focus": 432
    },
    UseSpell: function (spellName) {
        var spell = $$("#" + this.ListSkill[spellName]);

        if (spell.style.opacity != "0.5") {
            spell.click();

            //console.log("Spell Used: " + spellName);
            return true;
        }

        console.log("Could not use Spell:" + spellName);
        return false;
    },
    UseItem: function (itemName) {
        var items = $("#pane_item div[id^='ikey_']").contains(itemName);

        if (items.length > 0) {
            items[0].click();

            //console.log("Item Used " + itemName);
            return true;
        }

        //console.log("Could not use Item: " + itemName)
        return false;
    },
};

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

    return document.querySelectorAll(b);
}

function In(list, str) {
    for (var i = 0; i < list.length; i++)
        if (list[i].has(str))
            return true;

    return false;
}

String.prototype.has = function (val) {
    return this.indexOf(val) > -1;
}
Object.prototype.contains = function (name) {
    return Array.prototype.filter.call(this, function (element) {
        return RegExp(name).test(element.textContent);
    });
}

/*And now it ...*/ Bot.Begin();
