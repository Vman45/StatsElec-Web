var InfluxDB = require("influx"),
    colors   = require("colors"),
    config;


// Try to open the configuration file
try { config = require(__dirname + "/../config/config"); } 
catch(err) {
    console.error(colors.red("An error is occured when we tried to open the configuration file. Please check if is exists. Traces :\n", err));
    process.exit(1);
}


/**
 * 
 * @param {Boolean} initRetention Enable the retention rule alteration
 */
module.exports = (initRetention) => {
    var influx = new InfluxDB.InfluxDB({
        host: config.influx.host,
        database: config.influx.database
    });


    // Check if the database exists and create it if isn't
    influx.getDatabaseNames().then((dbs) => {
        if(!dbs.includes(config.influx.database)) return influx.createDatabase(config.influx.database)
    });


    // Create/alter retention rule if the argument initRetention equal true
    if(initRetention == true) {
        influx.alterRetentionPolicy("metricRetention", {
            duration: `${config.general.metricRetention}d`,
            replication: 1,
            default: true
        }).catch(() => {
            influx.createRetentionPolicy("metricRetention", {
                duration: `${config.general.metricRetention}d`,
                replication: 1,
                default: true
            });
        });
    }

    return influx;
}