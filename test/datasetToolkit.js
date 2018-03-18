var assert = require("assert"),
    fs     = require("fs"),
    path   = require("path"),
    datasetToolkit = require("../core/datasetToolkit");


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
            fs.writeFileSync(path.resolve(__dirname + "/../datasets/unittest-dataset.json")); // Create temporary file
            assert.equal(datasetToolkit.datasetExists("unittest-dataset"), true);
            fs.unlinkSync(path.resolve(__dirname + "/../datasets/unittest-dataset.json")); // Remove the temporary file
        });

        it("should return instance of Dataset class after creating new dataset (createDataset function)", () => {
            datasetToolkit.createDataset("unittest-generation", (err, dataset) => {
                if(err != null) assert.fail();
                else assert.ok(true);
                
                fs.unlinkSync(__dirname + "/../datasets/unittest-generation.json"); // Remove the temporary file
            });
        });

        it("should return an error if a dataset already exists (createDataset function)", () => {
            fs.writeFileSync(path.resolve(__dirname + "/../datasets/unittest-generationerr.json")); // Create temporary file
            
            datasetToolkit.createDataset("unittest-generationerr", (err, dataset) => {
                if(err != null) assert.ok(true);
                else assert.fail();
                
                fs.unlinkSync(__dirname + "/../datasets/unittest-generationerr.json"); // Remove the temporary file
            });
        });

        it("should return 'true' after deleting dataset (detroyDataset function)", () => {
            fs.writeFileSync(path.resolve(__dirname + "/../datasets/unittest-delgen.json")); // Create temporary file
            
            datasetToolkit.detroyDataset("unittest-delgen", (err, status) => assert.equal(status, true));
        });

        it("should return an error if the dataset not exists (detroyDataset function)", () => {
            datasetToolkit.detroyDataset("unittest-delgenerr", (err, status) => assert.equal(status, false));
        });
    });

    
    describe("Class methods", () => {

    });
})