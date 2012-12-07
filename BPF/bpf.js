///#source 1 1 /Scripts/BPF/ArrayExtensions.js
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

var isObjectArray = function (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        return true;
    }

    return false;
}

// remove an element from an array
Array.prototype.remove = function (arrayElement) {
    var currentIndex = 0;
    do {
        if (this[currentIndex] === arrayElement) {
            this.splice(currentIndex, 1);
        }
        else {
            currentIndex++;
        }
    } while (currentIndex < this.length);
};

Array.prototype.addArray = function (array) {
    for (var idx = 0; idx < array.length; idx++) {
        this.push(array[idx]);
    }
};

// insert an element at specified index
Array.prototype.insert = function (idxToInsertAfter, arrayElement) {
    this.splice(idxToInsertAfter, 0, arrayElement);
};

// return index of the first occurance of an element
Array.prototype.firstIndexOf = function (arrayElement) {
    var currentIndex = 0;
    do {
        if (this[currentIndex] === arrayElement) {
            return currentIndex;
        }

        currentIndex++;
    } while (currentIndex < this.length);
};

// return index of the last occurance of an element
Array.prototype.lastIndexOf = function (arrayElement) {
    var currentIndex = this.length - 1;
    do {
        if (this[currentIndex] === arrayElement) {
            return currentIndex;
        }

        currentIndex--;
    } while (currentIndex >= 0);
};

// clear all elements from an array
Array.prototype.clear = function () {
    this.length = 0;
};

// copies a subset of an array to a new array
Array.prototype.copy = function (beginIdx, numberElements) {
    if (!beginIdx) {
        beginIdx = 0;
    }
        
    var endIdx;

    if (!numberElements) {
        endIdx = this.length;
    }
    else
    {
        endIdx = beginIdx + numberElements;

        if (endIdx > this.length)
        {
            endIdx = this.length;
        }
    }

    var copiedArray = new Array();

    for(var i = beginIdx; i < endIdx; i++)
    {
        copiedArray.push(this[i]);
    }

    return copiedArray;
};

///#source 1 1 /Scripts/BPF/CheckboxNavAdaptor.js
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

///#source 1 1 /Scripts/BPF/Composite.js
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
/// <reference path="JQueryUtils.js" />
/// <reference path="ArrayExtensions.js" />
/// <reference path="SimpleEvent.jsx" />
/// <reference path="EventBarrier.js" />
/// <reference path="SimpleEvent.js" />
var bpf = bpf || {};

bpf.cmpst = bpf.cmpst || {};

bpf.cmpst.pluginCache = {
    cache : {},

    getPlugin : function(url) {
        var result = bpf.cmpst.pluginCache.cache[url];

        return result;
    },

    addPlugin : function(url, plugin) {
        bpf.cmpst.pluginCache.cache[url] = plugin;
    },

    hasPlugin : function(url) {
        var plugin = bpf.cmpst.pluginCache.cache[url];

        return plugin? true : false;
    }
};

bpf.cmpst.rootPluginInfo = {};

var replaceChildren = function (domToPlugInto, html) {
    domToPlugInto.contents().remove(); // remove old children

    domToPlugInto.append(html);
    return domToPlugInto;
}
// search for javascript within html file
var getScriptTextFromHTML = function (downloadedHtmlDOM) {
    var scriptTags = downloadedHtmlDOM.filter("script[data-type='script-interface']");

    if ((!scriptTags) || (scriptTags.length === 0))
        return;

    var scriptTag = scriptTags[0];

    if (!scriptTag)
        return;

    var scriptText = scriptTag.text || scriptTag.textContent || scriptTag.innerHTML;

    return scriptText;
}

var hasCodeBehindInASeparateFile = function (downloadedHtmlDOM) {
    var scriptTags = downloadedHtmlDOM.filter("script[data-has-external-code-behind='true']");

    return scriptTags.length ? true : false;
}

