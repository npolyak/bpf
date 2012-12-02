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

/// <reference path="jquery-1.8.2.js" />
$.fn.outerHTMLForSimpleJQObj = function () {
    var t = $(this);

    if ('outerHTML' in t[0]) {
        return t[0].outerHTML;
    } else {
        var content = t.wrap('<div></div>').parent().html();
        t.unwrap();
        return content;
    }
};

$.fn.outerHTML = function () {
    var t = $(this);

    var result = ""

    for (var i = 0; i < t.length; i++) {
        var currentPart = t[i];

        if (currentPart instanceof Text) {
            result += currentPart.data;
        }
        else {
            result += $(currentPart).outerHTMLForSimpleJQObj();
        }
    }

    return result;
};
