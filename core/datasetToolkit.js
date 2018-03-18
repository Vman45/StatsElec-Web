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
                    data: {}
                }, null, 4);

                // Create the manifest
                fs.writeFile(__dirname + `/../datasets/${name}.json`, datasetArchitecture, (err) => {
                    if(err) cb(err, null);
                    else cb(null, new Dataset(name));
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
     * 
     * @param {*} name 
     */
    constructor(name) {
        this.datasetName = name;

    }


    insert(entry, cb) { }

    find(entry, cb) { }

    findAll(cb) { }

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