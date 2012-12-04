// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)
//
// short overview of copyright rules:
// 1. you can use this framework in any commercial or non-commercial 
//    product as long as you retain this copyright message
// 2. Do not blame the author(s) of this software if something goes wrong. 
// 
// Also as a courtesy, please, mention this software in any documentation for the 
// products that use it.

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

    if (str.charAt(str.length - 1) === '.')
        return str.slice(0, str.length - 1);

    return str;
};

/// replaces blacks with dashes
bpf.utils.fillBlanks = function (str) {
    if (!str)
        return str;

    return str.replace(/\s+/g, "-");
};
