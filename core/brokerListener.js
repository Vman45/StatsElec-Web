var metrics        = require("./metricManipulation"),
    Counter        = require("./models/counters").Model,
    HistoTelemetry = require("./models/histoTelemetry").Model,
    mqtt           = require("mqtt"),
    colors         = require("colors");


module.exports = (config) => {
    console.log(colors.yellow("Trying to connect to MQTT Broker..."));


    var stringBuilded = `mqtt://${config.mqtt.host}:`;

    if(typeof config.mqtt.port !== "undefined" || typeof config.mqtt.port !== "string" || config.mqtt.port != "") stringBuilded += config.mqtt.port;
    else stringBuilded += 1883;

    var client = mqtt.connect(stringBuilded);


    // Subscribe to the counter topic if the connection successful
    client.on("connect", () => {
        console.log(colors.green("Successful connection to MQTT broker!"));

        client.subscribe(config.general.houseName + "/counter");
    });


    // Show an error (and closing the server?) if an error is happening
    client.on("error", (err) => {
        console.error(colors.red("An error is happened during the communication with the MQTT broker. Traces :\n"))
    });


    // Close the server if the connection is not etablished
    client.on("offline", () => {
        console.error(colors.red("Unable to connect to MQTT broker. Please check if the broker is running."));
        process.exit(1);
    });


    // Call the parsing function if a message arrives.
    client.on("message", (topic, message) => {
        if(topic == config.general.houseName + "/counter") {
            metrics.createElectron(message.toString(), (err, electron) => {
                if(err != null) console.warn(colors.yellow("This metric is not arrived in conformity. Trace:", err));
                else {
                    // Check if the counter already exists
                    new Counter().where({ id: electron.info.id }).fetch().then(r => {
                        if(r == null) {
                            console.info(colors.cyan("New counter detected! Attempt to add the counter into the database."));

                            // Create new Counter
                            Counter.forge(electron.info).save(null, { method: "insert" }).then(() => {
                                console.info(colors.green(`The new counter ${electron.info.id} has been added! Insering the telemetry.`));
                                
                                insertTelemetry(electron); // Insert telemetry
                            }).catch(errAdd => console.error("An error is occured when we tried to add new counter. Trace:", errAdd));
                        } else {
                            var cinfo = r.toJSON();

                            // Insert telemetry
                            insertTelemetry(electron);
                        }
                    });
                }
            });
        }
    });
}


// Function for inserting telemtry into the good table
function insertTelemetry(electron) {
    // Check the TIC Mode
    var telemetry; 

    // if(electron.info.tic_mode == 0) telemetry = HistoTelemetry.forge({
    //     counterId: electron.data.counterId,
    //     index1: electron.data.index2
    // });
    // else var telemetry = null;

    // Forge and save data into database
    new HistoTelemetry(electron.data).save().then(() => console.info(colors.green(`New telemetry from ${electron.info.id} has been added.`))).catch(err => console.error(colors.red(`Unable to add the telemetry from ${electron.info.id}. Trace: `, err)));
}