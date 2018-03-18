var assert = require("assert"),
    metricManipulation = require("../core/metricManipulation");

describe("Test metric manipulation functions", () => {
    describe("#detectTICMode", () => {
        it("should return 'standard' (lpl mode - EASFXX tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "EASF02", "000001241", "M" ]
            ]

            assert.equal(metricManipulation.detectTICMode(tempData), "standard");
        });

        it("should return 'standard' (organized mode - VTIC tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                VTIC: "02"
            }

            assert.equal(metricManipulation.detectTICMode(tempData), "standard");
        });

        it("should return 'historical' (lpl mode - HCHC tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "HCHC", "000006325", "M" ]
            ]

            assert.equal(metricManipulation.detectTICMode(tempData), "historical");
        });

        it("should return 'historical' (organized mode - EJPHPM tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                EJPHPM: "000006325"
            }

            assert.equal(metricManipulation.detectTICMode(tempData), "historical");
        });

        it("should return 'unknown' (lpl mode - no specific tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "NOTEXIT", "02", "M" ]
            ]

            assert.equal(metricManipulation.detectTICMode(tempData), "unknown");
        });
    });

    describe("#isThreePhases", () => {
        it("should return 'false' (lpl mode - no specific tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "NOTEXIT", "02", "M" ]
            ]

            assert.equal(metricManipulation.isThreePhases(tempData), false);
        });

        it("should return 'false' (organized mode - no specific tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                BASE: "000006325"
            }

            assert.equal(metricManipulation.isThreePhases(tempData), false);
        });

        it("should return 'true' (lpl mode - IINST2 tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "IINST2", "12", "M" ]
            ]

            assert.equal(metricManipulation.isThreePhases(tempData), true);
        });

        it("should return 'true' (organized mode - IMAX1 tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                IMAX1: "12"
            }

            assert.equal(metricManipulation.isThreePhases(tempData), true);
        });
    });
});