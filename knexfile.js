var config = require("./config/config");

module.exports = {
    development: {
        client: 'pg',
        connection: config.db.dev,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations_history',
            directory: './core/migrations'
        }
    },

    staging: {
        client: 'pg',
        connection: config.db.staging,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations_history',
            directory: './core/migrations'
        }
    },

    production: {
        client: 'pg',
        connection: config.db.prod,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations_history',
            directory: './core/migrations'
        }
    }
};