var downloadPluginAndAddToCache = function(pluginUrl, pluginAddedToCacheEvent) {
    $.ajax({
        "url": pluginUrl,
        "async": true,
        "success" : function(downloadedHtml) {
            var plugin = 
                {
                };

            plugin.downloadedHtmlContainer = function () {
                var _downloadedHtml;
                var _downloadedHtmlDOM;

                var accessor = {
                    getDownloadedHtml: function () {
                        return _downloadedHtml;
                    },
                    setDownloadedHtml: function (downloadedHtml) {
                        _downloadedHtml = downloadedHtml;

                        _downloadedHtmlDOM = $(_downloadedHtml);
                    },
                    getDownloadedHtmlDOM: function () {
                        return _downloadedHtmlDOM;
                    },
                    setDownloadedHtmlDOM: function (downloadedHtmlDOM) {
                        _downloadedHtmlDOM = downloadedHtmlDOM;

                        _downloadedHtml = _downloadedHtmlDOM.outerHTML();
                    }
                }

                return accessor;
            }();

            plugin.downloadedHtmlContainer.setDownloadedHtml(downloadedHtml);

            var downloadedHtmlDOM =
                plugin.downloadedHtmlContainer.getDownloadedHtmlDOM();

            var addPluginToCache = function(scriptText) {
                plugin.codeBehind = eval(scriptText);
                
                bpf.cmpst.pluginCache.addPlugin(pluginUrl, plugin);

                pluginAddedToCacheEvent.fire(plugin);
            }

            var scriptText = getScriptTextFromHTML(downloadedHtmlDOM);

            var thereIsCodeBehindInASeparateFile = hasCodeBehindInASeparateFile(downloadedHtmlDOM);

            // remove script tags from html
            downloadedHtmlDOM = downloadedHtmlDOM.not("script");

            plugin.downloadedHtmlContainer.setDownloadedHtmlDOM(downloadedHtmlDOM);

            if (scriptText) {
                addPluginToCache(scriptText);
                return;
            }

            if ( thereIsCodeBehindInASeparateFile ) {
                var scriptUrl = pluginUrl + ".js";
                $.getScript(scriptUrl, function (downloadedScriptText) {
                    addPluginToCache(downloadedScriptText);
                    return;
                });
                return;
            }

            addPluginToCache(); // no code behind
        }
    });
}

var processAndInsertPluginFromCacheImpl = function 
(
    currentDOMPluginInfo, 
    selectorToPlugInto, 
    pluginUrl,
    addedDownloadedEvent, 
    compositionReadyEventAccumulator,
    postRenderArguments,
    preRenderArguments) 
{
    var plugin = bpf.cmpst.pluginCache.getPlugin(pluginUrl);
    
    var codeBehind = plugin.codeBehind;

    if (codeBehind) {
        if (codeBehind.preRender) {
            codeBehind.preRender.call(plugin.downloadedHtmlContainer, preRenderArguments);
        }
    }

    var downloadedHtml = plugin.downloadedHtmlContainer.getDownloadedHtml();
    var downloadedHtmlDOM = plugin.downloadedHtmlContainer.getDownloadedHtmlDOM();

    var downloadedHtmlToInsert = downloadedHtml;

    if (!currentDOMPluginInfo) {
        currentDOMPluginInfo = bpf.cmpst.rootPluginInfo;
    }

    var currentDOM = currentDOMPluginInfo.currentDOM;

    var domToPlugInto;
    if (!currentDOM) {
        domToPlugInto = $(selectorToPlugInto);
    }
    else {
        domToPlugInto = currentDOM.find(selectorToPlugInto);
    }

    replaceChildren(domToPlugInto, downloadedHtmlToInsert);

    if (codeBehind) {
        if (!currentDOMPluginInfo.pluginMap) {
            currentDOMPluginInfo.pluginMap = {};
        }

        var subPluginDOMInfo = {
            "currentDOM": domToPlugInto,
            "codeBehind": codeBehind,
            "postRenderArguments": postRenderArguments
        };
        currentDOMPluginInfo.pluginMap[selectorToPlugInto] = subPluginDOMInfo;

        if (codeBehind.postRender)
            codeBehind.postRender.call(subPluginDOMInfo, compositionReadyEventAccumulator);
    }

    addedDownloadedEvent.fire(null, true);
}

bpf.cmpst.getPlugin =
    function (
        url, 
        currentDOMPluginInfo, 
        selectorToPlugInto, 
        compositionReadyEventAccumulator, 
        postRenderArguments,
        preRenderArgs) 
    {
        var addedDownloadedEvent = new SimpleEvent();
    
        compositionReadyEventAccumulator.addCallback(addedDownloadedEvent, url);

        var processAndInsertPluginFromCache = function(){
            processAndInsertPluginFromCacheImpl (
                currentDOMPluginInfo, 
                selectorToPlugInto, 
                url,
                addedDownloadedEvent, 
                compositionReadyEventAccumulator,
                postRenderArguments,
                preRenderArgs);
        };

        if (bpf.cmpst.pluginCache.hasPlugin()) {
            processAndInsertPluginFromCache();
            return;
        }

        var pluginAddedToCacheEvent = new SimpleEvent();

        pluginAddedToCacheEvent.addSimpleEventHandler(function () {
            processAndInsertPluginFromCache();
        });

        downloadPluginAndAddToCache(url, pluginAddedToCacheEvent);

    };

