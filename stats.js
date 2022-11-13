let text = document.getElementById('text');
let input = document.getElementById('daysInput');
const myChart1 = document.getElementById('myChart1');
const myChart2 = document.getElementById('myChart2');
const myChart3 = document.getElementById('myChart3');

document.addEventListener("DOMContentLoaded", async () => {
    //main(19);
});

function test() {
    main(input.value);
}

async function main(days) {
    let visits = [];
    let go = [];
    let copy = [];
    for (let i = 0; i <= days; i++) {
        visits[i] = await getVisits(getDay() - (days - i));
        go[i] = await getGo(getDay() - (days - i));
        copy[i] = await getCopy(getDay() - (days - i));
    }

    var xValues = [];
    for (let i = 0; i <= days; i++) {
        xValues[i] = days - i;
    }
    var yValues = visits;

    new Chart("myChart1", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Visits',
                fill: false,
                tension: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderColor: "rgba(0,0,0)",
                borderWidth: 1,
                barPercentage: 0.99,
                data: yValues
            }]
        }
    });

    yValues = go;

    new Chart("myChart2", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Go',
                fill: false,
                tension: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderColor: "rgba(0,0,0)",
                borderWidth: 1,
                barPercentage: 0.99,
                data: yValues
            }]
        }
    });

    yValues = copy;

    new Chart("myChart3", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Copy',
                fill: false,
                tension: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderColor: "rgba(0,0,0)",
                borderWidth: 1,
                barPercentage: 0.99,
                data: yValues
            }]
        }
    });
}



function getDay() {
    const currentDay = Math.floor((Date.now() / 1000) / 86400);
    return currentDay;
};

async function getVisits(day) {
    const response = await fetch("https://api.countapi.xyz/get/complicative.github.io/visits" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.value });
    return response;
}

async function getGo(day) {

    const response = await fetch("https://api.countapi.xyz/get/complicative.github.io/goBtn" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.value });
    return response;
}

async function getCopy(day) {

    const response = await fetch("https://api.countapi.xyz/get/complicative.github.io/copy" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.value });
    return response;
}