var metrics = require("./metricManipulation"),
    mqtt    = require("mqtt"),
    colors  = require("colors");


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
            try { 
                var jsonified = JSON.parse(message);

                readMetric(jsonified);
            } catch(err) { console.warn(colors.yellow("A metric is arrived but is not in conformity. Received metric:\n", jsonified)); }
        }
    });
}