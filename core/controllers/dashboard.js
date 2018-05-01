var route          = require("express").Router(),
    Counter        = require("../models/counters").Model,
    HistoTelemetry = require("../models/histoTelemetry").Model,
    _              = require("lodash"),
    moment         = require("moment"),
    colors         = require("colors")


route.get("/", (req, res) => {
    // Retrieve counters numbers
    Promise.all([ 
        Counter.count("id"), // Retrieve counters numbers
        HistoTelemetry.query(q => q.max("index1 as 1").max("index2 as 2").max("index3 as 3").max("index4 as 4").max("index5 as 5").max("index6 as 6")).fetchAll(), // Retrieve total Consumption
        HistoTelemetry.query(q => q.max("index1 as 1").max("index2 as 2").max("index3 as 3").max("index4 as 4").max("index5 as 5").max("index6 as 6").where("received_at", ">=", moment().startOf("day").format())).fetchAll(), // Retrieve max counter indexes of the day
        HistoTelemetry.query(q => q.min("index1 as 1").min("index2 as 2").min("index3 as 3").min("index4 as 4").min("index5 as 5").min("index6 as 6").where("received_at", ">=", moment().startOf("day").subtract("1", "second").format())).fetchAll(), // Retrieve min counter indexes of the day
        HistoTelemetry.query(q => q.orderBy("received_at", "desc").limit(15)).fetchAll() // Retrieve last telemetries
        
    ]).then(r => {
        // Calculate the total Consumption
        var totalConsumption = r[1].toJSON()[0];
            totalConsumption = _.sum([ totalConsumption["1"], totalConsumption["2"], totalConsumption["3"], totalConsumption["4"], totalConsumption["5"], totalConsumption["6"] ]);

        // Calculate today consumption
        var todayConsumptionMax = r[2].toJSON()[0];
            todayConsumptionMax = _.sum([ todayConsumptionMax["1"], todayConsumptionMax["2"], todayConsumptionMax["3"], todayConsumptionMax["4"], todayConsumptionMax["5"], todayConsumptionMax["6"] ]);

        var todayConsumptionMin = r[3].toJSON()[0];
            todayConsumptionMin = _.sum([ todayConsumptionMin["1"], todayConsumptionMin["2"], todayConsumptionMin["3"], todayConsumptionMin["4"], todayConsumptionMin["5"], todayConsumptionMin["6"] ]);

        var todayConsumption = todayConsumptionMax - todayConsumptionMin;

        // Serve the file        
        res.render("index", {
            siteOptions: {
                pageTitle: "Dashboard"
            }, data: {
                nbCounters: r[0],
                todayConsumption,
                totalConsumption,
                lastMetrics: r[4].toJSON() 
            }
        });
    }).catch(e => {
        res.status(404).render("errors/error");
        console.log(e);
    });
});


route.get("/list", (req, res) => {
    Counter.fetchAll().then(c => {
        var counters = c.toJSON();

        res.render("counterList", {
            siteOptions: {
                pageTitle: "Liste des compteurs"
            }, data: counters
        });
    });
});

module.exports = route;