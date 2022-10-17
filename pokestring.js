let goBtn = document.getElementById('goBtn');
let outputDiv = document.getElementById('outputDiv');
let outputTitle = document.getElementById('outputTitle');
let output = document.getElementById('output');
let output2Div = document.getElementById('output2Div');
let output2Title = document.getElementById('output2Title');
let output2 = document.getElementById('output2');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');
let copy2Btn = document.getElementById('copy2Btn');
let langSwitcher = document.getElementById('langSwitcher');
let PKMNSelectLegend = document.getElementById('PKMNSelectLegend');
let PKMNSelectMega = document.getElementById('PKMNSelectMega');


let dictionary;
let translations;
let translationsPKMN;
let bossObject;
let bosses = [];

const acc_color = getComputedStyle(document.documentElement).getPropertyValue("--acc-color");
const positive_color = getComputedStyle(document.documentElement).getPropertyValue("--positive-color");
const primary_text_color = getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color");
const primary_border_color = getComputedStyle(document.documentElement).getPropertyValue("--primary-border-color");
const primary_content_background_color = getComputedStyle(document.documentElement).getPropertyValue("--primary-content-background-color");

async function getTranslations() {
    const response = await fetch("https://www.pokestring.app/dictionary.json");
    return await response.json();
}

async function getTranslationsPKMN() {
    const response = await fetch("https://www.pokestring.app/dictionaryPKMN.json");
    return await response.json();
}

async function getBosses() {
    const response = await fetch("https://www.pokestring.app/raid_bosses.json");
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

    setBosses('legend', PKMNSelectLegend);
    setBosses('mega', PKMNSelectMega);


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

    /*
    [0] = name
    [1] = type1
    [2] = type2
    [3] = special form
    [4] = dex id
    [5] = tier (legend or mega)
    */

    if (nbossObject != undefined)
        nbossObject.forEach(elem => {
            bosses.push([elem["name"], elem['type'][0], elem['type'][1] != undefined ? elem['type'][1] : elem['type'][0], elem["form"], elem['id'], time])
        })


    bosses.sort((a, b) => {
        //While I could write this sort algorythm in 1 line, chrome doesn't want to behave if I do that :/
        if (translatePKMN(a[0], a[4]) > translatePKMN(b[0], b[4]))
            return 1;
        else return -1;
    })
    console.log(bosses);


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

PKMNSelectLegend.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectLegend.value == "none") return;
    type1Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectLegend.value)[1].toLowerCase();
    type2Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectLegend.value)[2].toLowerCase();
    goBtn.style.backgroundColor = acc_color;
});

PKMNSelectMega.addEventListener("change", () => {
    //Event Listener for the lang change
    if (PKMNSelectMega.value == "none") return;
    type1Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectMega.value)[1].toLowerCase();
    type2Select.value = bosses.find(elem => elem[4] + " " + elem[3] == PKMNSelectMega.value)[2].toLowerCase();
    goBtn.style.backgroundColor = acc_color;
});

type1Select.addEventListener("change", () => {
    PKMNSelectLegend.value = "none";
    goBtn.style.backgroundColor = acc_color;
})
type2Select.addEventListener("change", () => {
    PKMNSelectLegend.value = "none";
    goBtn.style.backgroundColor = acc_color;
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
    output.style.color = positive_color;
    copyBtn.style.color = positive_color;
    output.style.backgroundColor = primary_content_background_color;
    copyBtn.style.backgroundColor = primary_content_background_color;
    output2.style.color = primary_text_color;
    copy2Btn.style.color = primary_text_color;
    output2.style.backgroundColor = primary_content_background_color;
    copy2Btn.style.backgroundColor = primary_content_background_color;
    fetch("https://api.countapi.xyz/hit/complicative.github.io/copy" + getDay());
});

copy2Btn.addEventListener("click", evt => {
    //Copy the output
    navigator.clipboard.writeText(output2.textContent);
    //Change button colour, as confirmation
    output2.style.color = positive_color;
    copy2Btn.style.color = positive_color;
    output2.style.backgroundColor = primary_content_background_color;
    copy2Btn.style.backgroundColor = primary_content_background_color;
    output.style.color = primary_text_color;
    copyBtn.style.color = primary_text_color;
    output.style.backgroundColor = primary_content_background_color;
    copyBtn.style.backgroundColor = primary_content_background_color;
    fetch("https://api.countapi.xyz/hit/complicative.github.io/copy" + getDay());
});

function getDay() {
    const currentDay = Math.floor((Date.now() / 1000) / 86400);
    return currentDay;
};



