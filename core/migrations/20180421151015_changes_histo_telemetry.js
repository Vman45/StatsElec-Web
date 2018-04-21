
exports.up = function(knex, Promise) {
    return knex.schema.table("histo_telemetry", t => {
        t.dropColumn("imax1");
        t.dropColumn("imax2");
        t.dropColumn("imax3"); 
    });
};

exports.down = function(knex, Promise) {
    // Voluntary if nothing is downgraded here.
};
