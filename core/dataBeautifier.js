var _ = require("lodash");

/**
 * Return a string if the installation is monophase or threephase
 * @param {String} value
 * @return {String} "monophasé" or "triphasé"
 */
function threephasesToString(value) {
    return value == true ? "triphasé" : "monophasé";
}


/**
 * Return the name of the counter
 * @param {Integer} value
 * @return {String} "Electronique", "Linky" or "Electronique ou Linky" (the last is if the counter is not recognized)
 */
function counterTypeToString(value) {
    switch(value) {
        case 0: return "Electronique";
        case 1: return "Linky";
        case 99: return "Electronique ou Linky";
        default: return "Inconnu";
    }
}


/**
 * Return a string with the complete name of the contract
 * @param {String} value
 */
function contractToString(value) {
    switch(value.toLowerCase()) {
        case "base": return "Tarification de base";
        case "hchp": return "Tarification heures creuses/heures pleines";
        case "ejp":  return "Tarification EJP";
        case "tempo": return "Tarification Tempo";
        default: return `inconnu (${value})`;
    }
}

/**
 * Give possible metrics tags and the link with the database column
 * @param {String} contract 
 * @param {Boolean} threephase 
 */
function contractMetricsTags(contract, threephase) {
    switch(contract.toLowerCase()) {
        case "base":
            var tags = [{ tag: "base", db: "index1" }];
            break;

        case "hchp":
            var tags = [
                { tag: "hchc", db: "index1" },
                { tag: "hchp", db: "index2" }
            ];
            break;

        case "ejp": 
            var tags = [
                { tag: "ejphn",  db: "index1" },
                { tag: "ejphpm", db: "index2" }
            ];
            break;

        case "tempo":
            var tags = [
                { tag: "bbrhcjb", db: "index1" },
                { tag: "bbrhpjb", db: "index2" },
                { tag: "bbrhcjw", db: "index3" },
                { tag: "bbrhpjw", db: "index4" },
                { tag: "bbrhcjr", db: "index5" },
                { tag: "bbrhpjr", db: "index6" }
            ];
            break;

        default: return `contrat inconnu (${contract})`;
    }

    if(threephase == true) tags.push({ tag: "iinst1", db: "iinst1" }, { tag: "iinst2", db: "iinst2" }, { tag: "iinst3", db: "iinst3" });
    else tags.push({ tag: "iinst", db: "iinst1" });

    return tags;
}

/**
 * Return the real name of a tag
 * @param {String} tag 
 */
function tagName(tag) {
    switch(tag.toUpperCase()) {
        case "ADCO": return "Adresse du compteur";
        case "OPTARIF": return "Option tarifaire";
        case "ISOUSC": return "Intensité souscrite";
        case "BASE": return "Index option Base";
        case "HCHC": return "Index heures creuses";
        case "HCHP": return "Index heures pleines";
        case "EJPHN": return "Index EJP heures normales";
        case "EJPHPM": return "Index EJP heures mobiles";
        case "BBRHCJB": return "Index Bleu heures creuses";
        case "BBRHPJB": return "Index Bleu heures pleines";
        case "BBRHCJW": return "Index Blanc heures creuses";
        case "BBRHPJW": return "Index Blanc heures pleines";
        case "BBRHCJR": return "Index Rouge heures creuses";
        case "BBRHPJR": return "Index Rouge heures pleines";
        case "PEJP": return "Préavis du début EJP";
        case "PTEC": return "Période tarifaire en cours";
        case "DEMAIN": return "Couleur du lendemain";
        case "IINST": return "Intensité instantanée";
        case "IINST1": return "Intensité instantanée phase 1";
        case "IINST2": return "Intensité instantanée phase 2";
        case "IINST3": return "Intensité instantanée phase 3";
        case "ADPS": return "Avertissement de dépassement de puissance souscrite";
        case "PMAX": return "Puissance maximale";
        case "IMAX": return "Intensité maximale";
        case "IMAX1": return "Intensité maximale phase 1";
        case "IMAX2": return "Intensité maximale phase 2";
        case "IMAX3": return "Intensité maximale phase 3";
        case "PAPP": return "Puissance apparente";
        case "HHPHC": return "Horaire heures plaines heures creuses";
        case "PPOT": return "Présence des potentiels";
        default: return null;
    }
}