function printTypes(lang) {



    //Get the types from the selector
    const type1 = type1Select.value;
    const type2 = type2Select.value;

    //Effective Attacks
    //Create 2 arrays for effective attacks
    const effectiveAttacks1 = getAttacks(type1, 1);
    const effectiveAttacks2 = getAttacks(type2, 1);

    //Combine arrays -> sort -> remove duplicates
    let effectiveAttacks = combineArrayWithoutDuplicates(effectiveAttacks1, effectiveAttacks2);
    //Combine arrays to supereffective -> sort -> keep only duplicates
    let superEffectiveAttacks = combineArrayOnlyDuplicates(effectiveAttacks1, effectiveAttacks2);
    if (type1 == type2) superEffectiveAttacks = []


    //InEffective Attacks
    //Create 2 arrays for ineffective attacks
    const inEffectiveAttacks1 = getAttacks(type1, -1);
    const inEffectiveAttacks2 = getAttacks(type2, -1);

    //Combine arrays -> sort -> remove duplicates
    let inEffectiveAttacks = combineArrayWithoutDuplicates(inEffectiveAttacks1, inEffectiveAttacks2);

    //Removes ineffective attacks from effective attacks
    effectiveAttacks = effectiveAttacks.filter(val => !inEffectiveAttacks.includes(val));

    //translate the array
    let effectiveAttacksString = effectiveAttacks.map(elem => translations[locale][elem]);
    let superEffectiveAttacksString = superEffectiveAttacks.map(elem => translations[locale][elem]);

    //makes the Attacks printable
    const anyEffectiveAttack = `@${effectiveAttacksString.join(',@')}`;
    const firstEffectiveAttack = `@1${effectiveAttacksString.join(',@1')}`;
    const secondEffectiveAttack = `@2${effectiveAttacksString.join(',@2')}`;
    const thirdEffectiveAttack = `@3${effectiveAttacksString.join(',@3')}`;

    //makes the SuperAttacks printable
    const anySuperEffectiveAttack = `@${superEffectiveAttacksString.join(',@')}`;
    const firstSuperEffectiveAttack = `@1${superEffectiveAttacksString.join(',@1')}`;
    const secondSuperEffectiveAttack = `@2${superEffectiveAttacksString.join(',@2')}`;
    const thirdSuperEffectiveAttack = `@3${superEffectiveAttacksString.join(',@3')}`;



    /*//DefensiveType
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
    strongTypes = `${strongTypes.join(',')}`;*/


    //outputs the array
    output.textContent = "";
    output2.textContent = "";


    if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'one') {
        output.textContent += `${anyEffectiveAttack}&`;
    } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'two') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack},${thirdEffectiveAttack}&`;
    } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'three') {
        output.textContent += `${firstEffectiveAttack}&${secondEffectiveAttack}&${thirdEffectiveAttack}&`;
    }

    if (superEffectiveAttacks.length != 0) {
        outputDiv.style.width = "45%";
        output2Div.style.width = "45%";
        output2Title.style.borderWidth = "2px";
        output2.style.borderWidth = "2px";
        output2Title.innerHTML = "Double Effective<br />(2.56x damage)";

        copyBtn.style.width = "45%";
        copy2Btn.style.borderWidth = "2px";
        copy2Btn.style.width = "45%";
        copy2Btn.textContent = copyBtn.textContent;

        if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'one') {
            output2.textContent += `${anySuperEffectiveAttack}&`;
        } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'two') {
            output2.textContent += `${firstSuperEffectiveAttack}&${secondSuperEffectiveAttack},${thirdSuperEffectiveAttack}&`;
        } else if (document.querySelector('input[name="attackAmountRadio"]:checked').value == 'three') {
            output2.textContent += `${firstSuperEffectiveAttack}&${secondSuperEffectiveAttack}&${thirdSuperEffectiveAttack}&`;
        }
    } else {

        outputDiv.style.width = "90%";
        output2Div.style.width = "0%";
        output2Title.style.borderWidth = "0px";
        output2.style.borderWidth = "0px";
        output2Title.textContent = ""

        /*output2.textContent = "No supereffective attacks"
        output2.style.borderWidth = "0px";
        output2.style.width = "0%";
        output.style.width = "90%";*/

        copy2Btn.style.width = "0%";
        copy2Btn.style.padding = "default";
        copy2Btn.style.borderWidth = "0px";
        copy2Btn.textContent = "";
        copyBtn.style.width = "90%";
    }

    /*if (document.querySelector('input[name="defTypesRadio"]:checked').value == "weak") {
        output.textContent += `${weakTypes}`;
    } else if (document.querySelector('input[name="defTypesRadio"]:checked').value == "strong") {
        output.textContent += `${strongTypes}`;
    }*/


    //change copy button background to black
    copyBtn.style.color = primary_text_color;
    copyBtn.style.backgroundColor = acc_color;
    copy2Btn.style.color = primary_text_color;
    copy2Btn.style.backgroundColor = acc_color;
    output.style.color = primary_text_color;
    output2.style.color = primary_text_color;

    goBtn.style.backgroundColor = primary_content_background_color;
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
        return item != ary[pos - 1];
    })
    return newArr;
}

function combineArrayOnlyDuplicates(arr1, arr2) {
    let newArr = arr1.concat(arr2);
    newArr = newArr.sort().filter(function(item, pos, ary) {
        return item == ary[pos - 1];
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