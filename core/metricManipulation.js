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
        var electron, surgery
        
        electron.lpl  = str.split("\n");


        // SURGERY MODE ACTIVATED
        surgery = str.split("\n");

        surgery.forEach((el, it) => surgery[it] = el);

        // Check TIC Mode
        var ticMode = detectTICMode(surgery);

        if(ticMode == "standard") {
            return cb("Standard mode are not available. This telemetry can't be used.", null);
        } else if(ticMode == "historical") {

        } else cb("TIC mode not recognized. Please check if your counter is OK or call your energy provider for testing/replacing your counter.", null);


        console.log(surgery)
    } else if(typeof str === "object") {
        console.log(Object.keys);
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

/**
 * 
 * @param {*} type 
 */
function contractChanged(type) {
    
    return false;
}


module.exports = { 
    createElectron,
    verifyChecksum,
    detectTICMode,
    isThreePhases,
    contractChanged
};
