var Chart      = require("chart.js"),
    moment     = require("moment"),
    beautifier = require("../../../../../core/dataBeautifier");


module.exports = () => {
    if(document.querySelector("#counterPage") != null) {
        // Retrive counterID
        var counterId = document.querySelector("li#counterId i").innerHTML;


        // Retrieve all indexes
        var indexesXhr = new XMLHttpRequest(),
            indexes    = [];

        indexesXhr.open("GET", `/api/metrics/${counterId}/tags`);
        indexesXhr.send();

        indexesXhr.onreadystatechange = event => {
            if(indexesXhr.readyState === XMLHttpRequest.DONE) {
                if(indexesXhr.status == 200) {
                    indexes = JSON.parse(indexesXhr.responseText).data;
                    
                    indexes.forEach(index => retrieveMetrics(index));
                }
            }
        };


        function retrieveMetrics(informations) {
            // Create the div and the canvas for chart.js
            var chartDiv = `<div class="col-all"><canvas id="graph-${informations.tag}" class="graphs"></canvas></div>`;
            document.querySelector("section#metrics").innerHTML += chartDiv;


            // Retrieve LocalStorage data
            console.log(sessionStorage.getItem(`${counterId}.${informations.tag}.dateStart`));
            
            // Retrieve data from API
            var metricsXhr = new XMLHttpRequest(),
                metrics    = [];

            metricsXhr.open("GET", `/api/metrics/${counterId}/${informations.db_relation}?startDate=&endDate=`);
            metricsXhr.send();

            metricsXhr.onreadystatechange = (event) => {
                if(metricsXhr.readyState === XMLHttpRequest.DONE) {
                    if(metricsXhr.status == 200) {
                        metrics = JSON.parse(metricsXhr.responseText).data;

                        generateChart(informations, metrics);
                    }
                }
            }
        }


        function generateChart(informations, metrics) {
            var chartData = {
                labels: [ ],
                datasets: [{
                    label: informations.unit,
                    backgroundColor: "#5aa3e777",
                    borderColor: "#5aa3e7",
                    data: [ ],
                    fill: true
                }]
            }


            // Insert all metrics into chartData
            metrics.forEach(metric => {
                chartData.labels.push(moment(metric.received_at).format("DD/MM/YYYY HH:mm:ss"));
                chartData.datasets[0].data.push(metric[informations.db_relation]);
            });
    
    
            // Generate the chart
            new Chart(document.getElementById("graph-" + informations.tag).getContext("2d"), {
                type: "line",
                data: chartData,
                options: {
                    title: {
                        display: true,
                        text: informations.description
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
}