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

///#source 1 1 /Scripts/BPF/CheckboxNavAdaptor.js
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
///#source 1 1 /Scripts/BPF/JQTabsNavAdaptor.js
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
///#source 1 1 /Scripts/BPF/KoObservableNavAdapter.js
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
///#source 1 1 /Scripts/BPF/NavigationNode.js
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

        key = urlRemainder.getStrUpTo(endings, function (chosenEnding, remainderAfterGettingString) {
            ending = chosenEnding;
            remainder = remainderAfterGettingString;
        });

        _self.select(key);
        childNode = _self.getSelectedChild();

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

///#source 1 1 /Scripts/BPF/NavigationNodeBase.js
/// <reference path="underscore.js" />
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
    _self.addChild = function (key, data) {
        var childNode = new bpf.nav.Node(data);

        _self.addChildNode(key, childNode);

        return childNode;
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
        var totalHash = _self.getUrlRecursive() + bpf.utils.segmentSeparationCharacter;

        return totalHash;
    }

    _self.setSelectedKeySegments = function (url) {
        // remove the leading '#' and trailing '.'
        url = bpf.utils.stripFirstPound(url);
        url = bpf.utils.stripTrailingDot(url);

        _self.setSelectedKeySegmentsRecursive(url);
    }
};

// sets window hash from the node's segments
bpf.nav.setTotalHash = function (topTabNode) {
    window.location.hash = topTabNode.getTotalHash();
};

// sets the selected segments based on the window hash
bpf.nav.setKeySegmentToHash = function (topTabNode) {
    var totalHash = topTabNode.getTotalHash();

    if (totalHash === window.location.hash)
        return false; // return false if hash did not change

    topTabNode.setSelectedKeySegments(window.location.hash);
    bpf.nav.setTotalHash(topTabNode);

    return true; // return true if hash changed
};
///#source 1 1 /Scripts/BPF/ProductNavigationNode.js
/// <reference path="ObjUtils.js" />
/// <reference path="underscore.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="StringExtensions.js" />
/// <reference path="OrderedMap.js" />
/// <reference path="SimpleEvent.js" />
/// <reference path="HashStrings.js" />
/// <reference path="NavigationNodeBase.js" />

var bpf = bpf || {};

bpf.nav = bpf.nav || {};

bpf.nav.ProductNode = function (parentNode) {
    var _self = this;

    bpf.nav.NodeBase.call(_self, parentNode); // extend the class

    _self.chainUnselect = function () {
        var childNodes = _self.getChildren();

        for (var childNodeIterator = childNodes.getIterator() ;
             childNodeIterator.isCurrentValid() ;
             childNodeIterator.moveToNext())
        {
            var currentChildNode = childNodeIterator.current();

            currentChildNode.chainUnselect();
        }
    }

    _self.setSelectedKeySegmentsRecursive = function (urlRemainder) {
        var remainder = urlRemainder;

        var childNodes = _self.getChildren();
        var nonprocessedKeys = childNodes.getMapClone();

        while (remainder.length > 0) {
            // should always start with '(' or ')'
            if (remainder.startsWith(')'))
                return remainder.removePrefix(')'); // we ended this node

            if (!remainder.startsWith('('))
                return; // return in case of error

            remainder = remainder.removePrefix('(');

            var key = remainder.getStrUpTo('/', function (chosenEnding, remainderAfterKey) {
                remainder = remainderAfterKey;
            });

            nonprocessedKeys.removeKey(key); // remove the processed key from the non-processedKeys

            var childNode = childNodes.objByKey(key);

            remainder = childNode.setSelectedKeySegmentsRecursive(remainder);
        }

        // for all the keys that were not part of the url, do chain chain unselect 

        var nonprocessedKeysUnextended = nonprocessedKeys.unextendObj();
        for (var unprocessedKey in nonprocessedKeysUnextended) {
            var childNode = childNodes.objByKey(unprocessedKey);
            childNode.chainUnselect();
        }

        return remainder;
    }

    _self.getUrlRecursive = function () {
        var result = "";

        var childNodes = _self.getChildren();

        for (var childNodeIterator = childNodes.getIterator() ;
             childNodeIterator.isCurrentValid() ;
             childNodeIterator.moveToNext())
        {
            var currentKey = childNodeIterator.currentKey();

            var currentChildNode = childNodeIterator.current();

            var childResult = currentChildNode.getUrlRecursive();

            if (!childResult)
                continue;

            result += '(' + currentKey + '/' + childResult + ')';
        }

        return result;
    }
}
