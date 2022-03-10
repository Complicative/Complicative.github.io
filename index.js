let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');
let attackAmountSelect = document.getElementById('attackAmountSelect');
let defTypeSelect = document.getElementById('defTypeSelect');


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
    copyBtn.style.color = "green";
});



function printTypes(lang) {



    //Get the types from the selector
    let type1 = type1Select.value;
    let type2 = type2Select.value;

    //Effective Attacks
    //Create 2 arrays for effective attacks
    let effectiveAttacks1 = getAttacks(type1, 1);
    let effectiveAttacks2 = getAttacks(type2, 1);

    //Combine arrays -> sort -> remove duplicates
    let effectiveAttacks = combineArrayWithoutDuplicates(effectiveAttacks1, effectiveAttacks2);


    //InEffective Attacks
    //Create 2 arrays for ineffective attacks
    let inEffectiveAttacks1 = getAttacks(type1, -1);
    let inEffectiveAttacks2 = getAttacks(type2, -1);

    //Combine arrays -> sort -> remove duplicates
    let inEffectiveAttacks = combineArrayWithoutDuplicates(inEffectiveAttacks1, inEffectiveAttacks2);

    //Removes ineffective attacks from effective attacks
    effectiveAttacks = effectiveAttacks.filter(val => !inEffectiveAttacks.includes(val));

    //translate the array
    effectiveAttacks = effectiveAttacks.map(elem => translations[locale][elem]);

    //makes the Attacks printable
    const anyEffectiveAttack = `@${effectiveAttacks.join(',@')}`;
    const firstEffectiveAttack = `@1${effectiveAttacks.join(',@1')}`;
    const secondEffectiveAttack = `@2${effectiveAttacks.join(',@2')}`;
    const thirdEffectiveAttack = `@3${effectiveAttacks.join(',@3')}`;


    //DefensiveType
    //Create 2 arrays for Weak Def Type
    let weakTypes1 = getDefType(type1, 1);
    let weakTypes2 = getDefType(type2, 1);

    //Combine arrays -> sort -> remove duplicates
    let weakTypes = combineArrayWithoutDuplicates(weakTypes1, weakTypes2);

    //Create 2 arrays for Strong Def Types
    let strongTypes1 = getDefType(type1, -1);
    let strongTypes2 = getDefType(type2, -1);

    //Combine arrays -> sort -> remove duplicates
    let strongTypes = combineArrayWithoutDuplicates(strongTypes1, strongTypes2);

    //Remove weak types from strong types
    strongTypes = strongTypes.filter(val => !weakTypes.includes(val));

    //translate the array
    weakTypes = weakTypes.map(elem => translations[locale][elem]);

    //makes the Def Types printable
    weakTypes = `!${weakTypes.join('&!')}`;

    //translate the array
    strongTypes = strongTypes.map(elem => translations[locale][elem]);

    //makes the Def Types printable
    strongTypes = `${strongTypes.join(',')}`;


    //outputs the array
    output.textContent = "";


    if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'one') {
        output.textContent += `${anyEffectiveAttack}&`;
    } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'two') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack},${thirdEffectiveAttack}`;
    } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'three') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack}&${thirdEffectiveAttack}`;
    }

    if (document.querySelector('input[name="defTypesRadio"]:checked').value == "weak") {
        output.textContent += `${weakTypes}`;
    } else if (document.querySelector('input[name="defTypesRadio"]:checked').value == "strong") {
        output.textContent += `${strongTypes}`;
    }


    //change copy button background to black
    copyBtn.style.color = "white";
}

function getAttacks(type, e) {

    let effectiveAttacks = [];
    let typeIndex = types.indexOf(type);
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex] == e) {

            effectiveAttacks.push(types[i]);

        }
    }
    return effectiveAttacks;

}

function getDefType(type, e) {
    let defensiveTypes = [];
    let typeIndex = types.indexOf(type);
    for (let i = 0; i < types.length; i++) {
        if (effectivness[typeIndex][i] == e) {
            defensiveTypes.push(types[i]);
        }
    }
    return defensiveTypes;
}

function combineArrayWithoutDuplicates(arr1, arr2) {
    let newArr = arr1.concat(arr2);
    newArr = newArr.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
    return newArr;
}

//Type effectivness arrays
const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
const effectivness = [
    [0, 1, 0, 0, -1, -1, -1, -1, -1, 1, 0, 0, 0, -1, 1, 0, -1, 0], //bug
    [0, -1, 0, 0, -1, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], //dark
    [0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //dragon
    [0, 0, -1, -1, 0, 0, 0, 1, 0, -1, -1, 0, 0, 0, 0, 0, 0, 1], //electric
    [0, 1, 1, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0], //fairy
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
        "fighting": "Fighting",
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

        "effectAtt": "Effective Attacks:",
        "defTypes": "Types:",

        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
        "noAttacks": "None",

        "weakTypes": "No Weak",
        "strongTypes": "Only Resistant",
        "noDefTypes": "None",

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

        "effectAtt": "Effektive Attacken:",
        "defTypes": "Typen:",

        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
        "noAttacks": "Keine",

        "weakTypes": "Keine Schwachen",
        "strongTypes": "Nur Resistente",
        "noDefTypes": "Keine",

        "copyToClipboard": "In die Zwischenablage kopieren"
    },
};