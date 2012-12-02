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

/// <reference path="../qunit.js" />
/// <reference path="ArrayExtensions.js" />
"use strict";

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

// since we should not extend object's prototype (see http://erik.eae.net/archives/2005/06/06/22.13.54/)
// we extend the object in a different way - by using objExtend function
// extend the object to have some utility methods, 
// especially those that are related to maps/dictionaries
bpf.utils.extendObj = function (obj) {
    // creates a shallow copy of an (not array) object
    var cloneObj = function (anObj) {
        var result = {};

        for (var key in anObj) {
            result[key] = anObj[key];
        }

        return result;
    };

    var cloneUnextendedOnly = function (anObj) {
        var result = {};

        for (var key in anObj) {
            var val = anObj[key];

            if (typeof (val) === 'function')
                continue;

            result[key] = val;
        }

        return result;
    };


    var _extendedObj = cloneObj(obj);

    _extendedObj.cloneObj = function () {
        return cloneObj(_extendedObj);
    };

    _extendedObj.unextendObj = function () {
        return cloneUnextendedOnly(_extendedObj);
    }

    _extendedObj.removeKey = function (key) {
        delete _extendedObj[key];
    };

    _extendedObj.containsKey = function (key) {
        return _extendedObj.hasOwnProperty(key);
    };

    _extendedObj.printKeys = function () {
        for (var key in _extendedObj) {
            console.log(key + " ");
        }
    };

    return _extendedObj;
};

//test("testRemoveKeys", function () {
//    var myObj = bpf.utils.objExtend({
//        key1: "val1",
//        key2: "val2"
//    });

//    equal(myObj.containsKey("key1"), true);
//    equal(myObj.containsKey("key3"), false);

//    myObj.removeKey("key1");

//    equal(myObj.containsKey("key1"), false);
//});
