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

/// <reference path="underscore.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="StringExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />
/// <reference path="NavigationNodeBase.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.FactoryNode = function (data, parentNode, childNodeProducingFunction) {
    var _self = this;
    var _data = data;

    var _childNodeProducingFunction = childNodeProducingFunction;

    bpf.nav.Node.call(_self, data, parentNode); // extend the class bpf.nav.NodeBase

    _self.getOnSelectionChangedEvent().addSimpleEventHandler(function () {
        var selectedKey = _self.getSelectedKey();

        if (!selectedKey)
            return;

        addNodeIfNeeded(selectedKey);
    });

    var addNodeIfNeeded = function (key) {
        var children = _self.getChildren();
        if ((!children) || (!children.containsKey(key))) {
            if (childNodeProducingFunction) {
                var childNode = childNodeProducingFunction(key, _data);

                if (!childNode)
                    return;

                _self.addChildNode(key, childNode);
            }
        }
    }

    _self.select = function (key) {
        if (_self.getSelectedKey() === key)
            return;

        _self.data.select(key);

        addNodeIfNeeded(key);
    };
};