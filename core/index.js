module.exports = (app) => {
    app.use("/", require(__dirname + "/controllers/dashboard"));
    app.use("/counter", require(__dirname + "/controllers/counter"));
    app.use("/api", require(__dirname + "/controllers/api"));
    app.all("*", (req, res) => res.status(404).render("errors/error", { siteOptions: { pageTitle: "Erreur" }}));
}