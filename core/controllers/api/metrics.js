var route          = require("express").Router(),
    Counter        = require("../../models/counters").Model,
    HistoTelemetry = require("../../models/histoTelemetry").Model,
    colors         = require("colors"),
    moment         = require("moment");



// Retrive all metrics of specified counter
route.get("/[0-9]{12}", (req, res) => {    
    var counterId = req.url.slice(1,13);

    Counter.where("id", counterId).fetch().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counter found." });
        else {
            var counterInfo = r.toJSON();

            if(counterInfo.tic_mode == 0) {
                // Retrieve from historical table
                var query = HistoTelemetry;

                // Start date filter
                if(typeof req.query.start === "string") {
                    if(moment(parseInt(req.query.start)).isValid()) query = query.where("received_at", ">=", moment(parseInt(req.query.start)).format());
                    else return res.status(400).json({ code: 400, message: "Date start filter is not valid. Please check if you use correct timestamp" });
                }

                // End date filter
                if(typeof req.query.end === "string") {
                    if(moment(parseInt(req.query.end)).isValid()) query = query.where("received_at", "<=", moment(parseInt(req.query.end)).format());
                    else return res.status(400).json({ code: 400, message: "Date end filter is not valid. Please check if you use correct timestamp" });
                }


                // Final query
                query.where("counterId", counterId).fetchAll().then(t => {
                    if(t.toJSON().length == 0) res.status(404).json({ code: 404, message: "No telemetry found for this counter." });
                    else res.json({ code: 200, data: t.toJSON() });
                });
            } else res.status(501).json({ code: 501, message: "Telemetry from standard mode counters are not available for now." });
        }
    });
});

// Retrive metrics tags
route.get("/[0-9]{12}/:tag", (req, res) => {    
    var counterId = req.url.slice(1,13);

    Counter.where("id", counterId).fetch().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counter found." });
        else {
            var counterInfo = r.toJSON();

            if(counterInfo.tic_mode == 0) {
                // Retrieve from historical table
                var query = HistoTelemetry;
        
                // Start date filter
                if(typeof req.query.start === "string") {
                    if(moment(parseInt(req.query.start)).isValid()) query = query.where("received_at", ">=", moment(parseInt(req.query.start)).format());
                    else return res.status(400).json({ code: 400, message: "Date start filter is not valid. Please check if you use correct timestamp" });
                }
        
                // End date filter
                if(typeof req.query.end === "string") {
                    if(moment(parseInt(req.query.end)).isValid()) query = query.where("received_at", "<=", moment(parseInt(req.query.end)).format());
                    else return res.status(400).json({ code: 400, message: "Date end filter is not valid. Please check if you use correct timestamp" });
                }
        
        
                // Final query
                query.where("counterId", counterId).fetchAll({ columns: ["counterId", req.params.tag, "received_at"] }).then(t => {
                    if(t.toJSON().length == 0) res.status(404).json({ code: 404, message: "No telemetry found for this counter." });
                    else res.json({ code: 200, data: t.toJSON() });
                }).catch(err => {
                    console.log(err);
                    res.json({ code: 500, message: "err"});
                })
            } else res.status(501).json({ code: 501, message: "Telemetry from standard mode counters are not available for now." });
        }
    });
});

module.exports = route;