#!/usr/bin/node

/*
 * hw.js
 *
 * A homework toolkit for hackers 
 * Copyright (C) 2015 Alyssa Rosenzweig

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Electronic Mail Address:
 * alyssa.a.rosenzweig@gmail.com
 *
 */

var fs = require("fs");
var http = require("http");
var argv = require("minimist")(process.argv.slice(2));

var command = argv._[0];
var config = require(__dirname + "/config.js");

var compileMarkdown = require("./compileMarkdown.js");
var printHTML = require("./printHTML.js");
var pdfHTML = require("./pdfHTML.js");

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
    print(argv._[argv._.length-1], argv.latest !== undefined, argv.pdf !== undefined);
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

function markdownDefault(name, cls) {
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
}

function getLastName() {
    var parts = config.name.split(" ");
    return parts[parts.length - 1];
}

function latexDefault(name, cls) {
    return "" +
        "\\documentclass[12pt]{article}\n" +
        "\\usepackage{hwmla}\n" +
        "\n" +
        "\\hwauthor{" + config.name + "}\n" +
        "\\hwdate{" + config.getDate() + "}\n" +
        "\\hwclass{" + cls + "}\n" +
        "\\hwproject{" + name + "}\n" +
        "\\hwlastname{" + getLastName() + "}\n" +
        "\\hwtitle{" + name + "}\n" +
        "\n" +
        "\\begin{document}\n" +
        "\\makeheader\n" +
        "\n" +
        "\\makeworkscited\n" +
        "\n" +
        "\\end{document}\n";
}

function uPresentDefault(name, cls) {
    return name + "\n" +
           "\n" +
           "theme: Modern Dark\n" +
           "\n";
}

function addFile(name, cls, format) {
    var filename = name.replace(/ /g, "_")
                 + (format == "markdown" ? ".md" :
                    format == "latex" ? ".tex" :
                    format == "uPresent" ? ".up" : "");
   
    var defaultText = format == "markdown" ? markdownDefault(name, cls) :
                      format == "latex" ? latexDefault(name, cls) :
                      format == "uPresent" ? uPresentDefault(name, cls) :
                      "";

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

function inferFormat(filename) {
    var parts = filename.split(".");
    var ext = parts[parts.length - 1];

    return (ext == "md" || ext == "markdown") ? "markdown" :
           (ext == "tex") ? "latex" :
           null;
}

function chopExtension(filename) {
    var parts = filename.split(".");
    return parts.slice(0, -1)[0];
}

function printLatex(file) {
    exec("latex " + file + " && dvipdf " + (chopExtension(file) + ".dvi"));
}

function print(file, latest, pdf) {
    if(latest) {
        // instead of using a filename, find the most recent homework assignment
        return getLatest(function(f) {
            console.log("Printing "+f);
            print(f, false, pdf);
        });
    }

    var format = inferFormat(file);
    
    if(format == "markdown") {
        compileMarkdown(
                file,
                pdf ? pdfHTML : printHTML,
                pdf ? chopExtension(file) + ".pdf" : ""
           );
    } else if(format == "latex") {
        printLatex(file);
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
        "   hw print [--pdf] [--latest] filename",
        "init - initializes the repositoru for hw tracking",
        "   hw init"
    ].forEach(function(a) { console.log(a) });
}
