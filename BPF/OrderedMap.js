// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

/// <reference path="ObjUtils.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="Iterator.js" />
"use strict";

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

bpf.utils.OrderedMap = function () {
    var _self = this;

    // map of keys into values
    var _map = {};

    // ordered keys
    var _orderedKeys = [];

    // add a key-value pair to the map and
    // push the key into orderedKeys array
    _self.add = function (key, obj) {
        _orderedKeys.push(key);
        _map[key] = obj;
    }

    _self.objByKey = function (key) {
        return _map[key];
    };

    _self.getIterator = function () {
        var iterator = new bpf.utils.Iterator(_orderedKeys);

        iterator.currentKey = function () {
            var currentKey = _orderedKeys[iterator.getCurrentIdx()];

            return currentKey;
        };

        // replace 'current' function to return the object from the 'map'
        iterator.current = function () {
            var currentKey = iterator.currentKey();

            return _self.objByKey(currentKey);
        };

        return iterator;
    }

    _self.getMapClone = function () {
        return bpf.utils.extendObj(_map);
    }
};

