var assert = require("assert"),
    beautifier = require("../core/dataBeautifier");

describe("Test data Beautifier functions", () => {
    describe("#threephasesToString", () => {
        it("should return 'triphasé'", () => assert.equal(beautifier.threephasesToString(1), "triphasé"));
        it("should return 'monophasé'", () => assert.equal(beautifier.threephasesToString(0), "monophasé"));
        it("should return 'monophasé' (unknown value)", () => assert.equal(beautifier.threephasesToString(89), "monophasé"));
    });

    describe("#counterTypeToString", () => {
        it("should return 'linky'", () => assert.equal(beautifier.counterTypeToString(1), "Linky"));
        it("should return 'electronique'", () => assert.equal(beautifier.counterTypeToString(0), "Electronique"));
        it("should return 'Electronique ou Linky' (99 value)", () => assert.equal(beautifier.counterTypeToString(99), "Electronique ou Linky"));
        it("should return 'Inconnu' (random value)", () => assert.equal(beautifier.counterTypeToString(87), "Inconnu"));
    });

    describe("#contractToString", () => {
        it("should return base string", () => assert.equal(beautifier.contractToString("base"), "Tarification de base"));
        it("should return tempo (with RAiNbOW taG NoTATion)", () => assert.equal(beautifier.contractToString("TEmPo"), "Tarification Tempo"));
        it("should return unknown value (random value)", () => assert.equal(beautifier.contractToString("random"), "inconnu (random)"));
    });

    describe("#tagName", () => {
        it("should return PAPP string", () => assert.equal(beautifier.tagName("papp"), "Puissance apparente"));
        it("should return IINST2 (with RAiNbOW taG NoTATion)", () => assert.equal(beautifier.tagName("IinSt2"), "Intensité instantanée phase 2"));
        it("should return null (random value)", () => assert.equal(beautifier.tagName("random"), null));
    });

    describe("#tagUnit", () => {
        it("should return PMAX unit (W)", () => assert.equal(beautifier.tagUnit("PMAX"), "W"));
        it("should return BBRHCJB (with RAiNbOW taG NoTATion)", () => assert.equal(beautifier.tagUnit("BBrHcjB"), "Wh"));
        it("should return null with ADCO", () => assert.equal(beautifier.tagUnit("ADCO"), null));
        it("should return null (random value)", () => assert.equal(beautifier.tagUnit("random"), null));
    });
});