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
        metrics: null,
    }

    // Get numbers of counters
    if(dataset != null) {
        dataset.find("counterid", counterId, (err, results) => {
            if(err != null) {
                console.error(colors.red(err));
                res.status(500).send("Une erreur est survenue en tentant de r&eacute;cup&eacute;rer les informations du compteur.");
            } else {
                if(results == null) {
                    res.status(404).send("Le compteur demand&eacute; est introuvable.");
                } else data.counterInfo = results;
                
                
                // Get last 60 days metrics
                influx.query(`select * from metrics where counterid = "${counterId}" and time > now() - 60d`).then(results => {
                    console.log(results)
                });
            
                res.render("counter", {
                    siteOptions: {
                        pageTitle: "Compteur " + counterId
                    }, data
                });
            }
        });
    }


});

module.exports = route;