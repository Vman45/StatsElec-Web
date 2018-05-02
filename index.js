var express    = require("express"),
    bodyParser = require("body-parser"),
    pug        = require("pug"),
    colors     = require("colors"),
    db         = require("./core/databaseConnector"),
    app        = express(),
    env        = (typeof process.env.NODE_ENV !== "undefined") ? (process.env.NODE_ENV).toLowerCase() : "development",

    config;


console.info(colors.cyan(`Starting StatsElec in '${env}' mode.`));

// Start migrations (and check if the database is accessible)
console.log(colors.cyan("Testing the connection with the database and launch latest migrations"));

db.knex.migrate.latest().then(migrations => {
    if(migrations[1].length == 0) console.log(colors.green("No migrations available. Database up to date."));
    else console.log(colors.green("Database updated with new migrations."));
}).catch(err => {
    console.error(colors.red("Unable to run migrations or connecting to the database. Trace: ", err));
    process.exit(1);
});


// Try to open the configuration file
try { config = require(__dirname + "/config/config"); } 
catch(err) {
    console.error(colors.red("An error is occured when we tried to open the configuration file. Please check if is exists. Traces :\n", err));
    process.exit(1);
}


// Create constants for the web server
const HTTP_BIND = process.env.HOST || config.general.host || "0.0.0.0";
const HTTP_PORT = process.env.PORT || config.general.port || 8055;


// Configure express
app.disable("x-powered-by")
app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/assets", express.static(__dirname + "/public/assets"));


// Initialize MQTT connection and listening for new messages
require(__dirname + "/core/brokerListener")(config);
require(__dirname + "/core")(app);


// Start the Web server
app.listen(HTTP_PORT, HTTP_BIND, (err) => console.log(colors.green("Yey! StatsElec is listening on: http://" + HTTP_BIND + ":" + HTTP_PORT + "/")));