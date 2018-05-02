var env = (typeof process.env.NODE_ENV !== "undefined") ? (process.env.NODE_ENV).toLowerCase() : "development",
    dbConfig  = require("../knexfile")[env],
    knex      = require("knex")(dbConfig),
    bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;