var route          = require("express").Router(),
    Counter        = require("../models/counters").Model,
    HistoTelemetry = require("../models/histoTelemetry").Model,
    beautifier     = require("../dataBeautifier"),
    colors         = require("colors"),
    moment         = require("moment");


route.get("/", (req, res) => res.redirect("/"));

route.get("/[0-9]{12}", (req, res) => {    
    var counterId = req.url.slice(1,13);
    
    var data = {
        counterInfo: null,
        metrics: {},
    }

    // Check if the counter exists
    new Counter().where({ id: counterId}).fetch().then(counter => {
        if(counter == null) res.render("errors/notExists");
        else {
            // Put counter informations into data variable
            data.counterInfo = counter.toJSON();

            // Beautify some values
            data.counterInfo.threephases = beautifier.threephasesToString(data.counterInfo.threephases);
            data.counterInfo.type = beautifier.counterTypeToString(beautifier);
            data.counterInfo.contract = beautifier.contractToString(data.counterInfo.contract);

            // Retrieve all telemetry
            if(data.counterInfo.tic_mode == 0) {
                // Historical mode
                //.where({ counterId })
                new HistoTelemetry().where("received_at", ">=", moment().subtract(1, "m")).fetchAll().then(r => {
                    console.log("dataf: ", r.toJSON());
                    
                    res.render("counter", {
                        siteOptions: {
                            pageTitle: `Compteur ${data.counterInfo.name} (${data.counterInfo.id})`
                        }, data
                    });
                });
            } else {
                res.render("counter", {
                    siteOptions: {
                        pageTitle: `Compteur ${data.counterInfo.name} (${data.counterInfo.id})`
                    }, data
                });
            }
            
        }
    });
});

module.exports = route;