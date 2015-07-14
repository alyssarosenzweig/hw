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

if(!command) {
    console.log("Please provide a command to hw");
    process.exit(0);
}

if(command == "add") {
    addFile(argv._[argv._.length-1], argv.format || "markdown"); 
} else {
    console.log("Unsupported command " + command);
}

function addFile(name, format) {
    var filename = name.replace(/ /g, "_")
                 + (format == "markdown" ? ".md" : format == "latex" ? ".tex" : "");

    var defaultText = config.name + "\n" +
                      config.getDate() + "\n";

    // TODO: latex header as well

    fs.writeFile(filename, defaultText, function() {
        require("child_process").spawn("vim", [filename], {stdio: "inherit"}); // launch the only editor here
    });
}
