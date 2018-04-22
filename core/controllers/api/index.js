var route = require("express").Router();

route.use("/counters", require("./counters"));
route.use("/metrics", require("./metrics"));
route.all("*", (req, res) => res.status(404).json({ code: 404, message: "This endpoint not exists. Please refer you to the documentation for available endpoints." }));

module.exports = route;