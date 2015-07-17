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
var config = require(__dirname + "/config.js");
var marked = require("marked");

var spawn = require("child_process").spawn;
var exec = require("child_process").exec;

if(!command) {
    usage();
    process.exit(0);
}

if(command == "add") {
    addFile(argv._[argv._.length-1], argv["class"] || argv.c || "Class 8", argv.format || "markdown"); 
} else if(command == "note") {
    // note is a shorthand for adding a new file,
    // but is specifically for small assignments that need to *just work*
    // they're not meant to be printed or anything,
    // and are generally for using your computer as a 'dumb termina'
    
    addFile("Notes on " + argv._[argv._.length-1], argv["class"] || argv.c || "", "markdown");   
} else if(command == "print") {
    print(argv._[argv._.length-1], argv.latest !== undefined);
} else if(command == "init") {
    init();
} else {
    usage();
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
   
    var defaultText = "";

   if(format == "markdown") {
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
   }

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

function compileMarkdown(file, callback) {
    fs.readFile(file, function(err, data) {
        if(err) throw err;

        data = marked(data.toString());

        fs.readFile("template.html", function(err, data) {
            if(err) throw err;
            
            var html = data.toString()
                      .replace("%%%CONTENTHERE%%%", data);
            
            callback(html);
        });

    });
}

function inferFormat(filename) {
    var parts = filename.split(".");
    var ext = parts[parts.length - 1];

    return (ext == "md" || ext == "markdown") ? "markdown" :
           (ext == "tex") ? "latex" :
           null;
}

function print(file, latest) {
    if(latest) {
        // instead of using a filename, find the most recent homework assignment
        return getLatest(function(f) {
            console.log("Printing "+f);
            print(f);
        });
    }

    var format = inferFormat(file);
    
    if(format == "markdown") {
        compileMarkdown(file, function(html) {
            // open a temporary web server
            http.createServer(function(req, res) {
                res.writeHead(200, {"Content-Type":"text/html"});
                res.end(html);

                process.exit(0);
            }).listen(8080);

            // open in the users web browser
            exec(config.browser+ " http://localhost:8080");
        });
    } else {
        console.error("Cannot print format "+format);
    }
}


function usage() {
    [
        "usage: hw command [options]",
        "",
        "list of commands:",
        "add - creates a new file in the repository",
        "   hw add [--class=classname] [--format=markdown] Assignment_Title",
        "note - quick notetaking command",
        "   hw note [--class=classname] Subject",
        "print - prints an assignment. If --latest is used, filename is ignored.",
        "   hw print [--latest] filename",
        "init - initializes the repositoru for hw tracking",
        "   hw init"
    ].forEach(function(a) { console.log(a) });
}
