var fs = require("fs");
var marked = require("marked");

var printHTML = require("../printHTML.js");
var pdfHTML = require("../pdfHTML.js");

module.exports.extension = "md";

module.exports.defaultText = function(name, cls) {
    // table header

    var slots = [config.name,
               config.getDate(),
               cls,
               name];

    // class name some times may be omitted
    if(!slots[2]) slots.splice(2, 1);

    var maxLen = [0].concat(slots).reduce(function(a, b) {
      return Math.max(a, b.length);
    }) + 2;

    defaultText =  "|" + (Array(maxLen).join(" ")) + "|" + "\n"
                + "-" + (Array(maxLen).join("-")) + "|" + "\n";

    slots.forEach(function(slot) {
      defaultText += " " + slot + (Array(maxLen - slot.length).join(" ")) + "|" + "\n";
    });

    return defaultText;
};

function compileMarkdown(file, callback, carg) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        data = marked(data.toString());

        fs.readFile("template.html", function(err, template) {
            if(err) throw err;
            
            var html = template.toString()
                      .replace("%%%CONTENTHERE%%%", data);
            
            callback(html, carg);
        });
    });
}

module.exports.print = function(file, pdf) {
    compileMarkdown(
        file,
        pdf ? pdfHTML : printHTML,
        pdf ? chopExtension(file) + ".pdf" : ""
    );
}
