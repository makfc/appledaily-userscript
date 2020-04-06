// ==UserScript==
// @name        hk.news.appledaily.com Subscription Bypass
// @namespace   Violentmonkey Scripts
// @version     0.3
// @match       https://*appledaily.com/*
// @author      makfc
// @downloadURL https://raw.githubusercontent.com/makfc/appledaily-userscript/master/hk.news.appledaily.com.user.js
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function () {
    'use strict';

    // From: https://medium.com/snips-ai/how-to-block-third-party-scripts-with-a-few-lines-of-javascript-f0b08b9c4c0
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({addedNodes}) => {
            addedNodes.forEach(node => {
                // For each added script tag
                if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    if (node.innerHTML.includes('uReadDisplayMsgBox') ||
                        node.innerHTML.includes('function isOMOureadEnable') ||
                        node.innerHTML.includes('function blockContent')
                    ) {
                        console.log(node);
                        // Blocks the script tag execution in Safari, Chrome, Edge & IE
                        node.type = 'javascript/blocked'

                        // Firefox has this additional event which prevents scripts from beeing executed
                        const beforeScriptExecuteListener = function (event) {
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

                // if (node.nodeType === 1 && node.tagName === 'DIV') {
                //     console.log(node);
                //     if (node.id === "articleBody") {
                //         node.removeAttribute("style");
                //     }
                // }
            })
        })
    })

    // Starts the monitoring
    observer.observe(document.documentElement, {
        // attributes: true,
        // characterData: true,
        childList: true,
        subtree: true,
        // attributeOldValue: true,
        // characterDataOldValue: true
    })

})();

// Old ways
var stop = false;

window.onload = function () {
    console.log("window.onload");
    setTimeout(() => {
        stop = true;
        console.log("stop = true;");
    }, 1000);
}


function main() {
    // uReadDisplayMsgBox = () => {};
    // OMOureadEnable = false;
    // console.log("OMOureadEnable: " + OMOureadEnable);
    let eletment = document.getElementById("articleBody");
    if (!!eletment) {
        eletment.removeAttribute("style");
    }
    eletment = document.getElementsByClassName("authors-grid")[0];
    if (!!eletment) {
        eletment.removeAttribute("style");
    }
    eletment = document.getElementsByClassName("paywall_fade")[0];
    if (!!eletment) {
        eletment.remove();
    }
    eletment = document.getElementsByClassName("hk-paywall-container")[0];
    if (!!eletment) {
        eletment.remove();
    }
    eletment = document.getElementById("articleOmo");
    if (!!eletment) {
        eletment.remove();
    }

    if (stop) {
        return;
    }
    setTimeout(main, 200);
}

main();
