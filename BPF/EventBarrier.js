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
