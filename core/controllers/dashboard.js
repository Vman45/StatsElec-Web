var route = require("express").Router();


route.get("/", (req, res) => {
    res.render("index", {
        siteOptions: {
            pageTitle: "Dashboard"
        }
    });
});

module.exports = route;