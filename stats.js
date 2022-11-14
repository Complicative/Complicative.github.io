let text = document.getElementById('text');
let input = document.getElementById('daysInput');
const myChart1 = document.getElementById('myChart1');
const myChart2 = document.getElementById('myChart2');
const myChart3 = document.getElementById('myChart3');

document.addEventListener("DOMContentLoaded", async () => {
    main(3);
    //console.log(getDate(getDay() - 1));

});

function goBtn() {
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
        xValues[i] = getDate(getDay() - days + i);
    }

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'PokeString Statistics'
        },
        xAxis: {
            categories: xValues
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        series: [{
            name: 'Page Visits',
            data: visits
        }, {
            name: 'Go Button Presses',
            data: go
        }, {
            name: 'Copy Button Presses',
            data: copy
        }],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                },
                stacking: "normal"
            },
            column: {
                pointPadding: 0,
                borderWidth: 0,
                groupPadding: 0.05,
                shadow: false

            }
        },
        colors: ['#586F7C', '#EB5E28', '#AFFC41']
    });
}

async function mainOld(days) {
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
                data: visits
            }]
        }
    });

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
                data: go
            }]
        }
    });

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
                data: copy
            }]
        }
    });
}

input.addEventListener("keypress", function (event) {
    console.log("test");
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("goBtn").click();
    }
});



function getDay() {
    const currentDay = Math.floor((Date.now() / 1000) / 86400);
    return currentDay;
};

function getDate(day) {
    const newDay = new Date(day * 1000 * 86400);
    return (newDay.getDate() + "." + (newDay.getMonth() + 1));
}

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