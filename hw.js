#!/usr/bin/node

/*
 * hw.js
 * my homework toolkit,
 * written by Alyssa Rosenzweig
 * Licensed under GPLv2
 */

var fs = require("fs");
var http = require("http");
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

        data = data.toString().replace(/\-\>.+?(?=\-\>)\-\>/g, 
                function(_, a) {
                    return "<span class='md-right-align'>" + _.slice("-> ".length, -(" ->".length)) + "</span>";
                });

        data = marked(data);

        var html = fs.readFileSync("template.html").toString()
                    .replace("%%%CONTENTHERE%%%", data);

        // open a temporary web server
        http.createServer(function(req, res) {
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(html);

            process.exit(0);
        }).listen(8080);

        // open in the users web browser
        require("child_process").exec(config.browser+ " http://localhost:8080");
    });
};
