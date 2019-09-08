// ==UserScript==
// @name        hk.news.appledaily.com Subscription Bypass
// @namespace   Violentmonkey Scripts
// @match       https://hk.news.appledaily.com/*
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
                    if (node.innerHTML.includes('uReadDisplayMsgBox') || node.innerHTML.includes('uReadPrompt')) {
                        console.log(node);
                        // Blocks the script tag execution in Safari, Chrome, Edge & IE
                        node.type = 'javascript/blocked'

                        // Firefox has this additional event which prevents scripts from beeing executed
                        const beforeScriptExecuteListener = function(event) {
                            // Prevent only marked scripts from executing
                            if (node.getAttribute('type') === 'javascript/blocked')
                                event.preventDefault()
                            node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener)
                        }
                        node.addEventListener('beforescriptexecute', beforeScriptExecuteListener)

                        // Unnecessary, but cleaner: remove the node from the DOM
                        node.parentElement.removeChild(node)
                    }
                    // const src = node.src || ''
                    // const type = node.type
                    // If the src is inside your blacklist
                    // if (needsToBeBlacklisted(src, type)) {
                    //     // Do some stuff that will prevent the script tag loading ;)
                    //     // (See below…)
                    // }
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

// Old way
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
