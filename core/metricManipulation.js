/**
 * readMetric
 * @param {String|Object} str 
 */
var readMetric = (str, cb) => {
    console.log("received:", str)
    console.log("type: ", typeof str);

    if(typeof str === "string") {
        var surgery = str.split("\n");

        surgery.forEach((line, it) => {
            surgery[it] = line.split(" ");
        })

        console.log(surgery)
    } else if(typeof str === "object") {
        console.log(Object.keys);
    }

}

module.exports = { readMetric };