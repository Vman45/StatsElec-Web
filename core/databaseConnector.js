var dbConfig  = require("../knexfile")[process.env.NODE_ENV.toLowerCase() || "development"],
    knex      = require("knex")(dbConfig),
    bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;