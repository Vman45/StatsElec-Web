var route = require("express").Router(),
    colors = require("colors")


route.get("/", (req, res) => {
    var dataset = new Dataset("counters");

    var data = {
        todayConsumption: 0,
        totalConsumption: 0,
        nbCounters: 0,
        lastTelemetries: []
    }

    
    // Serve the file        
    res.render("index", {
        siteOptions: {
            pageTitle: "Dashboard"
        }, data: {}
    });
});


route.get("/list", (req, res) => {
    var dataset = new Dataset("counters");

    res.render("counterList", {
        siteOptions: {
            pageTitle: "Liste des compteurs"
        }, data: {}
    });
});

module.exports = route;