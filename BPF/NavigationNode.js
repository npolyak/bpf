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

bpf.nav.Node = function (data, parentNode) {
    var _self = this;

    bpf.nav.NodeBase.call(_self, parentNode); // extend the class

    // 'data' class member contains the actuall object 
    // providing a way to access child objects one of which can 
    // be selected and whose selection should change the hash and 
    // vice versa - whose selection change should be 
    // triggered by a changing hash. Usually 
    // 'data' object is an adaptor providing 
    // a predefined selection interface
    // to some selectable data.
    // 'data' should satisfy the following interface
    // requirements:
    //     1. It should provide onSelectionChanged simple event
    //        to be fired when its selection changes
    //     2. its getSelectedKey() function should return a 
    //        a string corresponding to the selected key within the data
    //     3. It should have a function "void select(key)" which will 
    //        select a child object within the data corresponding to the 
    //        passed key.
    //     4. It should have a function "unselect()" that will unselect 
    //        the currently selected child
    var setData = function (data) {
        _self.data = data;

        data.onSelectionChanged.addSimpleEventHandler(function (key) {
            // if we are here this means that the key has already been 
            // selected by the adapter. There is no reason to select it again.
            // self.select(key); 
            _self.fireSelectionChanged();
        });
    };

    setData(data);

    // we can add multiple children using addChildren function.
    // it takes 3 function - to return a child collection, to 
    // adapt each child to the 'data' interface and get a key from 
    // the child. This function returns a collection of children. 
    // of the current node
    _self.addChildren = function (getChildrenFn, adaptChildFn, keyGetterFn) {
        var children = getChildrenFn();

        _(children).each(function (child) {
            var key = keyGetterFn(child);

            var adaptedChild = adaptChildFn(child);

            _self.addChild(key, adaptedChild);
        });

        return _childNodes;
    };

    _self.getSelectedKey = function () {
        return _self.data.getSelectedKey();
    };

    _self.unselect = function () {
        _self.data.unselect();
    };

    _self.chainUnselect = function () {
        var selectedChild = _self.getSelectedChild();

        if (selectedChild)
            selectedChild.chainUnselect();

        _self.unselect();
    }

    _self.select = function (key) {
        if (_self.getSelectedKey() === key)
            return;

        _self.data.select(key);
    };

    _self.getSelectedChild = function () {
        return _self.getChild(_self.getSelectedKey());
    };

    _self.setSelectedKeySegmentsRecursive = function (urlRemainder) {
        var endings = ['.', '(', ')'];

        var remainder;
        var ending; 

        var key = urlRemainder.getStrUpTo(endings, function (chosenEnding, remainderAfterGettingString) {
            ending = chosenEnding;
            remainder = remainderAfterGettingString;
        });

        _self.select(key);
        var childNode = _self.getSelectedChild();

        if (!childNode)
            return remainder;

        if ((ending === '.') || (ending === '(')) {
            remainder = childNode.setSelectedKeySegmentsRecursive(remainder);
        }
        else {
            childNode.chainUnselect();
        }

        if (ending === ')') {
            // add it back to the remainder in order not to treat the case 
            // when the product node is at the top level as a special case
            remainder = ending + remainder;
        }

        return remainder;
    }

    _self.getUrlRecursive = function () {
        var result = "";

        var key = _self.data.getSelectedKey();

        if (!key) {
            return result;
        }
        else {
            result += key;
        }

        var selectedChild = _self.getSelectedChild();

        if (selectedChild) {
            result += bpf.utils.segmentSeparationCharacter + selectedChild.getUrlRecursive();
        }

        return result;
    }
};
