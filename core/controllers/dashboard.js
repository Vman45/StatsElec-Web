var route = require("express").Router(),
    colors = require("colors"),
    influx = require("../influxInitialization")(false),
    Dataset = require("../datasetToolkit").Dataset;


route.get("/", (req, res) => {
    var dataset = new Dataset("counters");

    var data = {
        todayConsumption: 0,
        totalConsumption: 0,
        nbCounters: 0,
        lastTelemetries: []
    }

    // Get numbers of counters
    if(dataset != null) {
        dataset.getAllDataset((err, results) => {
            if(err != null) nbCounters = NaN;
            else nbCounters = results.length;
        });
    }

    // Get latests telemetries
    influx.query(`select counterid from metrics ORDER BY DESC LIMIT 15`).then(telemetries => {
        telemetries.forEach(line => data.lastTelemetries.push({ counterid: line.counterid, timestamp: new Date(line.time.getNanoTime() / 1000000) }));

        // Serve the file        
        res.render("index", {
            siteOptions: {
                pageTitle: "Dashboard"
            }, data: data
        });
    }).catch(() => res.status(500).send("Une erreur est survenue lors de la tentative de récupération des données."));
});


route.get("/list", (req, res) => {
    var dataset = new Dataset("counters");

    // Get the list of counters
    if(dataset != null) {
        dataset.getAllDataset((err, results) => {
            if(err != null) {
                res.status(500).send("Une erreur est survenue lors de la tentative de récupération de la liste des compteurs.");
            } else {
                res.render("counterList", {
                    siteOptions: {
                        pageTitle: "Liste des compteurs"
                    }, data: results
                });
            }
        });
    }
});

module.exports = route;