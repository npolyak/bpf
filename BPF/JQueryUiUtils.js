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
/// <reference path="jquery-ui-1.9.0.js" />

$.ui.setSpinner = function (selectorString) {
    var spinnerElements = $(selectorString).spinner({
        min: 0,
        max: 1000
    });

    $(spinnerElements).spinner().bind("spinstop", function (event, data) {
        $(this).spinner().trigger("change");
    });
};
