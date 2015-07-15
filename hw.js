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
    print(argv._[argv._.length-1], argv.latest !== undefined);
} else if(command == "init") {
    init();
} else {
    console.log("Unsupported command " + command);
}

function init() {
    // initialize git and the status file
    exec("git init . && echo '{}' > status.json && mkdir node_modules");

    // copy the template file and my config file
    
    fs.readFile(__dirname + "/template.html", function(err, data) {
        if(err) throw err;
        fs.writeFile("template.html", data);
    });
    
    fs.readFile(__dirname + "/config.js", function(err, data) {
        if(err) throw err;
        fs.writeFile("node_modules/config.js", data);
    });
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
            // we should update the status file
            
            fs.readFile("./status.json", function(err, data) {
                if(err) throw err;
                var status = JSON.parse(data);
                
                status.latestHW = filename;

                fs.writeFile("./status.json", JSON.stringify(status));
            });

            // now we need to commit to git
            // if desired
           
            if(!config.useGit) return;

            exec("git add " + filename + " && git commit -m \"" + name.replace(/"/g, "") + "\"");
        });
    });
}

function getLatest(callback) {
    fs.readFile("./status.json", function(err, data) {
        if(err) throw err;

        callback(JSON.parse(data).latestHW);
    });
}

function print(file, latest) {
    if(latest) {
        // instead of using a filename, find the most recent homework assignment
        return getLatest(function(f) {
            console.log("Printing "+f);
            print(f);
        });
    }

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
