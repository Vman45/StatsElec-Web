var assert = require("assert"),
    fs     = require("fs"),
    datasetToolkit = require("../core/datasetToolkit").tests;


describe("Test dataset methods", () => {
    describe("General methods", () => {
        it("should be create the dataset folder (createDatasetFolder function)", () => {
            datasetToolkit.createDatasetFolder((err, result) => {
                if(err != null) assert.fail();

                if(result) assert.ok(true);
                else assert.fail();
            });
        });

        it("should return 'false' when is checking if a dataset exists (datasetExists function)", () => assert.equal(datasetToolkit.datasetExists("unknownDatasetFile"), false));
        
        it("should return 'true' when is checking if a dataset exists (datasetExists function)", () => {
            fs.writeFileSync(__dirname + "/../datasets/unittest-dataset.json"); // Create temporary file
            assert.equal(datasetToolkit.datasetExists("unittest-dataset"), true);
            fs.unlinkSync(__dirname + "/../datasets/unittest-dataset.json"); // Remove the temporary file
        });
    });

    describe("Class methods", () => {

    });
})