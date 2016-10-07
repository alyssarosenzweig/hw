module.exports = {
    name: "Alyssa Rosenzweig",
    getDate: function() {
        var d = new Date();
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
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
    }
}
