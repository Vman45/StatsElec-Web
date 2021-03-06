var colors = require("colors");

/**
 * Generate useable object of received metric
 * @param {String|Object} str
 * @param {metricManipulation~createElectronCallback} cb Handle the response.
 * 
 * @callback metricManipulation~createElectronCallback
 * @param {String} err Return error message
 * @param {Object} metric Return a useable metric
 */
function createElectron(str, cb) {
    if(typeof str === "string") {
        /**
         * Electron variable is an object containing two another objects:
         *  - obj: containing the structured data for the entire software
         *  - lpl (line per line): split lines per lines but keeping the packet structure (tag, values, delimiters and the checksum)
         * 
         * Surgery variable is... for surgery purposes... She's dedicated to bloody actions so if you can stay away of this variable, is better for you!
        */
        var electron = {
            obj: { info: {}, data: {} },
            lpl: []
        };
        
        var surgery = [];
        
        electron.lpl = str.split("\n");
        electron.lpl.forEach(line => surgery.push(line.split(" ")));


        // SURGERY MODE ACTIVATED
        electron.lpl = surgery;
        surgery.forEach((el, it) => surgery[it] = el);


        // Get the address of the counter
        surgery.forEach(key => {
            if(key[0] == "ADCO") {
                electron.obj.info.id = key[1];
                electron.obj.data.counterId = key[1];
            }
        });

        electron.obj.info.type = 0; // The detection are available on next milestones


        // Check TIC Mode
        var ticMode = detectTICMode(surgery);

        if(ticMode == "standard") return cb("Standard mode are not available. This telemetry can't be used.", null);
        else if(ticMode == "historical") electron.obj.info.tic_mode = 0;
        else return cb("TIC mode not recognized. Please check if your counter is OK or call your energy provider for testing/replacing your counter.", null);


        // Detect contract type
        var contractType = detectContractType(surgery);

        if(contractType != null) electron.obj.info.contract = contractType;


        // Get contract power
        surgery.forEach(key => {
            if(key[0] == "ISOUSC") electron.obj.info.sub_power = key[1];
        });


        // Check if the install is in Threephases or in monophases
        if(isThreePhases(surgery) == true) electron.obj.info.threephases = true;
        else electron.obj.info.threephases = false;


        // Get instant intensity
        // surgery.forEach(key => {
        //     if(key[0] == /IINST(\d|)/) electron.obj.data[key[0].toLowerCase()] = key[1];
        // });


        // Get indexes
        if(contractType == "base") {
            surgery.forEach(key => {
                if(key[0] == "BASE") electron.obj.data.index1 = key[1];
            });
        } else if(contractType == "hchp") {
            surgery.forEach(key => {
                if(key[0] == "HCHC") electron.obj.data.index1 = key[1];
                else if(key[0] == "HCHP") electron.obj.data.index2 = key[1];
            });
        } else if(contractType == "ejp") {
            surgery.forEach(key => {
                if(key[0] == "EJPHN") electron.obj.data.index1 = key[1];
                else if(key[0] == "EJPPM") electron.obj.data.index2 = key[1];
                else if(key[0] == "PEJP") electron.obj.data.index3 = key[1];
            });
        } else if(contractType == "tempo") {
            surgery.forEach(key => {
                if(key[0] == "BBRHCJB") electron.obj.data.index1 = key[1];
                else if(key[0] == "BBRHPJB") electron.obj.data.index2 = key[1];
                else if(key[0] == "BBRHCJW") electron.obj.data.index3 = key[1];
                else if(key[0] == "BBRHPJW") electron.obj.data.index4 = key[1];
                else if(key[0] == "BBRHCJR") electron.obj.data.index5 = key[1];
                else if(key[0] == "BBRHPJR") electron.obj.data.index6 = key[1];
                //else if(key[0] == "DEMAIN") electron.obj.data.demain = key[1];
            });
        }

        return cb(null, electron.obj);
    } else if(typeof str === "object") {
        /**
         * This feature are planned for the 0.2.0
         */
        return cb(Error("JSON file is not supported for the moment."), null);
    }
}


/**
 * Check the checksum of the tag. THIS FUNCTION RETURN TRUE BECAUSE IS NOT ALREADY CODED! WILL BE AVAILABLE FOR NEXT VERSION!
 * @param {Object} metric LPL metric with the checksum
 * @returns {Boolean} Return true if the checksum correspond with the metric
 */
