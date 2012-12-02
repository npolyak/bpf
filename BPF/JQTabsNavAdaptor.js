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

/// <reference path="jquery-1.8.2.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.JQTabsNavAdaptor = function (tabsObj) {
    var self = this;

    var getSelectedHash = function () {
        var selectedHash = bpf.utils.stripFirstPound(tabsObj.find('.ui-tabs-active a').attr("href"));
        return selectedHash;
    }

    // event fired when a tab changes
    self.onSelectionChanged = new SimpleEvent();

    tabsObj.bind("tabsselect", function (event, ui) {
        var tObj = tabsObj[0];

        if (event.target !== tObj)
            return;

        self.selectedKey = bpf.utils.stripFirstPound(ui.tab.hash);

        fireSelectedHashChanged();
    });

    var fireSelectedHashChanged = function () {
        self.onSelectionChanged.fire(self, self.selectedKey);
    };

    self.getSelectedKey = function () {
        if (self.selectedKey)
            return self.selectedKey;

        var selectedKey = getSelectedHash();

        return selectedKey;
    };

    // select method
    self.select = function (hash) {
        tabsObj.tabs("select", hash);
    };

    // do nothing
    self.unselect = function () {

    };
};
