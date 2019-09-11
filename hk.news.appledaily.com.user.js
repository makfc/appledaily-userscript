// ==UserScript==
// @name        hk.news.appledaily.com Subscription Bypass
// @namespace   Violentmonkey Scripts
// @version     0.1
// @match       https://*appledaily.com/*
// @author      makfc
// @downloadURL https://raw.githubusercontent.com/makfc/appledaily-userscript/master/hk.news.appledaily.com.user.js
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
    'use strict';

    // From: https://medium.com/snips-ai/how-to-block-third-party-scripts-with-a-few-lines-of-javascript-f0b08b9c4c0
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                // For each added script tag
                if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    if (node.innerHTML.includes('uReadDisplayMsgBox') ||
                        node.innerHTML.includes('function isOMOureadEnable')) {
                        console.log(node);
                        // Blocks the script tag execution in Safari, Chrome, Edge & IE
                        node.type = 'javascript/blocked'

                        // Firefox has this additional event which prevents scripts from beeing executed
                        const beforeScriptExecuteListener = function(event) {
                            // Prevent only marked scripts from executing
                            if (node.getAttribute('type') === 'javascript/blocked')
                                event.preventDefault();
                            node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener);
                        }
                        node.addEventListener('beforescriptexecute', beforeScriptExecuteListener);

                        // Unnecessary, but cleaner: remove the node from the DOM
                        node.parentElement.removeChild(node);
                    }
                }
            })
        })
    })

    // Starts the monitoring
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })

})();

// Old ways
// var stop = false;

// window.onload = function() {
//     stop = true;
//     console.log("window.onload");
// }


// function main() {
//     uReadDisplayMsgBox = () => {};
//     OMOureadEnable = false;
//     console.log("OMOureadEnable: " + OMOureadEnable);
//     if (stop) {
//         return;
//     }
//     setTimeout(main, 200);
// }

// main();