var getCallableControl = function (currentDOMPluginInfo) {
    return {
        "currentDOMPluginInfo": currentDOMPluginInfo,
        "call": function (callFunctionName, otherArgs) {
            var argsToPassToEvents = Array.prototype.copy.call(arguments, 1);
            //argsToPassToEvents.insert(0, parentDomElement);
            currentDOMPluginInfo.codeBehind[callFunctionName].apply(currentDOMPluginInfo, argsToPassToEvents);
        }
    };
}

bpf.control = function (selector, currentDOMPluginInfo) {
    if (!currentDOMPluginInfo) {
        currentDOMPluginInfo = bpf.cmpst.rootPluginInfo;
    }

    var selectorPluginInfo = currentDOMPluginInfo.pluginMap[selector];

    return getCallableControl(selectorPluginInfo);
}

///#source 1 1 /Scripts/BPF/EventBarrier.js
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

/// <reference path="SimpleEvent.js" />

// should fire only if all events completed. 
// if one or more events failed returns false, iff all events succeeded returns true
"use strict";

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

bpf.utils.EventBarrier = function () {
    var eventToFireAtTheEnd = new SimpleEvent();
    var events = {};
    var eventId = 0;

    var resultSuccess = true;
    var numberEvents = 0;

    this.getNumberEvents = function() {
        return numberEvents;
    }
    
    this.addSimpleEventHandler = function (eventHandler) {
        eventToFireAtTheEnd.addSimpleEventHandler(eventHandler);
    };

    this.addCallback = function (event, eventName) {
        var self = this;
        eventId++;

        var eventData = {
            id: eventId,
            event: event
        };

        if (eventName)
            eventData.name = eventName;

        events[eventId] = eventData;

        numberEvents++;

        event.addSimpleEventHandler(function (success) {
            delete events[eventId];
            numberEvents--;

            resultSuccess = resultSuccess && success;

            if (numberEvents === 0)
                eventToFireAtTheEnd.fire(self, resultSuccess);
        });
    }

    this.createChildEventBarrier = function(childEventBarrierName) {
        var childEventBarrier = new bpf.utils.EventBarrier();

        var childEventBarrierFiredEvent = new SimpleEvent();

        this.addCallback(childEventBarrierFiredEvent, childEventBarrierName);

        // when the child event product is done, the simple event 
        // which is one of the callbacks for the parent. This will reduce the 
        // parent's reference count and if the parent's reference count is zero, 
        // fire the event-at-the-end.
        childEventBarrier.addSimpleEventHandler(function (success) {
            childEventBarrierFiredEvent.fire();
        });

        return childEventBarrier;
    }
};

///#source 1 1 /Scripts/BPF/HashStrings.js
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

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

bpf.utils.segmentSeparationCharacter = '.';

// strips the leading '#' character.
bpf.utils.stripFirstPound = function (str) {
    if (!str)
        return str;

    if (str.charAt(0) === '#')
        return str.slice(1);

    return str;
};

bpf.utils.stripTrailingDot = function (str) {
    if (!str)
        return str;

    if (str.charAt(str.length - 1) === '.')
        return str.slice(0, str.length - 1);

    return str;
};

/// replaces blacks with dashes
bpf.utils.fillBlanks = function (str) {
    if (!str)
        return str;

    return str.replace(/\s+/g, "-");
};

///#source 1 1 /Scripts/BPF/Iterator.js
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

///#source 1 1 /Scripts/BPF/JQTabsNavAdaptor.js
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
/// <reference path="NavigationNode.js" />

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

    // fires self.onSelectionChanged event when the tab selection changes
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

    // returns the key corresponding to the currently selected tab
    self.getSelectedKey = function () {
        if (self.selectedKey)
            return self.selectedKey;

        var selectedKey = getSelectedHash();

        return selectedKey;
    };

    // selects the tab corresponding to the passed key
    self.select = function (key) {
        tabsObj.tabs("select", key);
    };

    // Interface unselect method implementation
    // (in case of tabs, it does nothing since tabs cannot be unselected - one tab should always be selected)
    self.unselect = function () {

    };
};

bpf.nav.getJQTabsNode = function (tabsObj) {
    var adaptedData = new bpf.nav.JQTabsNavAdaptor(tabsObj);

    return new bpf.nav.Node(adaptedData);
};

bpf.nav.addJQTabsChild = function (parentNode, key, tabsObj) {

    var adaptedChild = new bpf.nav.JQTabsNavAdaptor(tabsObj);
    return parentNode.addAdaptedChild(key, adaptedChild);
};
///#source 1 1 /Scripts/BPF/JQueryUiUtils.js
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
/// <reference path="jquery-ui-1.9.0.js" />

