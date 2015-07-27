module.exports.extension = "tex";

function getLastName() {
    var parts = config.name.split(" ");
    return parts[parts.length - 1];
}

module.exports.defaultValue = function(name, cls) {
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
