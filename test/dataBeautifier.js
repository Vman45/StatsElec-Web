var assert = require("assert"),
    beautifier = require("../core/dataBeautifier"),
    util = require("util");

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

    describe("#removeUselessColumns", () => {
        it("should return single iinst and index1 (base contract)", () => {
            var infos = { contract: "base", threephases: false, tic_mode: 0 },
                datas = { counterId: "00000", index1: 153, index2: 0, index3: 0, index4: 0, index5: 0, index6: 0, iinst1: 12, iinst2: 0, iinst3: 0, received_at: 0 };

                
            assert.equal(Object.keys(beautifier.removeUselessColumns(infos, datas)).length, 4);
        });
        
        it("should return three iinst and index1 and index2 (hchp contract)", () => {
            var infos = { contract: "hchp", threephases: true, tic_mode: 0 },
                datas = [ { counterId: "00000", index1: 566, index2: 120, index3: 0, index4: 0, index5: 0, index6: 0, iinst1: 12, iinst2: 11, iinst3: 13, received_at: 0 }];

            
            assert.equal(Object.keys(beautifier.removeUselessColumns(infos, datas)[0]).length, 7);
        });

        it("should return three iinst and all indexes (tempo contract)", () => {
            var infos = { contract: "tempo", threephases: true, tic_mode: 0 },
                datas = { counterId: "00000", index1: 566, index2: 120, index3: 0, index4: 0, index5: 0, index6: 0, iinst1: 12, iinst2: 11, iinst3: 13, received_at: 0 };

            assert.equal(Object.keys(beautifier.removeUselessColumns(infos, datas)).length, 11);
        });
        
        it("should return an error with standard counter", () => {
            var infos = { contract: "base", threephases: false, tic_mode: 1 },
                datas = { counterId: "00000", index1: 0, index2: 2, index3: 55, index4: 23, index5: 0, index6: 0, iinst1: 0, iinst2: 0, iinst3: 0, received_at: 0 };

            assert.equal(util.isError(beautifier.removeUselessColumns(infos, datas)), true);
        });
        
        it("should return an error with malformed data", () => {
            var infos = { contract: "" },
                datas = { counterId: "00000", index1: 0, index2: 2, index3: 55, index4: 23, index5: 0, index6: 0, iinst1: 0, iinst2: 0, iinst3: 0, received_at: 0 };

                assert.equal(util.isError(beautifier.removeUselessColumns(infos, datas)), true);
        });
    });

    describe("#contractMetricsTags", () => {
        it("should return 2 tags (base contract, monophase)", () => assert.equal(beautifier.contractMetricsTags("base", false).length, 2));
        it("should return 5 tags (hchp contract, triphase)", () => assert.equal(beautifier.contractMetricsTags("hchp", true).length, 5));
        it("should return 7 tags (tempo contract, monophase)", () => assert.equal(beautifier.contractMetricsTags("tempo", false).length, 7));
        it("should return an error string", () => assert.equal(typeof beautifier.contractMetricsTags("dododo", false), "string"));
    });

    describe("#tagInformations", () => {
        it("should return informations about EJPHN tag", () => assert.equal(beautifier.tagInformations("ejphn", { contract: "hchp", tic_mode: 0, threephases: true }).db_relation, "index1"));
        it("should return informations about IINST2 tag", () => assert.equal(beautifier.tagInformations("iinst2", { contract: "hchp", tic_mode: 0, threephases: true }).db_relation, "iinst2"));
        it("should return informations about IINST with IINST2 tag (monophase installation)", () => assert.equal(beautifier.tagInformations("iinst2", { contract: "hchp", tic_mode: 0, threephases: false }).tag, "iinst"));
        it("should return informations about index1 column ", () => assert.equal(beautifier.tagInformations("index1", { contract: "hchp", tic_mode: 0, threephases: false }).tag, "hchc"));
        it("should return an error with standard mode ", () => assert.equal(util.isError(beautifier.tagInformations("index1", { contract: "hchp", tic_mode: 1, threephases: false })), true));
        it("should return an error with unknown tag/column name", () => assert.equal(util.isError(beautifier.tagInformations("indexoooo", { contract: "hchp", tic_mode: 0, threephases: false })), true));
    });
});