module.exports = (app) => {
    app.use("/", require(__dirname + "/controllers/dashboard"));
    app.use("/counter", require(__dirname + "/controllers/counter"));
    app.use("/api", require(__dirname + "/controllers/api"));
}