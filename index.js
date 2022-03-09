let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');
let attackAmountSelect = document.getElementById('attackAmountSelect');


//localisation
let locale;
document.addEventListener("DOMContentLoaded", () => {
    locale = langSwitcher.value
    document
    // Find all elements that have the key attribute and translate them
        .querySelectorAll("[key]")
        .forEach(translateElement);
});

function translateElement(element) {
    //Translates elem depending on current locale var
    const key = element.getAttribute("key");
    const translation = translations[locale][key];
    element.innerText = translation;
}
langSwitcher.addEventListener("change", () => {
    //Event Listener for the lang change
    locale = langSwitcher.value
    document
    // Find all elements that have the key attribute
        .querySelectorAll("[key]")
        .forEach(translateElement);
})




goBtn.addEventListener("click", evt => {
    //Event Listener for the GO Button
    printTypes(locale);
});

copyBtn.addEventListener("click", evt => {
    //Copy the output
    navigator.clipboard.writeText(output.textContent);
    //Change button colour, as confirmation
    copyBtn.style.background = "#00aa00";
});



function printTypes(lang) {

    //Get the types from the selector
    let type1 = type1Select.value;
    let type2 = type2Select.value;
    let typeIndex1 = types.indexOf(type1);
    let typeIndex2 = types.indexOf(type2);

    //Effective Attacks
    //Create 2 arrays for effective attacks
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

    //Combine arrays -> sort -> remove duplicates
    let effectiveAttacks = effectiveAttacks1.concat(effectiveAttacks2);
    effectiveAttacks = effectiveAttacks.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })


    //InEffective Attacks
    //Create 2 arrays for ineffective attacks
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

    //Combine arrays -> sort -> remove duplicates
    let inEffectiveAttacks = inEffectiveAttacks1.concat(inEffectiveAttacks2);
    inEffectiveAttacks = inEffectiveAttacks.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })

    //Removes ineffective attacks from effective attacks
    effectiveAttacks = effectiveAttacks.filter(val => !inEffectiveAttacks.includes(val));

    //translate the array
    effectiveAttacks = effectiveAttacks.map(elem => translations[locale][elem]);

    //makes the Attacks printable
    const anyEffectiveAttack = `@${effectiveAttacks.join(',@')}`;
    const firstEffectiveAttack = `@1${effectiveAttacks.join(',@1')}`;
    const secondEffectiveAttack = `@2${effectiveAttacks.join(',@2')}`;

    //outputs the array
    output.textContent = "";

    if (attackAmountSelect.value == 'any') {
        output.textContent += `${anyEffectiveAttack}`;
    } else if (attackAmountSelect.value == 'both') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack}`;
    }

    //change copy button background to black
    copyBtn.style.background = "black";
}


//Type effectivness arrays
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

//Dictionary
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
        "water": "Water",

        "anyAttack": "Any attack is effective",
        "bothAttacks": "Both attacks are effective",
        "copyToClipboard": "Copy to Clipboard"
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
        "water": "Wasser",

        "anyAttack": "Irgendeine Attacks ist effektiv",
        "bothAttacks": "Beide Attacken sind effektiv",
        "copyToClipboard": "In die Zwischenablage kopieren"
    },
};