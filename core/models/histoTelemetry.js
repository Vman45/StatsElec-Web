var bookshelf = require("../databaseConnector");

var Model = bookshelf.Model.extend({
    tableName: "histo_telemetry"
});

var Collection = bookshelf.Collection.extend({
    tableName: Model
});

module.exports = { Model, Collection };