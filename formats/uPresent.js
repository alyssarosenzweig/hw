module.exports.extension = "up";

module.exports.defaultValue = function(name, cls) {
    return name + "\n" +
           "\n" +
           "theme: Modern Dark\n" +
           "\n";
}

module.exports.print = function(file, pdf) {
    // printing a uPresent file doesn't make a whole lot of sense,
    // but it might be useful at some point,
    // so it's supported, just for the sake of completeness
   
    compileUPresent(
        file,
        pdf ? pdfHTML : printHTML,
        pdf ? chopExtension(file) + ".pdf" : ""
    );
}
