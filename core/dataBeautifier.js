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
 * Give possible metrics tags with the contract type
 * @param {String} contract 
 * @param {Boolean} threephase 
 */
function contractMetricsTags(contract, threephase) {
    switch(contract.toLowerCase()) {
        case "base":
            var tags = [ "base" ];
            break;

        case "hchp":
            var tags = [ "hchc", "hchp" ];
            break;

        case "ejp": 
            var tags = [ "ejphn", "ejphpm" ];
            break;

        case "tempo":
            var tags = [ "bbrhcjb", "bbrhpjb", "bbrhcjw", "bbrhpjw", "bbrhcjr", "bbrhpjr" ];
            break;

        default: return `contrat inconnu (${contract})`;
    }

    if(threephase == true) tags.push("iinst1", "iinst2", "iinst3");
    else tags.push("iinst");

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
 * Return an object containing tag informations about the column name or the tag name
 * @param {String} tag tag or column name
 * @param {Object} [infos] counter informations (needed for column->tag)
 */
function tagInformations(tag, infos) {
    var tagsInfos = {
        tag: "",
        db_relation: "",
        description: "",
        unit: ""
    }

    
    if(tag.toLowerCase().includes("index")) {
        // Check if infos object contain all needed informations
        if(typeof infos.contract === "undefined" || typeof infos.tic_mode === "undefined" || typeof infos.threephases === "undefined") return new Error("Some informations are not available into 'infos' argument");

        // Check if the TIC_Mode is in Historical or in Standard mode
        if(infos.tic_mode == 1) return new Error("Standard mode is not supported for now.");
        else {
            var columnName = infos.contract.toLowerCase();
            
            // Get informations about column name
            switch(tag) {
                case "index1":
                    if(columnName == "base") tagsInfos.tag = "base";
                    else if(columnName == "hchp") tagsInfos.tag = "hchc";
                    else if(columnName == "ejp") tagsInfos.tag = "ejphn";
                    else if(columnName == "tempo") tagsInfos.tag = "bbrhcjb";
                    break;

                    case "index2":
                    if(columnName == "hchp") tagsInfos.tag = "hchp";
                    else if(columnName == "ejp") tagsInfos.tag = "ejphpm";
                    else if(columnName == "tempo") tagsInfos.tag = "bbrhpjb";
                    break;
                    
                case "index3":
                tagsInfos.tag = "bbrhcjw";
                break;

                case "index4":
                    tagsInfos.tag = "bbrhpjw";
                    break;
                
                    case "index5":
                    tagsInfos.tag = "bbrhcjr";
                    break;
                    
                    case "index6":
                    tagsInfos.tag = "bbrhpjr";
                    break;
                
                    default: return new Error("Column name not exists.");
            }
                
            tagsInfos.db_relation = tag.toLowerCase();
            tagsInfos.description = tagName(tagsInfos.tag);
            tagsInfos.unit = tagUnit(tagsInfos.tag);

            return tagsInfos;
        }
    } else {
        // Get informations about tag name
        switch(tag.toLowerCase()) {
            case "base":
            case "hchc":
            case "ejphn":
            case "bbrhcjb":            
                tagsInfos.db_relation = "index1"; break;

            case "hchp":
            case "ejphpm":
            case "bbrhpjb":
                tagsInfos.db_relation = "index2"; break;

            case "bbrhcjw":
                tagsInfos.db_relation = "index3"; break;

            case "bbrhpjw":
                tagsInfos.db_relation = "index4"; break;

            case "bbrhcjr":
                tagsInfos.db_relation = "index5"; break;
                
            case "bbrhpjr":
                tagsInfos.db_relation = "index6"; break;

            case "iinst":
            case "iinst1":
            case "iinst2":
            case "iinst3":
                if(typeof infos.threephases === "undefined" || infos.threephases == false) {
                    tagsInfos.tag = "iinst";
                    tagsInfos.db_relation = "iinst1";
                } else if(typeof infos.threephases !== "undefined" && infos.threephases == true && tag.toLowerCase() == "iinst") {
                    tagsInfos.tag = "iinst1";
                    tagsInfos.db_relation = "iinst1";
                } else tagsInfos.db_relation = tag.toLowerCase();

                break;

            default: return new Error("Tag unrecognized.");
        }

        tagsInfos.tag == "" ? tagsInfos.tag = tag.toLowerCase() : "";
        tagsInfos.description = tagName(tagsInfos.tag);
        tagsInfos.unit = tagUnit(tagsInfos.tag);

        return tagsInfos;
    }
}


module.exports = { threephasesToString, counterTypeToString, contractToString, contractMetricsTags, tagName, tagUnit, removeUselessColumns, tagInformations };