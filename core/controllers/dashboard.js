var route   = require("express").Router(),
    Counter = require("../models/counters").Model,
    HistoTelemetry = require("../models/histoTelemetry").Model,    
    colors  = require("colors")


route.get("/", (req, res) => {
    var data = {
        todayConsumption: 0,
        totalConsumption: 0,
        nbCounters: 0
    }

    HistoTelemetry.fetchPage({ limit: 15 }).then(e => {
        console.log(e);
    })
    // Retrieve counters numbers
    Promise.all([ 
        Counter.count("id") // Retrieve counters numbers
        // Retrieve last telemetries
    ]).then(r => {
        console.log(r[1].toJSON())
        
        // Serve the file        
        res.render("index", {
            siteOptions: {
                pageTitle: "Dashboard"
            }, data: {
                nbCounters: r[0],
                todayConsumption: 0,
                totalConsumption: 0,
                lastMetrics: r[1].toJSON() 
            }
        });
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