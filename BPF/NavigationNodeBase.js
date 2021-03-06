﻿// BPF JavaScript library version 0.9
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

/// <reference path="underscore.js" />
/// <reference path="../jquery-1.8.3.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />
/// <reference path="Iterator.js" />
/// <reference path="OrderedMap.js" />

/// base class for navigation node
var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.NodeBase = function (parentNode) {
    var _self = this;

    var _onSelectionChanged = new SimpleEvent();

    var _parentNode = parentNode;
    var _childNodes;

    _self.setParentNode = function (parentNode) {
        _parentNode = parentNode;
    }

    _self.getOnSelectionChangedEvent = function () {
        return _onSelectionChanged;
    }

    // fire selection changed and propagate to the
    // parent
    _self.fireSelectionChanged = function () {
        // propagate to the root of the tree
        if (_parentNode) {
            _parentNode.fireSelectionChanged();
        }
        else {
            // only fire onSelectionChanged on the root node
            // to change the whole url hash
            _onSelectionChanged.fire();
        }
    }

    // given a key and a childNode it adds the it to the 
    // child collection
    _self.addChildNode = function (key, childNode) {
        if (!_childNodes) {
            _childNodes = new bpf.utils.OrderedMap();
        }

        // pass _self as parent node
        childNode.setParentNode(_self);

        _childNodes.add(key, childNode);
    };


    // given a key and a data it adds the it to the 
    // child collection
    _self.addAdaptedChild = function (key, adaptedChildData) {
        var childNode = new bpf.nav.Node(adaptedChildData);

        _self.addChildNode(key, childNode);

        return childNode;
    };

    _self.addChild = function (key, data, adaptorFunction) {
        var adaptedChildData = adaptorFunction(data);

        return _self.addAdaptedChild(key, adaptedChildData);
    };

    // give a key, returns the child node corresponding to this key
    _self.getChild = function (key) {
        if (!key)
            return;

        if (!_childNodes)
            return;

        return _childNodes.objByKey(key);
    };

    // returns all child nodes
    _self.getChildren = function () {
        return _childNodes;
    };

    // returns the total hash based on the selected segments
    _self.getTotalHash = function () {
        var totalHash = '#' + _self.getUrlRecursive() + bpf.utils.segmentSeparationCharacter;

        return totalHash;
    }

    _self.setSelectedKeySegments = function (urlHash) {
        // remove the leading '#' and trailing '.'
        urlHash = bpf.utils.stripFirstPound(urlHash);
        urlHash = bpf.utils.stripTrailingDot(urlHash);

        _self.setSelectedKeySegmentsRecursive(urlHash);
    }
};

// sets window hash from the node's segments
bpf.nav.setTotalHash = function (topLevelNode) {
    window.location.hash = topLevelNode.getTotalHash();
};

// sets the selected segments based on the window hash
bpf.nav.setKeySegmentToHash = function (topLevelNode) {
    var totalHash = topLevelNode.getTotalHash();

    if (totalHash === window.location.hash)
        return false; // return false if hash did not change

    topLevelNode.setSelectedKeySegments(window.location.hash);
    bpf.nav.setTotalHash(topLevelNode);

    return true; // return true if hash changed
};

bpf.nav.connectToUrlHash = function (topLevelNode) {
    $(window).bind('hashchange', function (event) {
        bpf.nav.setKeySegmentToHash(topLevelNode);
    });

    topLevelNode.getOnSelectionChangedEvent().addSimpleEventHandler(function () {
        bpf.nav.setTotalHash(topLevelNode);
    });
};
