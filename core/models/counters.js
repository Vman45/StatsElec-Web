var bookshelf = require("../databaseConnector");

var Model = bookshelf.Model.extend({
    tableName: "counters",
    hasTimestamps: ["created_at", "updated_at"]
});

module.exports = Model;