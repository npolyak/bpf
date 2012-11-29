﻿// BPF JavaScript library version 0.9
// (c) Nick Polyak 2012 - http://awebpros.com/
// License: Code Project Open License (CPOL) 1.92(http://www.codeproject.com/info/cpol10.aspx)

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
