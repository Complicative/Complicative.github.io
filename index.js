let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');
let PKMNSelectCurrent = document.getElementById('PKMNSelectCurrent');
let PKMNSelectOld = document.getElementById('PKMNSelectOld');


let dictionary;
let translations;
let bossObject;
let bossesCurrent = [];
let bossesOld = [];

async function getTranslations() {
    const response = await fetch("https://complicative.github.io/dictionary.json");
    return await response.json();
}

async function getBosses() {
    const response = await fetch("https://pogoapi.net/api/v1/raid_bosses.json");
    return await response.json();
}





//localisation
let locale = document.documentElement.lang;



document.addEventListener("DOMContentLoaded", async() => {

    translations = await getTranslations();
    translations = translations['myDic'];

    locale = window.location.search.slice(1, window.location.search.length);
    langSwitcher.value = locale;
    if (langSwitcher.value == []) {
        locale = 'en'
        langSwitcher.value = locale;
    }
    document
    // Find all elements that have the key attribute and translate them
        .querySelectorAll("[key]")
        .forEach(elem => {
            translateElement(elem);
        });


    bossObject = await getBosses();

    setBosses('current', PKMNSelectCurrent, bossesCurrent);
    setBosses('previous', PKMNSelectOld, bossesCurrent);


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



});

async function setBosses(time, select, bossArr) {

    let nbossObject = bossObject[time];
    const tier1Object = nbossObject["1"];
    const tier3Object = nbossObject["3"];
    const tier5Object = nbossObject["5"];
    const tierMObject = nbossObject["mega"];

    tierMObject.forEach(elem => {
        bossArr.push([elem["name"], "Mega", elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"]])
    })

    tier5Object.forEach(elem => {
        bossArr.push([elem["name"], 5, elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"]])
    })

    tier3Object.forEach(elem => {
        bossArr.push([elem["name"], 3, elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"]])
    })

    tier1Object.forEach(elem => {
        bossArr.push([elem["name"], 1, elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"]]);
    })

    bossArr.sort((a, b) => a[1] == b[1] ? a[0] > b[0] : 0);

    bossArr.forEach(elem => {
        let option = document.createElement("option");
        option.setAttribute("key", elem[0]);
        option.setAttribute("type1", elem[2].toLowerCase());
        option.setAttribute("type2", elem[3].toLowerCase());
        option.value = elem[0];
        option.innerText = `${elem[0]}${elem[4] != "Normal" ? " " + elem[4] : ""} (Tier ${elem[1]})`;
        select.appendChild(option);
    })

}

function translateElement(element) {
    //Translates elem depending on current locale var
    const key = element.getAttribute("key");
    let translation;
    if (translations[locale] != undefined && translations[locale][key] != undefined) {
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

PKMNSelectCurrent.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectCurrent.value == "none") return;
    type1Select.value = bossesCurrent.find(elem => elem[0] == PKMNSelectCurrent.value)[2].toLowerCase();
    type2Select.value = bossesCurrent.find(elem => elem[0] == PKMNSelectCurrent.value)[3].toLowerCase();

    //console.log(bosses.find(elem => elem[0] == PKMNSelect.value)[2] + " & " + bosses.find(elem => elem[0] == PKMNSelect.value)[3]);
});

PKMNSelectOld.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectOld.value == "none") return;
    type1Select.value = bossesOld.find(elem => elem[0] == PKMNSelectOld.value)[2].toLowerCase();
    type2Select.value = bossesOld.find(elem => elem[0] == PKMNSelectOld.value)[3].toLowerCase();

    //console.log(bosses.find(elem => elem[0] == PKMNSelect.value)[2] + " & " + bosses.find(elem => elem[0] == PKMNSelect.value)[3]);
});

type1Select.addEventListener("change", () => {
    PKMNSelectCurrent.value = "none";
})
type2Select.addEventListener("change", () => {
    PKMNSelectCurrent.value = "none";
})





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