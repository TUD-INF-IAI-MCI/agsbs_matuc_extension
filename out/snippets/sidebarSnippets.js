"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author  Lucas Vogel
 */
const languages_1 = require("../languages");
/**
 * This class contains HTML Snippets of the Sidebar.
 */
class SidebarSnippets {
    /**
     * Gets a snippet
     * @param snippetName identifier of the snippet
     * @returns snippet
     */
    get(snippetName) {
        return (this.d[snippetName]);
    }
    constructor() {
        this._language = new languages_1.default;
        this.d = [];
        this.d['sidebarBaseHTMLScript'] = `
        var form = document.forms["inputForm"];
                form.onsubmit = function(event) {
                    event.preventDefault();
                    validate();
                    return false;
                    
                }
                function validate () {
                    var form = document.forms["inputForm"];
                    var returnObject = {};
                    for (var i = 0; i<form.length; i++){
                        var element = form[i];
                        if(element.hasAttribute("name")){
                            var name = element.name;
                            var elementPropertyObject = {};
                            for (var property in element) {
                                elementPropertyObject [property] = element[property];
                            }
                            returnObject[name] = elementPropertyObject;
                        }
                    }
                    sendMessage( JSON.stringify(returnObject));
                }
                const vscode = acquireVsCodeApi();
                     function sendMessage(message){
                         vscode.postMessage({
                             text: message
                         })
                     }
                     function sendMessageCancel(){
                        vscode.postMessage({
                            cancel:true
                        })
                    }
        `;
    }
}
exports.default = SidebarSnippets;
//# sourceMappingURL=sidebarSnippets.js.map