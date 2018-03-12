var express    = require("express"),
    bodyParser = require("body-parser"),
    pug        = require("pug"),
    influx     = require("influx"),
    mqtt       = require("mqtt"),
    fs         = require("fs"),
    app        = express();


// Configure express
app.disable("x-powered-by")
app.set("view engine", "pug");
app.use("/assets", express.static(__dirname + "/dist"));


app.get("/", (req, res) => {
    res.render("index", {
        siteOptions: {
            pageTitle: "Dashboard"
        }
    });
})

app.get("/counter", (req, res) => {
    res.render("counter", {
        siteOptions: {
            pageTitle: "Compteur 10001002021"
        }
    });
})

app.listen(8088, "localhost", (err) => {
    if(err) throw err;

    console.log("It's work on port 8088");
});