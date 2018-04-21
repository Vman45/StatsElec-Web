var Chart      = require("chart.js"),
    moment     = require("moment"),
    beautifier = require("../../../../../core/dataBeautifier");


module.exports = () => {
    if(document.querySelector("#counterPage") != null) {
        infos.charts.forEach(chartKey => {
            console.log(chartKey)
            var chartData = {
                labels: [ ],
                datasets: [{
                    label: chartKey.name,
					backgroundColor: "#5aa3e777",
					borderColor: "#5aa3e7",
					data: [ ],
					fill: true
				}]
            }

            // Insert data into dataset
            var chartInfo = chartData.datasets[0].data;
            var labels    = chartData.labels;

            for(var i = 0; i < metrics.length; i++) {
                console.log(metrics[i], metrics[i][chartKey.raw])
                labels.push(moment(metrics[i].received_at).format("DD/MM/YYYY HH:mm:ss"));
                chartInfo.push(metrics[i][chartKey.raw]);
            }


            // Generate the chart
            var chart = new Chart(document.getElementById("graph-" + chartKey).getContext("2d"), {
                type: "line",
                data: chartData,
                options: {
                    title: {
                        display: true,
                        text: chartKey.name
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            console.log(chart)
        })
    }


}