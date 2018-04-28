var route   = require("express").Router(),
    _       = require("lodash"),
    Counter = require("../models/counters").Model,
    HistoTelemetry = require("../models/histoTelemetry").Model,    
    colors  = require("colors")


route.get("/", (req, res) => {
    var data = {
        todayConsumption: 0,
        totalConsumption: 0,
        nbCounters: 0
    }

    // Retrieve last telemetries

    // Retrieve counters numbers
    Counter.count("id").fetchAll(c => {
        console.log(c);
    });
    
    // Serve the file        
    res.render("index", {
        siteOptions: {
            pageTitle: "Dashboard"
        }, data: {}
    });
});


route.get("/list", (req, res) => {
    Counter.fetchAll().then(c => {
        var counters = c.toJSON();

        console.log(counters);
        
        res.render("counterList", {
            siteOptions: {
                pageTitle: "Liste des compteurs"
            }, data: counters
        });
    });
});

module.exports = route;