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

    describe("#detectContractType", () => {
        it("should return hchp (lpl mode - hchp tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "HCHP", "256325874", "M" ]
            ]

            assert.equal(metricManipulation.detectContractType(tempData), "hchp");
        });

        it("should return base (organized mode - base tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                BASE: "000006325"
            }

            assert.equal(metricManipulation.detectContractType(tempData), "base");
        });

        it("should return unknown (lpl mode - no specific tag)", () => {
            var tempData = [
                [ "ADCO", "256347852365", "<" ],
                [ "BOO", "256325874", "M" ]
            ]

            assert.equal(metricManipulation.detectContractType(tempData), "unknown");
        });

        it("should return unknown (organized mode - no specific tag)", () => {
            var tempData = {
                ADCO: "256347852365",
                BOO: "000006325"
            }

            assert.equal(metricManipulation.detectContractType(tempData), "unknown");
        });
    });

    describe("#createElectron", () => {
        it("should return electron object", () => {
            var tempData = "ADCO 256325478541 >\nOPTARIF HC.. <\nISOUSC 45 ?\nHCHP 000563248 !\nHCHP 000236587 )\nPTEC HC.. S\nIINST 010 X\nIMAX 090 H\nPAPP 02430 ,\nHHPHC A ,\nMOTDETAT 000000 B";

            metricManipulation.createElectron(tempData, (err, electron) => {
                if(err != null) assert.fail();
                else assert.ok(true);
            });
        });
    });
});