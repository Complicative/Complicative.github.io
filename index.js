let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let langSwitcher = document.getElementById('langSwitcher');
let PKMNSelectCurrent = document.getElementById('PKMNSelectCurrent');
let PKMNSelectNext = document.getElementById('PKMNSelectNext');
//let PKMNSelectOld = document.getElementById('PKMNSelectOld');


let dictionary;
let translations;
let translationsPKMN;
let bossObject;
let bosses = [];

async function getTranslations() {
    const response = await fetch("https://complicative.github.io/dictionary.json");
    return await response.json();
}

async function getTranslationsPKMN() {
    const response = await fetch("https://complicative.github.io/dictionaryPKMN.json");
    return await response.json();
}

async function getBosses() {
    const response = await fetch("https://complicative.github.io/raid_bosses.json");
    return await response.json();
}





//localisation
let locale = document.documentElement.lang;



document.addEventListener("DOMContentLoaded", async() => {

    translations = await getTranslations();
    translations = translations['myDic'];

    translationsPKMN = await getTranslationsPKMN();
    translationsPKMN = translationsPKMN['myPKMNDic'];

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

    setBosses('legend', PKMNSelectCurrent);
    setBosses('mega', PKMNSelectNext);
    //setBosses('previous', PKMNSelectOld);


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

async function setBosses(time, select) {

    let nbossObject = bossObject[time];
    /*const tier1Object = nbossObject["1"];
    const tier3Object = nbossObject["3"];
    const tier5Object = nbossObject["5"];
    const tierMObject = nbossObject["mega"];*/

    /*
    [0] = name
    [1] = type1
    [2] = type2
    [3] = special form
    [4] = dex id
    [5] = tier (legend or mega)
    */

    console.log(nbossObject)

    if (nbossObject != undefined)
        nbossObject.forEach(elem => {
            bosses.push([elem["name"], elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"], elem['id'], time])
        })

    console.log(bosses)

    bosses.sort((a, b) => {
        return translatePKMN(a[0], a[4]) > translatePKMN(b[0], b[4]);
    })


    bosses.forEach(elem => {
        if (elem[5] == time) {
            let option = document.createElement("option");
            option.setAttribute("type1", elem[1].toLowerCase());
            option.setAttribute("type2", elem[2].toLowerCase());
            option.value = elem[4] + " " + elem[3];
            option.innerText = `${translatePKMN(elem[0], elem[4])}${elem[3] != "Normal" ? " " + elem[3] : ""}`;
            select.appendChild(option);
        }
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

function translatePKMN(pkmnName, pkmnID) {
    if (translationsPKMN[locale] != undefined && translationsPKMN[locale][pkmnID] != undefined) {
        return translationsPKMN[locale][pkmnID];
    } else {
        return pkmnName;
    }
}

langSwitcher.addEventListener("change", () => {
    //Event Listener for the lang change
    locale = langSwitcher.value
    const pathWithoutParam = window.location.href.split('?')[0];
    window.location.assign(pathWithoutParam + "?" + locale);
});

PKMNSelectCurrent.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectCurrent.value == "none") return;
    type1Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectCurrent.value)[1].toLowerCase();
    type2Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectCurrent.value)[2].toLowerCase();
});

PKMNSelectNext.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectNext.value == "none") return;
    type1Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectNext.value)[1].toLowerCase();
    type2Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectNext.value)[2].toLowerCase();
});

/*PKMNSelectOld.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectOld.value == "none") return;
    type1Select.value = bosses.find(elem => elem[5] + " " + elem[4] == PKMNSelectOld.value)[2].toLowerCase();
    type2Select.value = bosses.find(elem => elem[5] + " " + elem[4] == PKMNSelectOld.value)[3].toLowerCase();
});*/

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