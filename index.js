let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');



//localisation
let locale;
document.addEventListener("DOMContentLoaded", () => {
    locale = langSwitcher.value
    document
    // Find all elements that have the key attribute
        .querySelectorAll("[key]")
        .forEach(translateElement);
});

function translateElement(element) {
    const key = element.getAttribute("key");
    const translation = translations[locale][key];
    element.innerText = translation;
}
langSwitcher.addEventListener("change", () => {
    locale = langSwitcher.value
    document
    // Find all elements that have the key attribute
        .querySelectorAll("[key]")
        .forEach(translateElement);
})




goBtn.addEventListener("click", evt => {
    printTypes(locale);
});

copyBtn.addEventListener("click", evt => {

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(output.textContent);

    /* Alert the copied text */
    //alert("Copied the text: " + output.textContent);
    copyBtn.style.background = "#00aa00";
});



function printTypes(lang) {



    let type1 = type1Select.value;
    let type2 = type2Select.value;
    let typeIndex1 = types.indexOf(type1);
    let typeIndex2 = types.indexOf(type2);



    //Effective Attacks

    let effectiveAttacks1 = [];
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex1] == 1) {

            console.log(types[i]);
            effectiveAttacks1.push(types[i]);

        }
    }
    let effectiveAttacks2 = [];
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex2] == 1) {

            effectiveAttacks2.push(types[i]);
        }
    }

    let effectiveAttacks = effectiveAttacks1.concat(effectiveAttacks2);
    effectiveAttacks = effectiveAttacks.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })


    //InEffective Attacks

    let inEffectiveAttacks1 = [];
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex1] == -1) {

            inEffectiveAttacks1.push(types[i]);
        }
    }
    let inEffectiveAttacks2 = [];
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex2] == -1) {

            inEffectiveAttacks2.push(types[i]);
        }
    }

    let inEffectiveAttacks = inEffectiveAttacks1.concat(inEffectiveAttacks2);
    inEffectiveAttacks = inEffectiveAttacks.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })

    effectiveAttacks = effectiveAttacks.filter(val => !inEffectiveAttacks.includes(val));

    effectiveAttacks = effectiveAttacks.map(elem => translations[locale][elem]);

    output.textContent = `@${effectiveAttacks.join(',@')}`;

    copyBtn.style.background = "black";
}


const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
const effectivness = [
    [0, 1, 0, 0, -1, -1, -1, -1, -1, 1, 0, 0, 0, -1, 1, 0, -1, 0], //bug
    [0, -1, 0, 0, -1, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], //dark
    [0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //dragon
    [0, 0, -1, -1, 0, 0, 0, 1, 0, -1, -1, 0, 0, 0, 0, 0, 0, 1], //electric
    [0, 1, 1, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0], //fairy
    [-1, 1, 0, 0, -1, 0, 0, -1, -1, 0, 0, 1, 1, -1, -1, 1, 1, 0], //fighting
    [1, 0, -1, 0, 0, 0, -1, 0, 0, 1, 0, 1, 0, 0, 0, -1, 1, -1], //fire
    [1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, -1, 0], //flying
    [0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0], //ghost
    [-1, 0, -1, 0, 0, 0, -1, -1, 0, -1, 1, 0, 0, -1, 0, 1, -1, 1], //grass
    [-1, 0, 0, 1, 0, 0, 1, -1, 0, -1, 0, 0, 0, 1, 0, 1, 1, 0], //ground
    [0, 0, 1, 0, 0, 0, -1, 1, 0, 1, 1, -1, 0, 0, 0, 0, -1, -1], //ice
    [0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1, -1, 0], //normal
    [0, 0, 0, 0, 1, 0, 0, 0, -1, 1, -1, 0, 0, -1, 0, -1, -1, 0], //poison
    [0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, -1, 0], //psychic
    [1, 0, 0, 0, 0, -1, 1, 1, 0, 0, -1, 1, 0, 0, 0, 0, -1, 0], //rock
    [0, 0, 0, -1, 1, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 1, -1, -1], //steel
    [0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0, -1] //water
];


const translations = {
    "en": {
        "bug": "Bug",
        "dark": "Dark",
        "dragon": "Dragon",
        "electric": "Electric",
        "fairy": "Fairy",
        "fighting": "Fighthing",
        "fire": "Fire",
        "flying": "Flying",
        "ghost": "Ghost",
        "grass": "Grass",
        "ground": "Ground",
        "ice": "Ice",
        "normal": "Normal",
        "poison": "Poison",
        "psychic": "Psychic",
        "rock": "Rock",
        "steel": "Steel",
        "water": "Water"
    },
    "de": {
        "bug": "Käfer",
        "dark": "Unlicht",
        "dragon": "Drache",
        "electric": "Elektro",
        "fairy": "Fee",
        "fighting": "Kampf",
        "fire": "Feuer",
        "flying": "Flug",
        "ghost": "Geist",
        "grass": "Pflanze",
        "ground": "Boden",
        "ice": "Eis",
        "normal": "Normal",
        "poison": "Gift",
        "psychic": "Psycho",
        "rock": "Gestein",
        "steel": "Stahl",
        "water": "Wasser"
    },
};