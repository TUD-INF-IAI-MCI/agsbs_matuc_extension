import * as vscode from 'vscode'
import Helper from './helper'
import Language from './languages'
import EditorFunctions from './editorFunctions';

export default class Taskbar {
    private _taskbarIsVisible:Boolean;
    private _panel:vscode.WebviewPanel;
    private _sidebarCallback;
    private _helper:Helper;
    private _context:vscode.ExtensionContext;
    private _editorFunctions:EditorFunctions;
    private _callbacks:any;
    constructor(sidebarCallback,context) {
        this._context = context;
        this._taskbarIsVisible = false;
        this._sidebarCallback = sidebarCallback;
        this._helper = new Helper;
        this._editorFunctions= new EditorFunctions(this, this._sidebarCallback,context);
        this._panel=null;
        this._callbacks=[];
    }

    /**
     * Returns the current State of visibility of the Taskbar.
     * @return The current visibility from type Boolean.
     */
    public isVisible(){
        return this._taskbarIsVisible;
    }

    /**
     * Opens a Taskbar Webview
     * @return A WebviewPanel from Type vscode.WebviewPanel
     */
    public async show() {
        this._taskbarIsVisible=true;
        vscode.window.showInformationMessage('UPDATE');
        var panel = vscode.window.createWebviewPanel(
            'agsbstaskbar', // Identifies the type of the webview. Used internally
            "AGSBS Toolbar", // Title of the panel displayed to the user
            //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Three,
            { 
                enableScripts: true
            } // Webview options. More on these later.
        );
        this._panel=panel;

        panel.webview.html = this._getBaseHTML();
        
        panel.onDidDispose(() => {
            this._taskbarIsVisible =false; //When panel is closed
            this._panel=null;
        }, null);

        panel.webview.onDidReceiveMessage(message => {
            console.log("got message");
            this._messageFromWebviewHandler(message);
            // switch (message.text) {
            //     case 'testbutton':
            //         //vscode.window.showErrorMessage(message.text);
            //         this.insertTest();
            //         return;
            //     case 'sidebarTest':
            //     vscode.window.showInformationMessage('SIDEBAR');
            //     this._sidebarCallback("showTestSidebar");

            // }
        }, undefined);
        this._editorFunctions.setup();
        return panel;
    }

    /**
     * Gets triggered when the Layout of the Editor changes. 
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    public async hide(panel: vscode.WebviewPanel) {
        vscode.window.showInformationMessage('HIDE');
        panel.dispose();
        this._taskbarIsVisible=false;
        this._panel=null;
    }

    /** Adds a Button to the Taskbar
     * @param iconName the Name of the Icon in the Icon Folder, with file extension (so for example "icon.svg")
     * @param name Displayname of the Icon
     * @param section optional section the button is displayed in
     */
    public addButton = (iconName:string,name:string,callback:any,section?:string)=>{
        var id = this._helper.generateUuid();
        var newSection="default";
        if(section!=undefined){
            newSection=section;
        }
        var icon = this._helper.getWebviewResourceIconURI(iconName,this._context);
        var html = `<button name="${name}" title="${name}" style="width:50px;height:50px;boder:1px solid white;" onclick="sendMessage('${id}')">
                        <img src="${icon}" style="width:100%"/><br>
                        <label for="${name}">${name}</label>
                    </button>`;
        this._callbacks[id] = callback;
        this._addToHTML("SECTION-"+newSection,html);
    }


    private _addToHTML= (place:string,html:string)=>{
        var marker = "<!--"+place+"-->";
        var oldHTML = this._panel.webview.html;
        html = html + marker;
        var newHTML = oldHTML.replace(marker,html);
        //console.log(newHTML);
        this._panel.webview.html= newHTML;
    }

    private _generateSectionHTML= (name:string)=>{
        return `<div name="${name}"><label for="${name}">${name}</label><!--SECTION-${name}--></div>`;
    }

    private _getBaseHTML():string{
        // var fontAwesomeFont = this._helper.getWebviewResourceURI("fontawesome-webfont.woff2","style/fonts",this._context);
        // var fontAwesome = this._helper.getWebviewResourceURI("fontawesome.css","style",this._context);
        var defaultSection = this._generateSectionHTML("default");
         var html = `<!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>AGSBS</title>
             <!--HEAD_END-->
         </head>
         <body>
            <!--BODY_START-->
           ${defaultSection}
            <!--BODY_END-->
          <script>
             //const output = document.getElementById('output');
             //output.innerHTML= "Loaded";
                 const vscode = acquireVsCodeApi();
                 function sendMessage(message){
                     vscode.postMessage({
                         text: message
                     })
                 }
         </script>
         </body>
         </html>`;
        return  html;

        /**
         * <style>
             @font-face {
                font-family: 'Font Awesome 5 Free';
                font-weight: normal;
                font-style: normal;
                src: url('${fontAwesomeFont}') format("woff2");
              }
             </style>
             <link rel="stylesheet" href="${fontAwesome}">
         */
    }


    private _messageFromWebviewHandler = (message)=>{
        console.log("message");
        console.log(message);
        console.log(this._callbacks);
        this._callbacks[message.text]();
    }

    

}