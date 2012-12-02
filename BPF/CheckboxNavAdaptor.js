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

/// <reference path="../jquery-1.8.2.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.CheckboxNavAdaptor = function (checkBoxDOM, name) {
    var self = this;
    var _checkBoxDOM = checkBoxDOM;
    var _name = name;

    // event fired when a tab changes
    self.onSelectionChanged = new SimpleEvent();

    var getCheckBox = function() {
        return _checkBoxDOM[0];
    };

    var hashFromVal = function (binValue) {
        if (binValue === true) {
            return "selected_" + name;
        }
        else {
            return "unselected_" + name;
        }
    }

    var hashFromState = function () {
        return hashFromVal (getCheckBox().checked);
    };

    _checkBoxDOM.bind("change", function (event, ui) {
        self.fireSelectedHashChanged();
    });

    self.fireSelectedHashChanged = function () {
        self.onSelectionChanged.fire(self, self.getSelectedKey());
    };

    self.getSelectedKey = function () {
        return hashFromState();
    };

    // select method
    self.select = function (hash) {
        var checkedState; 
        if (hash === hashFromVal(true)) {
            checkedState = true;
        }
        else if (hash === hashFromVal(false)) {
            checkedState = false;
        }

        if (checkedState || (checkedState === false)) {
            getCheckBox().checked = checkedState;
            _checkBoxDOM.trigger("change");
        }
    };

    // do nothing
    self.unselect = function () {

    };
};
