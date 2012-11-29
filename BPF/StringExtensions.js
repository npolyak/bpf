// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

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
