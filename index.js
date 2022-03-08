let goBtn = document.getElementById('goBtn');
let output = document.getElementById('output');
let type1Select = document.getElementById('type1Select');
let type2Select = document.getElementById('type2Select');
let copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener("click", evt => {

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(output.textContent);

    /* Alert the copied text */
    //alert("Copied the text: " + output.textContent);
    copyBtn.style.background = "#00aa00";
})

goBtn.addEventListener("click", evt => {

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

    for (let i = 0; i < effectivness.length; i++) {
        console.log(i + ': ' + effectivness[i].length);
    }

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

    output.textContent = `@${effectiveAttacks.join(',@')}`;

    copyBtn.style.background = "#aaaaaa";

})