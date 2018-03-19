var route = require("express").Router(),
    colors = require("colors"),
    influx = require("../influxInitialization")(false),
    Dataset = require("../datasetToolkit").Dataset;


route.get("/", (req, res) => res.redirect("/"));

route.get("/[0-9]{12}", (req, res) => {    
    var dataset = new Dataset("counters");
    var counterId = req.url.slice(1,13);

    var data = {
        counterInfo: null,
        metrics: {},
    }

    // Get numbers of counters
    if(dataset != null) {
        dataset.find("counterid", counterId, (err, results) => {
            if(err != null) {
                console.error(colors.red(err));
                return res.status(500).send("Une erreur est survenue en tentant de r&eacute;cup&eacute;rer les informations du compteur.");
            } else {
                if(results == null) return res.status(404).send("Le compteur demand&eacute; est introuvable.");
                else data.counterInfo = results;
                
                
                // Get last 60 days metrics
                influx.query(`select * from metrics where counterid = '${counterId}' and time > now() - 60d`).then(metrics => {
                    for(var i = 0; i < metrics.length; i++) {
                        var metric = metrics[i];

                        for(var x = 0; x < Object.keys(metric).length; x++) {
                            var tag = metric.tag;

                            if(tag != "pejp" && tag != "ptec" && tag != "demain" && tag != /imax(\d|)/ && tag != "hhphc") {
                                var metricCreated = false;
        
                                for(var y = 0; metricCreated != true && y < Object.keys(data.metrics).length; y++) {
                                    if(Object.keys(data.metrics)[y] == tag) metricCreated = true;
                                }
                                
                                if(metricCreated == false) data.metrics[tag] = [];
        
                                data.metrics[tag].push({ timestamp: new Date(metric.time.getNanoTime() / 1000000).toLocaleString(), value: metric.value });
                            }
                        }
                    }

                    res.render("counter", {
                        siteOptions: {
                            pageTitle: "Compteur " + counterId
                        }, data
                    });

                }).catch((err) => res.status(500).send("Une erreur est survenue en tentant de r&eacute;cup&eacute;rer les informations du compteur." + err));
            }
        });
    }
});

module.exports = route;