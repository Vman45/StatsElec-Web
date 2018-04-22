var route          = require("express").Router(),
    Counter        = require("../models/counters").Model,
    HistoTelemetry = require("../models/histoTelemetry").Model,
    beautifier     = require("../dataBeautifier"),
    colors         = require("colors"),
    moment         = require("moment");


route.get("/", (req, res) => res.redirect("/"));

route.get("/[0-9]{12}", (req, res) => {    
    var counterId = req.url.slice(1,13);
    
    var data = { }

    // Check if the counter exists
    new Counter().where({ id: counterId}).fetch().then(counter => {
        if(counter == null) res.status(404).render("errors/notExists");
        else {
            // Put counter informations into data variable
            data = counter.toJSON();

            // Beautify some values
            data.StrThreephases = beautifier.threephasesToString(data.threephases);
            data.StrType        = beautifier.counterTypeToString(data.type);
            data.StrContract    = beautifier.contractToString(data.contract);
            data.StrCreated_at  = moment(data.created_at).format("DD/MM/YYYY HH:mm");
            data.StrUpdated_at  = moment(data.updated_at).locale("fr").fromNow();

            res.render("counter", {
                siteOptions: {
                    pageTitle: `Compteur ${data.name} (${data.id})`
                }, data
            });
        }
    });
});

module.exports = route;