function verifyChecksum(metric) {
    /*
        Because I have some difficulties with the checksum calculation, this function is already created but return true.
        This choice is for making the complete mechanical of createElectron function.

        This function will be available for the next release or in this milestone (0.1.0)
    */

    return true;
}


/**
 * Detect if the TIC is in standard mode (new mode for Linky) or historical mode (for old counters and new Linky's with an old contract)
 * @param {Object} metric LPL metric or JSON provided by the probe 
 * @returns {String} can return "standard", "historical" and "unknown".
 */
function detectTICMode(metric) {
    var finded = false;

    // Internal functions for testing if the key is matching with some tags
    var isStandard = (key) => {
        switch(key) {
            case "VTIC":
            case String(key.match(/EASF\d{2}/)):
            case "STGE":
                return true;

            default: return false;
        }
    }

    var isHistorical = (key) => {
        switch(key) {
            case "BASE":
            case String(key.match(/HC\S{2}/)):
            case String(key.match(/EJP\S{2,3}/)):
            case String(key.match(/BBR\S{4}/)):
            case "PEJP":
            case "DEMAIN":
                return true;

            default: return false;
        }
    }


    // Check if the key numerical or if is a tag
    if(!isNaN(parseInt(Object.keys(metric)[0]))) {
        Object.keys(metric).forEach((line) => {
            if(isStandard(metric[line][0]) == true) finded = true;
        });

        if(finded == true) return "standard";
        else {
            Object.keys(metric).forEach((line) => {
                if(isHistorical(metric[line][0]) == true) finded = true;
            });

            if(finded == true) return "historical";
            else return "unknown";
        }
    } else {
        Object.keys(metric).forEach((line) => {
            if(isStandard(line) == true) finded = true;
        });

        if(finded == true) return "standard";
        else {
            Object.keys(metric).forEach((line) => {
                if(isHistorical(line) == true) finded = true;
            });

            if(finded == true) return "historical";
            else return "unknown";
        }
    }
}


/**
 * Detect the contract type
 * @param {Object} metric LPL metric or JSON provided by the probe 
 * @returns {String} can return "base", "hchp", "ejp" or "tempo"
 */
function detectContractType(metric) {
    var finded =  false;
    var result;

    // Internal functions for testing if the key is matching with some tags
    var detectContract = (key) => {
        switch(key) {
            case "BASE": return "base";
            case String(key.match(/HC\S+/)): return "hchp";
            case String(key.match(/EJP\S+/)): return "ejp";
            case String(key.match(/BBR\S+/)): return "tempo";
            
            default: return "unknown";
        }
    }
    
    
    // Check if the key numerical or if is a tag
    if(!isNaN(parseInt(Object.keys(metric)[0]))) {
        Object.keys(metric).forEach((line) => {
            if(finded != true) {
                result = detectContract(metric[line][0]);
                if(result != "unknown" && finded != true) finded = true;
            }
        });

        if(finded) return result;
        else return "unknown";
    } else {
        Object.keys(metric).forEach((line) => {
            if(finded != true) {
                result = detectContract(line);
                if(result != "unknown" && finded != true) finded = true;
            }
        });

        if(finded) return result;
        else return "unknown";
    }
}

/**
 * Detect if the installation is single-phase or three-phase
 * @param {Object} metric LPL metric or JSON provided by the probe  
 * @returns {Boolean} Return a boolean if the installation is in three-phase
 */
function isThreePhases(metric) {
    var threePhased = false;

    // Internal function for testing if the key is matching with some tags
    var isThreePhase = (key) => {
        switch(key) {
            case String(key.match(/IINST\d/)):
            case String(key.match(/IMAX\d/)):
                return true;

            default: return false;
        }
    }

    // Check if the key numerical or if is a tag
    if(!isNaN(parseInt(Object.keys(metric)[0]))) {
        Object.keys(metric).forEach((line) => {
            if(isThreePhase(metric[line][0]) == true) threePhased = true;
        });
    } else {
        Object.keys(metric).forEach((line) => {
            if(isThreePhase(line) == true) threePhased = true;
        });
    }

    if(threePhased == true) return true;
    else return false;
}

module.exports = { 
    createElectron,
    verifyChecksum,
    detectTICMode,
    detectContractType,
    isThreePhases
};
