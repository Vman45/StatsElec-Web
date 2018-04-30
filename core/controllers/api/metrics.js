var route          = require("express").Router(),
    Counter        = require("../../models/counters").Model,
    HistoTelemetry = require("../../models/histoTelemetry").Model,
    beautifier     = require("../../dataBeautifier"),
    colors         = require("colors"),
    util           = require("util"),
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
                    else {
                        var rawData = t.toJSON(),
                            data    = [];

                        // Clear useless indexes before sending it
                        rawData.forEach(el => data.push(beautifier.removeUselessColumns(counterInfo, el)));

                        res.json({ code: 200, data });
                    }
                });
            } else res.status(501).json({ code: 501, message: "Telemetry from standard mode counters are not available for now." });
        }
    });
});


// Retrieve all available tags with the description, the relation and the unit
route.get("/[0-9]{12}/tags", (req, res) => {
    var counterId = req.url.slice(1,13);

    Counter.where("id", counterId).fetch().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counter found." });
        else {
            var counterInfos = r.toJSON(),
                tagsList     = beautifier.contractMetricsTags(counterInfos.contract, counterInfos.threephases),
                data         = [];

            tagsList.forEach(tag => data.push(beautifier.tagInformations(tag, counterInfos)));

            res.json({ code: 200, data });
        }
    });
});


// Retrieve the informations of the tag
route.get("/[0-9]{12}/tags/:tag", (req, res) => {
    var counterId = req.url.slice(1,13);

    Counter.where("id", counterId).fetch().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counter found." });
        else {
            var counterInfos = r.toJSON(),
                tagsList     = beautifier.contractMetricsTags(counterInfos.contract, counterInfos.threephases),
                data         = beautifier.tagInformations(req.params.tag, counterInfos);

            
            if(util.isError(data)) res.status(404).json({ code: 404, message: "Unknown tag/column. Please check the list of possible tags and his relations." });
            else {
                var tagExists = false;

                // Check if the tag is available for the subscribed contract
                tagsList.forEach(tag => {
                    if(tag == data.tag || tag == data.db_relation) tagExists = true;
                });

                if(tagExists == true) res.json({ code: 200, data });
                else res.status(403).json({ code: 403, message: "This tag is not available with the subscribed contract." });
            }
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
                    if(err.routine == "errorMissingColumn") res.status(404).json({ code: 404, message: "The column doesn't exists. Please check available columns relation with the tag description endpoint." });
                    else res.status(500).json({ code: 500, message: "An unknown error is happenned when you tried to retrieve the telemetry." });
                });
            } else res.status(501).json({ code: 501, message: "Telemetry from standard mode counters are not available for now." });
        }
    });
});

module.exports = route;