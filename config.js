module.exports = {
    name: "Alyssa Rosenzweig",

    getDate: function() {
        return (new Date()).toISOString().slice(4 + 1 + 2 + 1 + 2);
    },

    browser: "firefox",
    editor: "vim",
    phantomjs: "/usr/local/bin/phantomjs",
    useGit: true,
    defaultFormat: "markdown",
    noteFormat: "markdown",

    getFileDirectory: function(filename, name, cls, format) {
        // put directory creation code here...
        return filename;
    },

    publishCommand: function(files) {
        return "scp " + files.join(" ") 
                      + "alyssa@rosenzweig.io:/var/www/html/homework/";
    }
}
