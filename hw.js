#!/usr/bin/node

/*
 * hw.js
 * my homework toolkit,
 * written by Alyssa Rosenzweig
 * Licensed under GPLv2
 */

var fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));

var command = argv._[0];
var config = require("./config.js");
var marked = require("marked");

if(!command) {
    console.log("Please provide a command to hw");
    process.exit(0);
}

if(command == "add") {
    addFile(argv._[argv._.length-1], argv["class"] || "Class 8", argv.format || "markdown"); 
} else if(command == "print") {
    print(argv._[argv._.length-1]);
} else {
    console.log("Unsupported command " + command);
}

function addFile(name, cls, format) {
    var filename = name.replace(/ /g, "_")
                 + (format == "markdown" ? ".md" : format == "latex" ? ".tex" : "");

    var defaultText = config.name + "\n\n" +
                      config.getDate() + "\n\n" +
                      cls + "\n\n" +
                      name + "\n\n" + "\n";

    // TODO: latex header as well

    fs.writeFile(filename, defaultText, function() {
        require("child_process").spawn("vim", [filename], {stdio: "inherit"}); // launch the only editor here
    });
}

function print(file) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        // pass filter
        data = data.toString().replace(/\-\>.+?(?=\-\>)\-\>/g, "<span class='md-right-align'>\\$1</span>");

        var html = marked(data);
        console.log(html);
    });
};
