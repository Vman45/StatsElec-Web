var influxDB = require("influx");


/**
 * 
 * @param {*} config 
 * @param {*} initRetention 
 */
module.exports = (config, initRetention) => {
    var influx = new influxDB.influx({
        host: config.influx.host,
        database: config.influx.database,
        schema: [
            {
                measurement: "metric",
                fields: {
                    tag: influxDB.FieldType.STRING,
                    value: influxDB.FieldType.INTEGER,
                    counterId: influxDB.FieldType.INTEGER
                }
            }
        ]
    });

    if(initRetention == true) {
        influx.alterRetentionPolicy("metricRetention", {
            duration: `${config.general.metricRetention}d`,
            replication: 1,
            default: true
        });
    }


    return influx;
}