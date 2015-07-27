module.exports.extension = "md";

module.exports.defaultText = function(name, cls) {
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
};
