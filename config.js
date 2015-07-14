module.exports = {
    name: "Alyssa Rosenzweig",
    getDate: function() {
        var d = new Date();
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    },
}
