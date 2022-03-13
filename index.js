let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');


//localisation
let locale = document.documentElement.lang;
document.addEventListener("DOMContentLoaded", () => {
    const dic = fetch("./dic.JSON")
        .then(res => res.json())
        .then(data => console.log("dic: " + data['lang']) + data['lang']['test'])
    console.log(dic);
    console.log(dic['lang']['test'])
    console.log("Day: " + getDay());
    if (window.location.protocol == "file:") {
        fetch("https://api.countapi.xyz/get/complicative.github.io/visits" + getDay())
            .then(res => res.json())
            .then(visits => {
                console.log("Total visits today: " + visits.value);
            })
    } else {
        fetch("https://api.countapi.xyz/hit/complicative.github.io/visits" + getDay())
            .then(res => res.json())
            .then(visits => {
                console.log("Total visits today: " + visits.value);
            })
    }
    fetch("https://api.countapi.xyz/get/complicative.github.io/goBtn" + getDay())
        .then(res => res.json())
        .then(visits => {
            console.log("Total GO Button uses: " + visits.value);
        })
    fetch("https://api.countapi.xyz/get/complicative.github.io/copy" + getDay())
        .then(res => res.json())
        .then(visits => {
            console.log("Total copies to clipboard: " + visits.value);
        })

    locale = window.location.search.slice(1, window.location.search.length);
    langSwitcher.value = locale;
    if (langSwitcher.value == []) {
        locale = 'en'
        langSwitcher.value = locale;
    }
    document
    // Find all elements that have the key attribute and translate them
        .querySelectorAll("[key]")
        .forEach(translateElement);
});

function translateElement(element) {
    //Translates elem depending on current locale var
    const key = element.getAttribute("key");
    let translation;
    if (translations[locale][key] != undefined) {
        translation = translations[locale][key];
    } else {
        translation = translations['en'][key];
    }
    element.innerText = translation;
};
langSwitcher.addEventListener("change", () => {
    //Event Listener for the lang change
    locale = langSwitcher.value
    const pathWithoutParam = window.location.href.split('?')[0];
    window.location.assign(pathWithoutParam + "?" + locale);
});




goBtn.addEventListener("click", evt => {
    //Event Listener for the GO Button
    printTypes(locale);
    fetch("https://api.countapi.xyz/hit/complicative.github.io/goBtn" + getDay());
});

copyBtn.addEventListener("click", evt => {
    //Copy the output
    navigator.clipboard.writeText(output.textContent);
    //Change button colour, as confirmation
    copyBtn.style.color = "green";
    fetch("https://api.countapi.xyz/hit/complicative.github.io/copy" + getDay());
});

function getDay() {
    const currentDay = Math.floor((Date.now() / 1000) / 86400);
    return currentDay;
};



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
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack},${thirdEffectiveAttack}&`;
    } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'three') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack}&${thirdEffectiveAttack}&`;
    }

    if (document.querySelector('input[name="defTypesRadio"]:checked').value == "weak") {
        output.textContent += `${weakTypes}`;
    } else if (document.querySelector('input[name="defTypesRadio"]:checked').value == "strong") {
        output.textContent += `${strongTypes}`;
    }


    //change copy button background to black
    copyBtn.style.color = "white";
};

