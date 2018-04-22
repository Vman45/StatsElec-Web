var route          = require("express").Router(),
    Counter        = require("../../models/counters").Model,
    colors         = require("colors"),
    moment         = require("moment");


// Retrieve all counters
route.get("/", (req, res) => {
    Counter.fetchAll().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counters found." });
        else res.json({ code: 200, data: r.toJSON() });
    });
});


// Retrive specified counter
route.get("/[0-9]{12}", (req, res) => {    
    var counterId = req.url.slice(1,13);

    Counter.where("id", counterId).fetch().then(r => {
        if(r == null) res.status(404).json({ code: 404, message: "No counter found." });
        else res.json({ code: 200, data: r.toJSON() });
    });
});

module.exports = route;