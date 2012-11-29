// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

/// <reference path="jquery-1.8.2.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.KoObservableNavAdaptor = function (observable, keyToObjectFn, objectToKeyFn) {
    var self = this;

    var _shouldFireSelectionChanged = true;

    var _selectedObject;

    var _keyToObjectFn = keyToObjectFn;
    var _objectToKeyFn = objectToKeyFn;

    // event fired when a tab changes
    self.onSelectionChanged = new SimpleEvent();

    observable.subscribe(function (selectedObject) {
        if (_selectedObject === selectedObject)
            return;

        _selectedObject = selectedObject;

        fireSelectedHashChanged();
    });

    var fireSelectedHashChanged = function () {
        self.onSelectionChanged.fire(self, self.selectedKey);
    };

    self.getSelectedKey = function () {
        if (!_selectedObject)
            return;

        var resultSelectedKey = _objectToKeyFn(_selectedObject);

        return resultSelectedKey;
    };

    // select method
    self.select = function (key) {
        _shouldFireSelectionChanged = false;

        _selectedObject = _keyToObjectFn(key);

        if (_selectedObject)
            observable(_selectedObject);
        else
            self.unselect();
    };

    // do nothing
    self.unselect = function () {

        _selectedObject = null;
        observable("");
    };
};