if ($.ui) {
    $.ui.setSpinner = function (selectorString) {
        var spinnerElements = $(selectorString).spinner({
            min: 0,
            max: 1000
        });

        $(spinnerElements).spinner().bind("spinstop", function (event, data) {
            $(this).spinner().trigger("change");
        });
    }
};

///#source 1 1 /Scripts/BPF/JQueryUtils.js
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
$.fn.outerHTMLForSimpleJQObj = function () {
    var t = $(this);

    if ('outerHTML' in t[0]) {
        return t[0].outerHTML;
    } else {
        var content = t.wrap('<div></div>').parent().html();
        t.unwrap();
        return content;
    }
};

$.fn.outerHTML = function () {
    var t = $(this);

    var result = ""

    for (var i = 0; i < t.length; i++) {
        var currentPart = t[i];

        if (currentPart instanceof Text) {
            result += currentPart.data;
        }
        else {
            result += $(currentPart).outerHTMLForSimpleJQObj();
        }
    }

    return result;
};

///#source 1 1 /Scripts/BPF/KoObservableNavAdapter.js
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

///#source 1 1 /Scripts/BPF/NavigationFactoryNode.js
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
///#source 1 1 /Scripts/BPF/NavigationNode.js
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

            _self.addAdaptedChild(key, adaptedChild);
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
            var childUrl = selectedChild.getUrlRecursive();

            if (childUrl)
                result += bpf.utils.segmentSeparationCharacter + childUrl;
        }

        return result;
    }
};

// creates a navigation node from some data. 
// adaptorConstructor is called on the data to create adaptedData
// that has needed methods and events.
bpf.nav.createNode = function (data, adaptorFunction) {
    var adaptedData = adaptorFunction(data);

    var node = new bpf.nav.Node(adaptedData);

    return node;
};

///#source 1 1 /Scripts/BPF/NavigationNodeBase.js
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

///#source 1 1 /Scripts/BPF/ObjUtils.js
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

/// <reference path="../qunit.js" />
/// <reference path="ArrayExtensions.js" />
"use strict";

var bpf = bpf || {};

bpf.utils = bpf.utils || {};

// since we should not extend object's prototype (see http://erik.eae.net/archives/2005/06/06/22.13.54/)
// we extend the object in a different way - by using objExtend function
// extend the object to have some utility methods, 
// especially those that are related to maps/dictionaries
bpf.utils.extendObj = function (obj) {
    // creates a shallow copy of an (not array) object
    var cloneObj = function (anObj) {
        var result = {};

        for (var key in anObj) {
            result[key] = anObj[key];
        }

        return result;
    };

    var cloneUnextendedOnly = function (anObj) {
        var result = {};

        for (var key in anObj) {
            var val = anObj[key];

            if (typeof (val) === 'function')
                continue;

            result[key] = val;
        }

        return result;
    };


    var _extendedObj = cloneObj(obj);

    _extendedObj.cloneObj = function () {
        return cloneObj(_extendedObj);
    };

    _extendedObj.unextendObj = function () {
        return cloneUnextendedOnly(_extendedObj);
    }

    _extendedObj.removeKey = function (key) {
        delete _extendedObj[key];
    };

    _extendedObj.containsKey = function (key) {
        return _extendedObj.hasOwnProperty(key);
    };

    _extendedObj.printKeys = function () {
        for (var key in _extendedObj) {
            console.log(key + " ");
        }
    };

    return _extendedObj;
};

//test("testRemoveKeys", function () {
//    var myObj = bpf.utils.objExtend({
//        key1: "val1",
//        key2: "val2"
//    });

//    equal(myObj.containsKey("key1"), true);
//    equal(myObj.containsKey("key3"), false);

//    myObj.removeKey("key1");

//    equal(myObj.containsKey("key1"), false);
//});

///#source 1 1 /Scripts/BPF/OrderedMap.js
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
    };

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
    };

    _self.getMapClone = function () {
        return bpf.utils.extendObj(_map);
    };

    _self.containsKey = function (key) {
        return _map.hasOwnProperty(key);
    };

    _self.reset = _self.clear = function () {
        _orderedKeys = [];

        _map = {};
    };
};


///#source 1 1 /Scripts/BPF/ProductNavigationNode.js
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

            var keyToSubNodes = remainder.getStrUpTo('/', function (chosenEnding, remainderAfterKey) {
                remainder = remainderAfterKey;
            });

            nonprocessedKeys.removeKey(keyToSubNodes); // remove the processed key from the non-processedKeys

            var childNode = childNodes.objByKey(keyToSubNodes);

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

