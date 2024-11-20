let text = document.getElementById('text');
let input = document.getElementById('daysInput');
let loadingLabel = document.getElementById('loadingLabel');
const myChart1 = document.getElementById('myChart1');
const myChart2 = document.getElementById('myChart2');
const myChart3 = document.getElementById('myChart3');

document.addEventListener("DOMContentLoaded", async () => {


    days = window.location.search.slice(1, window.location.search.length);
    if (days != "" && !isNaN(days)) {
        console.log("Loading Chart for " + days + " days...");
        loadingLabel.innerHTML = "Loading Chart for " + days + " days...";
        await main(days - 1);
        console.log("Done");
        loadingLabel.innerHTML = "Done";
    }

});

async function goBtn() {
    if (input.value != "" && !isNaN(input.value)) {
        console.log("Loading Chart for " + input.value + " days...");
        loadingLabel.innerHTML = "Loading Chart for " + input.value + " days...";
        await main(input.value - 1);
        console.log("Done");
        loadingLabel.innerHTML = "Done";
    }
}

async function main(days) {
    let visits = [];
    let go = [];
    let copy = [];
    for (let i = 0; i <= days; i++) {
        visits[i] = await getVisits(getDay() - (days - i));
        go[i] = await getGo(getDay() - (days - i));
        copy[i] = await getCopy(getDay() - (days - i));
        loadingLabel.innerHTML = "Loading Chart for " + (days + 1) + " days... " + Math.round(((i + 1) / (days + 1) * 100)) + "%";
        console.log((i + 1) + "/" + (days + 1));
    }

    var xValues = [];
    for (let i = 0; i <= days; i++) {
        xValues[i] = getDay() - days + i;
    }

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            backgroundColor: '#2F4550',
        },
        title: {
            text: 'PokeString Statistics',
            style: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: 'white'
            }
        },
        xAxis: {
            categories: xValues.map(x => getDate(x)),
            labels: {
                style: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Values',
                style: {
                    color: 'white'
                }
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'white',
                    textOutline: 'none'
                }
            },
            labels: {
                style: {
                    color: 'white'
                }
            }
        },
        tooltip: {
            formatter: function () {
                const newDay = new Date(xValues[this.point.index] * 1000 * 86400);
                return ('<b>' + whatDay(newDay.getDay()) + '</b> the <b>' + this.x + '</b><br>' + this.series.name + ': <b>' + this.y + '</b>/' + this.total + ' (' + Math.floor(this.y / this.total * 100) + '%)');
            }
            /*headerFormat: '<b>{arr[1]}</b><br/>',
            context: { arr: ['1', '2', '3'] },
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'*/
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
                    enabled: true,
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

input.addEventListener("keypress", function (event) {
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

function whatDay(day) {
    switch (day) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Satruday';
    }
}

async function getVisits(day) {
    const response = await fetch("https://api.counterapi.dev/v1/complicative.github.io/visits" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.count || 0 });
    return response;
}

async function getGo(day) {

    const response = await fetch("https://api.counterapi.dev/v1/complicative.github.io/goBtn" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.count || 0 });
    return response;
}

async function getCopy(day) {

    const response = await fetch("https://api.counterapi.dev/v1/complicative.github.io/copy" + day)
        .then(async res => res.json())
        .then(async visits => { return await visits.count || 0 });
    return response;
}