function getAttacks(type, e) {

    let effectiveAttacks = [];
    let typeIndex = types.indexOf(type);
    for (let i = 0; i < types.length; i++) {
        if (effectivness[i][typeIndex] == e) {

            effectiveAttacks.push(types[i]);

        }
    }
    return effectiveAttacks;

};

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
    "es": {
        "bug": "Bicho",
        "dark": "Siniestro",
        "dragon": "Dragón",
        "electric": "Eléctrico",
        "fairy": "Hada",
        "fighting": "Lucha",
        "fire": "Fuego",
        "flying": "Volador",
        "ghost": "Fantasma",
        "grass": "Planta",
        "ground": "Tierra",
        "ice": "Hielo",
        "normal": "Normal",
        "poison": "Veneno",
        "psychic": "Psíquico",
        "rock": "Roca",
        "steel": "Acero",
        "water": "Agua",

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
    "fr": {
        "bug": "Insecte",
        "dark": "Ténèbres",
        "dragon": "Dragon",
        "electric": "Electrique",
        "fairy": "Fée",
        "fighting": "Combat",
        "fire": "Feu",
        "flying": "Vol",
        "ghost": "Spectre",
        "grass": "Herbe",
        "ground": "Sol",
        "ice": "Glace",
        "normal": "Normal",
        "poison": "Poison",
        "psychic": "Psy",
        "rock": "Roche",
        "steel": "Acier",
        "water": "Eau",

        "effectAtt": "Attaque Effective",
        "defTypes": "Types:",

        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",

        "noAttacks": "Aucun",
        "weakTypes": "Aucune",
        "strongTypes": "Résiste seulement",
        "noDefTypes": "Aucune",

        "copyToClipboard": "Copier vers le presse-papier"
    },
    "no": {
        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
        "noAttacks": "Ingen",
        "weakTypes": "Ingen svakhet",
        "strongTypes": "Bare står imot",
        "noDefTypes": "Ingen",
        "copyToClipboard": "Kopiere til utklippstavle"
    },
    "kli": {
        "bug": "jI'oy'",
        "dark": "Hurgh",
        "dragon": "Duq",
        "electric": "'ul",
        "fairy": "maSaH",
        "fighting": "Bisuv",
        "fire": "baH",
        "flying": "Suv",
        "ghost": "Lom qa'",
        "grass": "'uch",
        "ground": "yav",
        "ice": "chuch",
        "normal": "motlh",
        "poison": "tar",
        "psychic": "QI'yaH",
        "rock": "nagh",
        "steel": "naQ",
        "water": "bIQ",
        "effectAtt": "vaj jangDI' qeylIS.",
        "defTypes": "Segh",
        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
        "noAttacks": "pagh",
        "weakTypes": "puj",
        "strongTypes": "polonyuS",
        "noDefTypes": "pagh",
        "copyToClipboard": "qeylIS"
    },
    "it": {
        "bug": "Coleottero",
        "dark": "Buio",
        "dragon": "Drago",
        "electric": "Elettro",
        "fairy": "Folletto",
        "fighting": "Lotta",
        "fire": "Fuoco",
        "flying": "Volante",
        "ghost": "Spettro",
        "grass": "Erba",
        "ground": "Terra",
        "ice": "Ghiaccio",
        "normal": "Normale",
        "poison": "Veleno",
        "psychic": "Psico",
        "rock": "Roccia",
        "steel": "Acciaio",
        "water": "Acqua",


        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",

    },
    "sv": {
        "bug": "Insekt",
        "dark": "Mörk",
        "dragon": "Drake",
        "electric": "Elektrisk",
        "fairy": "Fe",
        "fighting": "Kamp",
        "fire": "Eld",
        "flying": "Flygande",
        "ghost": "Spöke",
        "grass": "Gräs",
        "ground": "Mark",
        "ice": "Is",
        "normal": "Normal",
        "poison": "Gift",
        "psychic": "Psykisk",
        "rock": "Sten",
        "steel": "Stål",
        "water": "Vatten",


        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
    },
    "fi": {
        "bug": "Hyönteinen",
        "dark": "Pimeys",
        "dragon": "Lohikäärme",
        "electric": "Sähkö",
        "fairy": "Keiju",
        "fighting": "Tappelu",
        "fire": "Tuli",
        "flying": "Lento",
        "ghost": "Aave",
        "grass": "Ruoho",
        "ground": "Maa",
        "ice": "Jää",
        "normal": "Normaali",
        "poison": "Myrkky",
        "psychic": "Meedio",
        "rock": "Kivi",
        "steel": "Teräs",
        "water": "Vesi",


        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
    },
    "cs": {
        "oneAttack": "1+",
        "twoAttacks": "2+",
        "threeAttacks": "3",
    }
};