/**
 * Return the unit associated to the tag
 * @param {String} tag 
 */
function tagUnit(tag) {
    switch(tag.toUpperCase()) {
        case "BASE":
        case "HCHC":
        case "HCHP":
        case "EJPHN":
        case "EJPHPM":
        case "BBRHCJB":
        case "BBRHPJB":
        case "BBRHCJW":
        case "BBRHPJW":
        case "BBRHCJR":
        case "BBRHPJR":
            return "Wh";
        
        case "ISOUSC":
        case "IINST":
        case "IINST1":
        case "IINST2":
        case "IINST3":
        case "ADPS":
        case "IMAX":
        case "IMAX1":
        case "IMAX2":
        case "IMAX3":
            return "A";
            
        case "PEJP": return "min";
        case "PMAX": return "W";
        case "PAPP": return "VA";
        
        case "ADCO":
        case "OPTARIF":
        case "PTEC":
        case "DEMAIN":
        case "HHPHC":
        case "PPOT":
        default:
            return null;
    }
}


/**
 * Return clean metrics object without useless columns
 * @param {Object} counterInfo 
 * @param {Object} metrics 
 */
function removeUselessColumns(counterInfo, metrics) {
    var omitTagsList = [];

    try {
            if(typeof counterInfo.tic_mode === "undefined") throw "No tic_mode information";
            else if(counterInfo.tic_mode == 0) {
                // Add useless phases tags into omitTagsList if the installation is in monophase
                if(typeof counterInfo.threephases == "undefined") throw "Threephases information not available";
                else if(counterInfo.threephases == false) omitTagsList.push("iinst2", "iinst3");
        
                // Add useless index columns into omitTagsList not in relation with the subscribed contract
                if(typeof counterInfo.contract === "undefined") throw "No contract information";
                else if(counterInfo.contract.toLowerCase() == "base") omitTagsList.push("index2", "index3", "index4", "index5", "index6");
                else if(counterInfo.contract.toLowerCase() == "hchp" || counterInfo.contract.toLowerCase() == "ejp") omitTagsList.push("index3", "index4", "index5", "index6");
        
                // Retrieve metrics object without useless columns
                if(typeof metrics.length === "undefined") return _.omit(metrics, omitTagsList);
                else {
                    purgedMetrics = [];
    
                    metrics.forEach(el =>purgedMetrics.push(_.omit(el, omitTagsList)));
                    return purgedMetrics;
                }
            } else return new Error("Standard mode is not supported for now.");
    } catch(e) { return new Error("Unable to remove useless columns. Trace: ", e); }
}


/**
 * Return the tag/column relation with the database
 * @param {String} tag 
 */
function tagRelation(tag) {

}

/**
 * Return an object containing tag informations about the column name or the tag name
 * @param {String} tag tag or column name
 */
function tagInformations(tag) {
    if(tag.toLowerCase().includes("index") || tag.toLowerCase().includes("iinst")) {
        // Get informations about column name

        return {
            tag: "",
            db_relation: tag.toLowerCase(),
            description: tagName(tag),
            unit: tagUnit(tag)
        }
    } else {
        // Get informations about tag name

        return {
            tag: tag.toLowerCase(),
            db_relation: "",
            description: tagName(tag),
            unit: tagUnit(tag)
        }
    }


    
}


module.exports = { threephasesToString, counterTypeToString, contractToString, contractMetricsTags, tagName, tagUnit, removeUselessColumns, tagRelation, tagInformations };