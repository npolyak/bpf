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
