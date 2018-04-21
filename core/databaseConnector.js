var dbConfig  = require("../knexfile").development,
    knex      = require("knex")(dbConfig),
    bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;