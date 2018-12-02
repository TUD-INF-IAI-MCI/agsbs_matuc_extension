import * as vscode from 'vscode';
import Helper from './helper';
import Language from './languages';

//declare var globalSidebarPanel:any;
export default class Sidebar {
    private _sidebarIsVisible:Boolean;
    private _language:Language;
    private _context:vscode.ExtensionContext;
    private _helper:Helper;
    private _panel:vscode.WebviewPanel;
    private _sidebarCallback:any;
    constructor(context) {
        this._sidebarIsVisible = false;

        this._context = context;
        this._helper = new Helper();
        this._panel = null;
        this._sidebarCallback = null;
    }

    /**
     * Returns the current State of visibility of the Sidebar.
     * @return The current visibility from type Boolean.
     */
    public isVisible(){
        return this._sidebarIsVisible;
    }

    /**
     * Opens a Sidebar Webview
     * @return A WebviewPanel from Type vscode.WebviewPanel
     */
    public async show() {
        this._sidebarIsVisible = true;
        //vscode.window.showInformationMessage('UPDATE');
        var panel = vscode.window.createWebviewPanel(
            'agsbssidebar', // Identifies the type of the webview. Used internally
            "AGSBS Sidebar", // Title of the panel displayed to the user
            //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Two,
            { 
                enableScripts: true
            } // Webview options. More on these later.
        );
        //globalSidebarPanel = panel;
        

        panel.webview.html = this._getBaseHTML();

        panel.onDidDispose(() => {
            this._sidebarIsVisible = false; //When panel is closed
            this._panel=null;

        }, null);

        panel.webview.onDidReceiveMessage(message => { //If the Webview sends a Message
            this._messageFromWebviewHandler(message);
        }, undefined);

        this._panel=panel;

        return panel;
    }

    /**
     * Does the Callback to the EditorFunctions
     * @param message from Webview
     */
    private _messageFromWebviewHandler = (message)=>{
        console.log("CALLBACK");
        this._sidebarCallback(JSON.parse(message.text));
        this._panel.webview.html = this._getBaseHTML();
    }


    /**
     * Gets triggered when the Layout of the Editor changes. 
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    public async hide(panel: vscode.WebviewPanel) {
        vscode.window.showInformationMessage('HIDE Sidebar');
        panel.dispose();
        this._sidebarIsVisible = false;
        this._panel = null;
    }

    /**
     * Adds a HTML-snippet to the Sidebar.
     * @param html a HTML form snippet. IMPORTANT: do NOT add <form> tags, only the items. ALSO: adding names to every item is MANDATORY
     * @param callback the function callback called when the form is submitted
     * @param buttonText optional. Curstom text for the Submit-Button
     * @param css optional. Custom CSS for the form
     * @param script optional. Custom javascript for the form
     */
    public addToSidebar = async (html:string,headline:string, callback:any,buttonText?:string,css?:string,script?:string) =>{
        this._panel.webview.html = this._getBaseHTML();
        this._sidebarCallback = callback;
        this._addToHTML("FORM_END",html);
        if(headline !== undefined && headline !== ""){
            this._addToHTML("HEADLINE",`<h2>${headline}</h2>`);
        }
        if(buttonText !== undefined){
        this._addToHTML("BUTTON",`<br><input type="submit" value="${buttonText}">`);
        } else {
            var standardButtonText = this._language.get("ok");
            this._addToHTML("BUTTON",`<br><input type="submit" value="${standardButtonText}">`);
        }
        if(script !== undefined){
            this._addToHTML("SCRIPT",script);
        }

    }


    /** This adds HTML to the taskbars Webview, at the given point. 
     * This point is predefined in the _getBaseHTML-Function and _generateSectionHTML, for example SECTION-*, HEAD_END, BODY_START or BODY_END
     * @param section section Name, see examples above
     * @param html html to insert 
     */
    private _addToHTML= (section:string,html:string)=>{
        var marker = "<!--"+section+"-->";
        var oldHTML = this._panel.webview.html;
        html = html + marker;
        var newHTML = oldHTML.replace(marker,html);
        this._panel.webview.html = newHTML;
    }

    /** Gets the base HTML for the sidebar
     * @returns base HTML
     */
    private _getBaseHTML = () => {
        var style = this._helper.getWebviewResourceURI("sidebar.css","style",this._context);
        return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AGSBS Sidebar</title>
                <link rel="stylesheet" href="${style}">
            </head>
            <body>  
                <!--HEADLINE-->
                <form id="inputForm">
               <!--FORM_START-->
               <!--FORM_END-->
               <!--BUTTON-->
                </form>
                <!--SCRIPT-->
                
                
                <script>
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
                </script>
            </body>
        </html>
        `;
    }
    /**
     * Adds a Form to the Sidebar. 
     */
    // public addForm = async (properties:any, callback?) => {
    //     var name:string = "";
    //     var elements:any = [];
    //     var script:string = "";
    //     var html:string = "";
    //     if(properties.hasOwnProperty("name")){ 
    //         name = properties.name;
    //     }
    //     if(properties.hasOwnProperty("elements")){
    //         elements = properties.elements;
    //     }
    //     if(properties.hasOwnProperty("script")){
    //         script = properties.script;
    //     }
    //     elements.forEach(element => {
    //         if(element.hasOwnProperty("type")){
    //             html += this._generateFormElement(element);
    //         }
    //     });
    //     console.log(html);
    // }

    // private _generateFormElement = (element:any):String=>{
    //     var buttonName:string = "";
    //     var attributes:string = "";
    //     var css:string = "";
    //     var onlyOpen:boolean = false;
    //     var tagInnerText:string = "";
    //     if(element.hasOwnProperty("name")){ //Name of the Button
    //         buttonName = element.name;
    //     }
    //     if(element.hasOwnProperty("properties")){ //If there are Properties
    //         if(element.properties.hasOwnProperty("attributes")){ //if there are Properties for the button HTML
    //             attributes = element.properties.attributes;
    //         }
    //         if(element.properties.hasOwnProperty("tagInnerText")){
    //             tagInnerText= element.properties.tagInnertText;
    //         }
    //         if(element.properties.hasOwnProperty("css")){
    //             css= element.properties.css;
    //         }
    //         if(element.properties.hasOwnProperty("onlyOpen")){
    //             if(element.properties.onlyOpen === "true" || element.properties.onlyOpen === true){
    //                 onlyOpen = true;
    //             } 
    //         }
    //     }
    //     return this._generateSimpleFormElementHTML(element.type, buttonName,css,tagInnerText,attributes,onlyOpen);

    // }
    // /**
    //  * Generates the HTML
    //  */
    // private _generateSimpleFormElementHTML = (type:String,name:String,css:String,tagInnerText:String,attributes?:String,onlyOpen?:Boolean) => {
    //     var thisOnlyOpen:Boolean = false;
    //     var html:string = "";
    //     switch (type){
    //         case "input":
    //             thisOnlyOpen=true;
    //         break;
    //     }
    //     if(onlyOpen !== undefined){
    //         thisOnlyOpen = onlyOpen;
    //     }
    //     html += `<${type} name="${name} style="${css}" ${attributes}`;
    //     if(onlyOpen){ //if Tag will only be openend
    //         html += `/>${tagInnerText}`;
    //     } else {
    //         html += `>${tagInnerText}</${type}>`;
    //     }
    //     return html;
    // }

}
