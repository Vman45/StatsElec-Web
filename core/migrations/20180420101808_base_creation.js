exports.up = function(knex, Promise) {
    return createCountersTable()
           .then(createHistoricalTelemetryTable);
    
    
    // Create counters table
    function createCountersTable() {
        return knex.schema.createTable("counters", t => {
            t.integer("id").primary().unsigned().unique();
            t.string("name", 15);
            t.string("localisation", 25);
            t.string("contract", 4);
            t.integer("sub_power").unsigned();
            t.boolean("threephases").defaultTo(false);
            t.integer("tic_mode").unsigned();
            t.timestamp("created_at").defaultTo(knex.fn.now());
            t.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }
        

    // Create historical telemetry table
    function createHistoricalTelemetryTable() {
        return knex.schema.createTable("histo_telemetry", t => {
            t.bigIncrements("id");
            t.integer("counterId").unsigned();
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
            t.timestamp("received_at").defaultTo(knex.fn.now());
            t.foreign("counterId").references("counters.id");
        });
    }
    
};

exports.down = function(knex, Promise) {
    return dropCountersTable()
           .then(dropHistoricalTelemetryTable);


    // Drop counters table
    function dropCountersTable() {
        return knex.schema.dropTableIfExists("counters");
    }


    // Drop historical telemetry table
    function dropHistoricalTelemetryTable() {
        return knex.schema.dropTableIfExists("histo_telemetry");
    }
};