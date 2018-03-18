var route = require("express").Router(),
    colors = require("colors"),
    influx = require("../influxInitialization")(false),
    Dataset = require("../datasetToolkit").Dataset;


route.get("/", (req, res) => {
    var dataset = new Dataset("counters");

    var data = {
        todayConsumption: 0,
        totalConsumption: 0,
        nbCounters: 0
    }

    // Get numbers of counters
    if(dataset != null) {
        dataset.getAllDataset((err, results) => {
            if(err != null) {
                console.error(colors.red(err));
                nbCounters = NaN;
            } else nbCounters = results.length;
        });
    }

    // Retrieve informations from influx
    influx.query("select SUM(DISTINCT(value)) FROM metrics WHERE ").then(results => {
        console.log(results[0].count);
    })

    res.render("index", {
        siteOptions: {
            pageTitle: "Dashboard"
        }, data: data
    });
});


route.get("/list", (req, res) => {
    var dataset = new Dataset("counters");

    // Get the list of counters
    if(dataset != null) {
        dataset.getAllDataset((err, results) => {
            if(err != null) {
                console.error(colors.red(err));
                res.status(500).send("Une erreur est survenue lors de la tentative de récupération de la liste des compteurs.");
            } else {
                res.render("index", {
                    siteOptions: {
                        pageTitle: "Dashboard"
                    }, data: results
                });
            }
        });
    }
});

module.exports = route;