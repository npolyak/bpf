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

///#source 1 1 /Scripts/BPF/EventBarrier.js
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

    if (str.charAt(str.length - 1) === '#')
        return str.slice(str.length - 1);

    return str;
};

/// replaces blacks with dashes
bpf.utils.fillBlanks = function (str) {
    if (!str)
        return str;

    return str.replace(/\s+/g, "-");
};
///#source 1 1 /Scripts/BPF/Iterator.js
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
///#source 1 1 /Scripts/BPF/ArrayExtensions.js
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
///#source 1 1 /Scripts/BPF/JQueryUiUtils.js
/// <reference path="jquery-1.8.2.js" />
/// <reference path="jquery-ui-1.9.0.js" />

$.ui.setSpinner = function (selectorString) {
    var spinnerElements = $(selectorString).spinner({
        min: 0,
        max: 1000
    });

    $(spinnerElements).spinner().bind("spinstop", function (event, data) {
        $(this).spinner().trigger("change");
    });
};

///#source 1 1 /Scripts/BPF/JQueryUtils.js
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
///#source 1 1 /Scripts/BPF/ObjUtils.js
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


///#source 1 1 /Scripts/BPF/SimpleEvent.js
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

