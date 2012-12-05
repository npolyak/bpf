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
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

// observable adaptor. it fires onSelectionChanged event
// when observable changes. 
// it also provides functions for turning key to object and vice versa
// and uses these functions for selecting.
bpf.nav.KoObservableNavAdaptor = function (observable, keyToObjectFn, objectToKeyFn) {
    var _self = this;

    var _selectedObject;

    var _keyToObjectFn = keyToObjectFn;
    var _objectToKeyFn = objectToKeyFn;

    // event fired when a tab changes
    _self.onSelectionChanged = new SimpleEvent();

    observable.subscribe(function (selectedObject) {
        if (_selectedObject === selectedObject)
            return;

        _selectedObject = selectedObject;

        fireSelectedHashChanged();
    });

    var fireSelectedHashChanged = function () {
        _self.onSelectionChanged.fire(_self, _self.selectedKey);
    };

    _self.getSelectedKey = function () {
        if (!_selectedObject)
            return;

        var resultSelectedKey = _objectToKeyFn(_selectedObject);

        return resultSelectedKey;
    };

    _self.getChildObjectByKey = function(key) {
        return _keyToObjectFn(key);
    };

    // select method
    _self.select = function (key) {
        _selectedObject = _keyToObjectFn(key);

        if (_selectedObject)
            observable(_selectedObject);
        else
            _self.unselect();
    };

    // do nothing
    _self.unselect = function () {

        _selectedObject = null;
        observable("");
    };
};
