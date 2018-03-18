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


function CreateDataset(name) {
    try {
        createDatasetFolder(); // Create the folder if not exists

        

    } catch(e) {
        return Error()
    }
}



class Dataset {
    /**
     * 
     * @param {*} name 
     */
    constructor(name) {
        this.datasetName = name;

        fs.exists("../datasets", (exists) => {
            if(exists == false) {
                fs.mkdir("../datasets");
            }
        });

        fs.exists(`../datasets/${name}.json`, (exists) => {
            if(exists == false) {
                
            }
        });
    }




    /**
     * 
     * @param {*} entry 
     */
    find(entry, cb) {
        fs.readFile("../")
    }


    findAll(cb) {

    }
}

module.exports = {
    CreateDataset,
    Dataset
}


module.exports.tests = {
    createDatasetFolder,
    datasetExists,
    CreateDataset
}