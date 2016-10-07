#!/usr/bin/env node

/*
 * hw.js
 *
 * A homework toolkit for hackers 
 * Copyright (C) 2015 Alyssa Rosenzweig

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
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
 * alyssa@rosenzweig.io
 *
 */

var fs = require("fs");
var http = require("http");
var argv = require("minimist")(process.argv.slice(2), { boolean: true });

var exec = require("child_process").exec;
var spawn = require("child_process").spawn;

var formats = require("./formats/index.js");
var config = require("./current-config.js")();

main();

function main() {
    var command = argv._[0],
        files   = argv._.slice(1);
    
    if(!command) {
        usage();
        process.exit(0);
    }

    if(files.length > 0) {
        /* process files serially */
        console.log(argv._);
        files.forEach(function(file) {
            singleFile(file, command);
        });
    } else {
        if(command == "init") {
            init();
        } else {
            usage();
        }
    }
}

function singleFile(file, command) {
    if(command == "add") {
        addFile(file, argv["class"] || argv.c || "Class 8", argv.format || config.defaultFormat || "markdown"); 
    } else if(command == "note") {
        // note is a shorthand for adding a new file,
        // but is specifically for small assignments that need to *just work*
        // they're not meant to be printed or anything,
        // and are generally for using your computer as a 'dumb terminal' in class
        
        addFile("Notes on " + file, argv["class"] || argv.c || "", argv.format || config.noteFormat || "markdown");
    } else if(command == "print") {
        print(file, argv.latest !== undefined, argv.pdf !== undefined);
    } else if(command == "publish") {
        publish(file, argv.latest !== undefined);
    } else {
        usage();
    }
}

function init() {
    // initialize git and the status file
    exec("git init . && echo '{}' > status.json");

    // copy the template file and my config file
    
    fs.readFile(__dirname + "/template.html", function(err, data) {
        if(err) throw err;
        fs.writeFile("template.html", data);
    });
    
    fs.readFile(__dirname + "/config.js", function(err, data) {
        if(err) throw err;
        fs.writeFile("config.js", data);
    });

    // setup the global pointer to this hw instance
    // this lets the user use hw from any directory,
    // abstracting away the ugly cd's
    
    fs.writeFile(process.env["HOME"] + "/.hw_default", process.cwd());
}

function getDescriptor(format) {
    var formatDescriptor = require("./formats/"+format); // NOTE: this is not a secure call,
                                                        // nor is it intended to be
                                                        // hw expects its input to be trusted
    
    if(!formatDescriptor) {
        throw new Error();
    }

    return formatDescriptor;    
}

function addFile(name, cls, format) {
    var formatDescriptor = getDescriptor(format); 
    
    var filename = name.replace(/ /g, "_")
                 + "." + formatDescriptor.extension;

    // call configuration function for location
    filename =  (
            config.getFileDirectory &&
            config.getFileDirectory(filename, name, cls, format)
    ) || filename;
   
    var defaultText = formatDescriptor.defaultText(name, cls);

    fs.writeFile(filename, defaultText, function() {
        // spawn an editor of the user's choice (hopefully vim :-) )
        // however, if the file format requires a particular editor,
        // that is launched instead.

        var editor = spawn(
                formatDescriptor.overrideEditor || config.editor || "vim",
                [filename],
                {stdio: "inherit"}
            );

        editor.on("exit", function() {
            // we should update the status file
            
            fs.readFile(process.cwd()+"/status.json", function(err, data) {
                if(err) throw err;
                var status = JSON.parse(data);
                
                status.latestHW = filename;

                fs.writeFile(process.cwd()+"/status.json", JSON.stringify(status));
            })

            // now we need to commit to git
            // if desired
           
            if(!config.useGit) return;

            exec("git add " + filename + " && git commit -m \"" + name.replace(/"/g, "") + "\"");
        });
    });
}

function getLatest(callback) {
    fs.readFile(process.cwd()+"/status.json", function(err, data) {
        if(err) throw err;

        callback(JSON.parse(data).latestHW);
    });
}

function inferFormat(filename) {
    var parts = filename.split(".");
    var ext = parts[parts.length - 1];

    return formats[ext];
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
    getDescriptor(format).print(file, pdf);
}

function publish(file, latest) {
    /* TODO: DRY */

    if(latest) {
        return getLatest(function(f) {
            publish(f, false);
        });
    }
    
    /* print to pdf, the default publishable format.
     * TODO: determine how to infer correct publish format.
     * e.g.: markdown files can be published to HTML
     */

    var format = inferFormat(file);
    getDescriptor(format).print(file, true);

    /* the config file specifies how to publish a document as a shell cmd */
    var pdf = file.split(".").slice(0, -1).join(".") + ".pdf";
    var cmd = config.publish([pdf]);

    exec(cmd, function(err, stdout) {
        console.log(stdout);
    });
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
        "publish - publishes an assignment subject to config file",
        "   hw publish [--latest] filename",
        "init - initializes a repository for hw tracking",
        "   hw init"
    ].forEach(function(a) { console.log(a) });
}
