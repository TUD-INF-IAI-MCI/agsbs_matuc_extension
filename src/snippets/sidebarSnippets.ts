/**
 * @author  Lucas Vogel
 */
import Language from '../languages';


/**
 * This class contains HTML Snippets of the Sidebar.
 */
export default class SidebarSnippets {
    private _language: Language;
    private d: any;

    /**
     * Gets a snippet
     * @param snippetName identifier of the snippet
     * @returns snippet
     */
    public get(snippetName: string) {
        return (this.d[snippetName]);
    }
    constructor() {

        this._language = new Language;
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