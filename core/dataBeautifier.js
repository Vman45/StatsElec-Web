function threephasesToString(value) {
    return value == true ? "triphasé" : "monophasé";
}


function counterTypeToString(value) {
    switch(value) {
        case 0: return "Electronique";
        case 1: return "Linky";
        case 99:
        default: return "Electronique ou Linky";
    }
}


function contractToString(value) {
    switch(value) {
        case "base": return "Tarification de base";
        case "hchp": return "Tarification heures creuses/heures pleines";
        case "ejp":  return "Tarification EJP";
        case "tempo": return "Tarification Tempo";
        default: return `inconnu (${value})`;
    }
}

function tagName(value) { }

function tagUnit(value) { }


export { threephasesToString, counterTypeToString, contractToString, tagName, tagUnit }