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
