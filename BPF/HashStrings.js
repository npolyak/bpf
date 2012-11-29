// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

bpf.utils.segmentSeparationCharacter = '.';

// strips the leading '#' character.
bpf.utils.stripFirstPound = function (str) {
    if (!str)
        return str;

    if (str.charAt(0) === '#')
        return str.slice(1);

    return str;
};

bpf.utils.stripTrailingDot = function (str) {
    if (!str)
        return str;

    if (str.charAt(str.length - 1) === '#')
        return str.slice(str.length - 1);

    return str;
};

/// replaces blacks with dashes
bpf.utils.fillBlanks = function (str) {
    if (!str)
        return str;

    return str.replace(/\s+/g, "-");
};
