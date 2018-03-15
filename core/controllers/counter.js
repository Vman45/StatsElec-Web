var route = require("express").Router();


route.get("/", (req, res) => {
    res.render("counter", {
        siteOptions: {
            pageTitle: "Compteur A00000000000"
        }
    });
});

module.exports = route;