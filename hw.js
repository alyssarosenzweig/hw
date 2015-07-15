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

var spawn = require("child_process").spawn;
var exec = require("child_process").exec;

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
        var editor = spawn("vim", [filename], {stdio: "inherit"}); // launch the only editor here
        
        editor.on("exit", function() {
            // now we need to commit to git
            // if desired
           
            if(!config.useGit) return;

            exec("git add " + filename + " && git commit -m \"" + name.replace(/"/g, "") + "\"");
        });
    });
}

function print(file) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        data = marked(data.toString());

        var html = fs.readFileSync("template.html").toString()
                    .replace("%%%CONTENTHERE%%%", data);

        // open a temporary web server
        http.createServer(function(req, res) {
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(html);

            process.exit(0);
        }).listen(8080);

        // open in the users web browser
        exec(config.browser+ " http://localhost:8080");
    });
};
