var metrics = require("./metricManipulation"),
    Dataset = require("./datasetToolkit").Dataset,
    mqtt    = require("mqtt"),
    colors  = require("colors");


module.exports = (config, influx) => {
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
                    var dataset = new Dataset("counters");

                    if(dataset != Error) {
                        dataset.find("counterid", electron.fundamental.counterid, (err, result) => {
                            console.log(electron);
                            if(result == null) {
                                dataset.insert(electron.fundamental, (err, entry) => {
                                    if(err != null) console.warn(colors.yellow("Unable to create this new counter. Trace:", err));
                                    else {
                                        Object.keys(electron.extras).forEach(key => {
                                            if(key == "indexes") {
                                                Object.keys(electron.extras.indexes).forEach(index => {
                                                    influx.writePoints([
                                                        {
                                                            measurement: "metrics",
                                                            tags: { },
                                                            fields: {
                                                                tag: index,
                                                                value: electron.extras.indexes[index],
                                                                counterid: electron.fundamental.counterid
                                                            }
                                                        }
                                                    ]);
                                                });
                                            } else {
                                                influx.writePoints([
                                                    {
                                                        measurement: "metrics",
                                                        tags: { },
                                                        fields: {
                                                            tag: key,
                                                            value: electron.extras[key],
                                                            counterid: electron.fundamental.counterid
                                                        }
                                                    }
                                                ]);
                                            }
                                        });
                                    }
                                });
                            } else {
                                Object.keys(electron.extras).forEach(key => {
                                    if(key == "indexes") {
                                        Object.keys(electron.extras.indexes).forEach(index => {
                                            console.log(index, electron.extras.indexes[index])
                                            influx.writePoints([
                                                {
                                                    measurement: "metrics",
                                                    tags: { },
                                                    fields: {
                                                        tag: index,
                                                        value: electron.extras.indexes[index],
                                                        counterid: electron.fundamental.counterid
                                                    }
                                                }
                                            ]);
                                        });
                                    } else {
                                        influx.writePoints([
                                            {
                                                measurement: "metrics",
                                                tags: { },
                                                fields: {
                                                    tag: key,
                                                    value: electron.extras[key],
                                                    counterid: electron.fundamental.counterid
                                                }
                                            }
                                        ]);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}