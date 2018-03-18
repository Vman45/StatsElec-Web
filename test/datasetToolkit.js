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

        it("should return 'true' if the dataset is created (createDataset function)", () => {
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
        it("should return the entry added into the dataset (insert on Dataset class)", () => {
            // Create temporary dataset
            datasetToolkit.createDataset("datasetClass-insert", (err, status) => {
                var ds = new datasetToolkit.Dataset("datasetClass-insert");

                ds.insert({
                    counter_id: "253269863251",
                    type: "Linky",
                    contract: "base",
                    triphasee: false,
                    created_date: Date.now()
                }, (errInsert, data) => {
                    if(errInsert != null) assert.fail();
                    else assert.ok(true); 

                    datasetToolkit.detroyDataset("datasetClass-insert", () => { });
                });
            });
        });

        it("should return the the complete dataset (getAllDataset on Dataset class)", () => {
            // Create temporary dataset
            datasetToolkit.createDataset("datasetClass-all", (err, status) => {
                var ds = new datasetToolkit.Dataset("datasetClass-all");
                var data = [
                    {
                        counter_id: "698321458524",
                        type: "Linky",
                        contract: "base",
                        triphasee: false,
                        created_date: Date.now()
                    },
                    {
                        counter_id: "698321458526",
                        type: "Electronique",
                        contract: "hchp",
                        triphasee: true,
                        created_date: Date.now()
                    },
                    {
                        counter_id: "698321458586",
                        type: "Electronique",
                        contract: "hchp",
                        triphasee: true,
                        created_date: Date.now()
                    }
                ];

                ds.insert(data, (errInsert, data) => {
                    if(errInsert != null) assert.fail();
                    else {
                        ds.getAllDataset((errFind, result) => {
                            if(errFind != null) assert.fail();
                            else assert.ok(true);
                        });

                        datasetToolkit.detroyDataset("datasetClass-all", () => { });
                    }
                });
            });
        });

        it("should return the entry finded into the dataset (find on Dataset class)", () => {
            // Create temporary dataset
            datasetToolkit.createDataset("datasetClass-find", (err, status) => {
                var ds = new datasetToolkit.Dataset("datasetClass-find");
                var data = [
                    {
                        counter_id: "698321458524",
                        type: "Linky",
                        contract: "base",
                        triphasee: false,
                        created_date: Date.now()
                    },
                    {
                        counter_id: "698321458524",
                        type: "Electronique",
                        contract: "hchp",
                        triphasee: true,
                        created_date: Date.now()
                    }
                ];

                ds.insert(data, (errInsert, data) => {
                    if(errInsert != null) assert.fail();
                    else {
                        ds.find("counter_id", "698321458524", (errFind, result) => {
                            if(errFind != null) assert.fail();
                            else assert.ok(true);
                        });

                        datasetToolkit.detroyDataset("datasetClass-find", () => { });
                    }
                });
            });
        });

        it("should return all entries finded into the dataset (findAll on Dataset class)", () => {
            // Create temporary dataset
            datasetToolkit.createDataset("datasetClass-findAll", (err, status) => {
                var ds = new datasetToolkit.Dataset("datasetClass-findAll");
                var data = [
                    {
                        counter_id: "698321458524",
                        type: "Linky",
                        contract: "base",
                        triphasee: false,
                        created_date: Date.now()
                    },
                    {
                        counter_id: "698321458526",
                        type: "Electronique",
                        contract: "hchp",
                        triphasee: true,
                        created_date: Date.now()
                    },
                    {
                        counter_id: "698321458524",
                        type: "Electronique",
                        contract: "hchp",
                        triphasee: true,
                        created_date: Date.now()
                    }
                ];

                ds.insert(data, (errInsert, data) => {
                    if(errInsert != null) assert.fail();
                    else {
                        ds.findAll("counter_id", "698321458524", (errFind, results) => {
                            console.log(results)
                            if(errFind != null) assert.fail();
                            else assert.ok(true);
                        });

                        datasetToolkit.detroyDataset("datasetClass-findAll", () => { });
                    }
                });
            });
        });
    });
})