///#source 1 1 /Scripts/BPF/SimpleEvent.js
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

function SimpleEvent() {
    this.eventHandlers = new Array();
};

SimpleEvent.prototype = {
    addSimpleEventHandler: function (eventHandler) {
        this.eventHandlers.push(eventHandler);
    },

    removeSimpleEventHandler: function (eventHandler) {
        this.eventhandlers.remove(eventHandler);
    },

    clearSimpleEventHandlers: function () {
        this.eventHandlers.clear();
    },

    setSimpleEventHandler: function (eventHandler) {
        this.clearEventHandlers();
        this.eventHandlers.addEventHandler(eventHandler);
    },

    fire: function (context, anyOtherArguments) {
        var result;

        var context;

        if (arguments.length > 0) {
            context = arguments[0];
        }

        var argsToPassToEvents = Array.prototype.copy.call(arguments, 1);

        for (var i = 0; i < this.eventHandlers.length; i++) {
            // apply() function will execute the event handler, passing to 
            // it the context and an the arguments
            result = this.eventHandlers[i].apply(context, argsToPassToEvents);
        }

        return result;
    }
};

///#source 1 1 /Scripts/BPF/StringExtensions.js
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

/// <reference path="../qunit.js" />
/// <reference path="ArrayExtensions.js" />

String.prototype.startsWith = function (prefix) {
    if (prefix.length > this.length)
        return false;

    var subStr = this.substr(0, prefix.length);

    if (subStr === prefix)
        return true;

    return false;
}

String.prototype.removePrefix = function (prefix) {
    if (!this.startsWith(prefix))
        return this;

    return this.substr(prefix.length, this.length - prefix.length);
}

// will allow multiple to specify string delimiters and 
// will return the shortest substring up to one of these delimiters
// the callback will specify the remainder of the string and the chosen delimiter
// if no ending is found within the string, it will return the whole string
// and the remainder will be undefined or empty
String.prototype.getStrUpTo = function (strEndings, endCallback) {
    
    var endIdx = this.length;
    var foundStringEnding;

    var strEndingsArray = [];

    if (isObjectArray(strEndings))
        strEndingsArray = strEndings;
    else
        strEndingsArray.push(strEndings);

    for (var strEndingIdx = 0; strEndingIdx < strEndings.length; strEndingIdx++) {
        var currentStringEnding = strEndings[strEndingIdx];
        var foundIdx = this.indexOf(currentStringEnding);

        if (foundIdx < 0)
            continue;

        if (foundIdx <= endIdx) {
            endIdx = foundIdx;
            foundStringEnding = currentStringEnding;
        }
    }

    var result = this.substr(0, endIdx);

    if (foundStringEnding) {
        endIdx += foundStringEnding.length;
    }

    if (endCallback) {
        var stringRemainder = this.substr(endIdx, this.length - endIdx);

        endCallback(foundStringEnding, stringRemainder);
    }

    return result;
}


//test("testGetStrUpTo", function () {
//    var myStr = "Hello World";

//    var remainder;
//    var ending;
//    var result = myStr.getStrUpTo(/*["lo", "e", 'H']*/"q", function (chosenEnding, strRemainder) {
//        remainder = strRemainder;

//        ending = chosenEnding;
//    });
//    equal(result, "a");
//    equal(ending, "e");
//    equal(remainder, "llo World");
//    //console.log(ending + "     |    " + remainder);
//});

String.prototype.getStrBetween = function(beginStr, endStr, startIdx, endIdxCallback)  {
    if (!startIdx)
        startIdx = 0;

    var startResultIdx = this.indexOf(beginStr, startIdx);

    if (startResultIdx < 0)
    {
        if (endIdxCallback) {
            endIdxCallback(-1);
        }

        return;
    }

    startResultIdx += beginStr.length;

    var endResultIdx = this.indexOf(endStr, startResultIdx + 1);

    if (endResultIdx < 0) {
        endResultIdx = s.length;
    }

    var endIdx = endResultIdx + 1;

    var result = this.substr(startResultIdx, endResultIdx - startResultIdx);

    if (endIdxCallback) {
        endIdxCallback(endIdx);
    }

    return result;
}


//test("testGetStrBetween", function () {

//    var myStr = "hello world hello world";

//    //if (typeof myStr === 'string')
//    //    console.log("This is a string");

//    var endIdx = 0;

//    var endIdxCallBack = function (_endIdx) {
//        endIdx = _endIdx;
//    };

//    var result = myStr.getStrBetween("llo ", " he");

//    equal(result, "world");
//});

