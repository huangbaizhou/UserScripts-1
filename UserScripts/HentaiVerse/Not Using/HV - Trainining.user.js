// ==UserScript==
// @name       HV - Trainining
// @namespace  Hentai Verse
// @match      https://hentaiverse.org/?s=Character&ss=tr
// @grant      none
// @version    1.0
// @author     Svildr
// ==/UserScript==

var Priority = [ "Adept Learner", "Ability Boost", "Scavenger", "Luck of the Draw", "Assimilator", "Quartermaster", "Archaeologist" ];

var listTrain = {
    "Adept Learner": 50,
    "Assimilator": 51,
    "Ability Boost": 80,
    "Manifest Destiny": 81,
    "Scavenger": 70,
    "Luck of the Draw": 71,
    "Quartermaster": 72,
    "Archaeologist": 73,
    "Metabolism": 84,
    "Inspiration": 85,
    "Scholar of War": 90,
    "Tincture": 91,
    "Pack Rat": 98,
    "Dissociation": 88,
    "Set Collector": 96
};

for(var i = 0; i < Priority.length; i++) {
    let num = listTrain[Priority[i]];
    
    if(num && document.querySelector(`img[onclick='training.start_training(${num})']`))
        training.start_training(num);
}