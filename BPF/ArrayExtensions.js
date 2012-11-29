// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

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
