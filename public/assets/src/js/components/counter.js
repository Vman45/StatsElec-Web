var Chart = require("chart.js");

module.exports = () => {
    // Assign trigger to all open-info buttons
    document.querySelectorAll("a.open-info").forEach((btn) => {
        btn.addEventListener("click", (el) => {
            el.preventDefault();

            btn.classList.toggle("clicked");
            document.querySelector(".info-bar").classList.toggle("opened");
        });
    });


    if(document.querySelector("#counterPage") != null) {
        Object.keys(data).forEach(chartKey => {
            var chartData = {
                labels: [ ],
                datasets: [{
                    label: chartKey,
					backgroundColor: "#5aa3e777",
					borderColor: "#5aa3e7",
					data: [ ],
					fill: true
				}]
            }

            // Insert data into dataset
            var chartInfo = chartData.datasets[0].data;
            var labels    = chartData.labels;

            for(var i = 0; i < data[chartKey].length; i++) {
                labels.push(data[chartKey][i].timestamp);
                chartInfo.push(data[chartKey][i].value);
            }

            // Generate the chart
            
            var chart = new Chart(document.getElementById("graph-" + chartKey).getContext("2d"), {
                type: "line",
                data: chartData,
                options: {
                    title: {
                        display: true,
                        text: "Etiquette " + chartKey
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            console.log(chart)
        })
    }


}