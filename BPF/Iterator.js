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

/// <reference path="ArrayExtensions.js" />
"use strict";

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

// creates an iterator to iterate through an array.
bpf.utils.Iterator = function (array) {
    var _self = this;
    var _currentIdx = 0;

    // returns current value
    _self.current = function () {
        return array[_currentIdx];
    };

    // checks if current position is valid
    _self.isCurrentValid = function () {
        if (!array)
            return false;

        if (!isObjectArray(array))
            return false;

        if (_currentIdx < array.length)
            return true;

        return false;
    };

    // moves to the next position
    _self.moveToNext = function () {
        _currentIdx++;
    };

    _self.getCurrentIdx = function () {
        return _currentIdx;
    }
};
