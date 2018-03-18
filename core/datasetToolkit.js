var fs     = require("fs"),
    colors = require("colors");


/** 
 * This method create the datasets folder if not exists.
 * @returns {Boolean|Error} Return true if all is OK or an 'Error' object if the folder can't be created.
*/
function createDatasetFolder(cb) {
    fs.exists(__dirname + "/../datasets", (exists) => {
        if(exists == false) {
            fs.mkdir(__dirname + "/../datasets", (err) => {
                if(err != null) cb(Error("Unable to create the folder. Please check if you have sufficient permissions for this action.", err), false);
                else cb(null, true);
            });
        } else cb(null, true);
    });
}


/**
 * Check if the specified dataset exists
 * @param {String} name The name of the dataset
 * @returns {Boolean}
 */
function datasetExists(name) {
    return fs.existsSync(__dirname + `/../datasets/${name}.json`);
}


/**
 * Create the dataset if exists and return an instance of Dataset class
 * @param {String} name The name of the dataset
 * @param {Function} cb Return an error message or an instanced Dataset class
 */
function createDataset(name, cb) {
    // Create the folder if not exists
    createDatasetFolder((err, result) => {
        if(err) cb(err, null);
        else {
            if(datasetExists(name) == true) cb(Error("The dataset already exists."), null);
            else {
                // Create the architecture of the file
                var datasetArchitecture = JSON.stringify({
                    manifest: {
                        _version: 1,
                        _name: name
                    },
                    data: []
                }, null, 4);

                // Create the manifest
                fs.writeFile(__dirname + `/../datasets/${name}.json`, datasetArchitecture, (err) => {
                    if(err) cb(err, false);
                    else cb(null, true);
                });
            }
        }
    }); 
}


/**
 * Delete the dataset if exists
 * @param {String} name The name of the dataset
 * @param {Function} cb Return an error message or a boolean
 */
function detroyDataset(name, cb) {
    if(datasetExists(name)) {
        fs.unlink(__dirname + `/../datasets/${name}.json`, (err) => {
            if(err) cb(err, false);
            else cb(null, true);
        });
    } else cb(Error("The dataset not exists."), false);
}


class Dataset {
    /**
     * Instantiate a dataset for manipuling easily.
     * @param {String} name 
     */
    constructor(name) {
        this.datasetName = name;

        // Check if the dataset exists
        if(datasetExists(this.datasetName)) {
            // Check if the dataset is OK
            var dataset = JSON.parse(fs.readFileSync(__dirname + `/../datasets/${this.datasetName}.json`));

            if(dataset.manifest._version <= 0 && dataset.manifest._version > 1) return Error("The version of the specified dataset is uncompatible with this version of StatsElec. Please check the documentation for migrating your dataset to a compatible version.");
            else if(dataset.manifest._name != name) return Error("The name of the dataset is different of the filename.");
        } else return Error("The specified dataset not exists. Please create it before.");
    }


    /**
     * 
     * @param {*} cb 
     */
    getAllDataset(cb) {
        try {
            var dataset = JSON.parse(fs.readFileSync(__dirname + `/../datasets/${this.datasetName}.json`));

            cb(null, dataset.data);
        } catch(err) { cb(err, null); }
    }

    /**
     * 
     * @param {*} entry 
     * @param {*} cb 
     */
    insert(entry, cb) {
        var dataset = JSON.parse(fs.readFileSync(__dirname + `/../datasets/${this.datasetName}.json`));
        

        // Insert entry/entries into the memory dataset
        if(entry.length === undefined) dataset.data.push(entry);
        else {
            for(var i = 0; i < entry.length; i++) dataset.data.push(entry[i])
        }


        // Insert the new dataset into the file
        fs.writeFile(__dirname + `/../datasets/${this.datasetName}.json`, JSON.stringify(dataset, null, 4), (err) => {
            if(err != null) cb(err, null);
            else cb(null, entry);
        });
    }


    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} cb 
     */
    find(key, value, cb) {
        var dataset = JSON.parse(fs.readFileSync(__dirname + `/../datasets/${this.datasetName}.json`));
        var finded = false;

        for(var i = 0; finded != true && i < dataset.data.length; i++) {
            Object.keys(dataset.data[i]).forEach((objKey) => {
                if(objKey == key) {
                    if(dataset.data[i][key] == value) {
                        finded = true;
                        cb(null, dataset.data[i]);
                    }
                }
            });
        }
    }


    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} cb 
     */
    findAll(key, value, cb) {
        var dataset = JSON.parse(fs.readFileSync(__dirname + `/../datasets/${this.datasetName}.json`));
        var findedResults = [];

        for(var i = 0; i < dataset.data.length; i++) {
            Object.keys(dataset.data[i]).forEach((objKey) => {
                if(objKey == key) {
                    if(dataset.data[i][key] == value) {
                        findedResults.push(dataset.data[i]);
                    }
                }
            });
        }

        cb(null, findedResults);
    }



    findAndUpdate(entry, data, cb) { }



    findAndRemove(entry, cb) { }
}


module.exports = {
    createDatasetFolder,
    datasetExists,
    createDataset,
    detroyDataset,
    Dataset
}

module.exports.Dataset = Dataset;