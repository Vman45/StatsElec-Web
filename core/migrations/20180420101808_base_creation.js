exports.up = function(knex, Promise) {
    return createCountersTable()
           .then(createHistoricalTelemetryTable);
    
    
    // Create counters table
    function createCountersTable() {
        return knex.schema.createTable("counters", t => {
            t.bigInteger("id").primary().unsigned().unique().notNullable();
            t.string("name", 15).defaultTo("sans nom");
            t.string("localisation", 25).defaultTo("inconnu");
            t.integer("type").unsigned().notNullable();
            t.string("contract", 8).notNullable();
            t.integer("sub_power").unsigned().notNullable();
            t.boolean("threephases").notNullable().defaultTo(false);
            t.integer("tic_mode").unsigned().notNullable();
            t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
            t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        });
    }
        

    // Create historical telemetry table
    function createHistoricalTelemetryTable() {
        return knex.schema.createTable("histo_telemetry", t => {
            t.bigIncrements("id").notNullable();
            t.bigInteger("counterId").unsigned().notNullable();
            t.integer("index1").unsigned();
            t.integer("index2").unsigned();
            t.integer("index3").unsigned();
            t.integer("index4").unsigned();
            t.integer("index5").unsigned();
            t.integer("index6").unsigned();
            t.integer("iinst1").unsigned();
            t.integer("iinst2").unsigned();
            t.integer("iinst3").unsigned();
            t.integer("imax1").unsigned();
            t.integer("imax2").unsigned();
            t.integer("imax3").unsigned();
            t.timestamp("received_at").notNullable().defaultTo(knex.fn.now());
            t.foreign("counterId").references("counters.id");
        });
    }
    
};

exports.down = function(knex, Promise) {
    return dropHistoricalTelemetryTable()
           .then(dropCountersTable);


    // Drop counters table
    function dropCountersTable() {
        return knex.schema.dropTableIfExists("counters");
    }


    // Drop historical telemetry table
    function dropHistoricalTelemetryTable() {
        return knex.schema.dropTableIfExists("histo_telemetry");
    }
};