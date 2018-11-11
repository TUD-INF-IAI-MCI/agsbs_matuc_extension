import *as vscode from 'vscode'
import Helper from './helper'

export default class Taskbar {
    private _taskbarIsVisible:Boolean;
    private _sidebarCallback;
    private _helper:Helper;
    private _context:vscode.ExtensionContext;
    constructor(sidebarCallback,context) {
        this._context=context;
        this._taskbarIsVisible=false;
        this._sidebarCallback=sidebarCallback;
        this._helper =new Helper;
    
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
        panel.webview.html = this._getHTML();
        
        panel.onDidDispose(() => {
            this._taskbarIsVisible =false; //When panel is closed
        }, null);

        panel.webview.onDidReceiveMessage(message => {
            switch (message.text) {
                case 'testbutton':
                    //vscode.window.showErrorMessage(message.text);
                    this.insertTest();
                    return;
                case 'sidebarTest':
                vscode.window.showInformationMessage('SIDEBAR');
                this._sidebarCallback("showTestSidebar");

            }
        }, undefined);

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
    }

    public addButton = (name)=>{
        //console.log(this._helper.getWebviewResourceIconURI(name,this._context));
    }



    private _getHTML():string{
        var de = this._helper.getWebviewResourceIconURI("de.svg",this._context);
        var fontAwesomeFont = this._helper.getWebviewResourceURI("fontawesome-webfont.woff2","style/fonts",this._context);
        var fontAwesome = this._helper.getWebviewResourceURI("fontawesome.css","style",this._context);
         var html = `<!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>AGSBS</title>
             <style>
             @font-face {
                font-family: 'Font Awesome 5 Free';
                font-weight: normal;
                font-style: normal;
                src: url('${fontAwesomeFont}') format("woff2");
              }
              
             </style>
             <link rel="stylesheet" href="${fontAwesome}">
         </head>
         <body>
         <i class="fas fa-bold"></i>
             <a href='#' onclick="sendMessage('testbutton')" title='Test Title Tooltip'>Test</a>
             <br/>
             <a href='#' onclick="sendMessage('sidebarTest')" title='Test Title Tooltip'>Sidebar</a>
             <h1 id="output">Unloaded</h1>
             <img src='${de}' alt='icon' style='width:20px'/>
             <script>
             const output = document.getElementById('output');
             output.innerHTML= "Loaded";
             
                 const vscode = acquireVsCodeApi();
     
                 function sendMessage(message){
                     vscode.postMessage({
                         command: 'button',
                         text: message
                     })
                 }
                 
         </script>
         </body>
         </html>`;
        return  html;
    }
    
    public async insertTest(){
        
        vscode.window.showInformationMessage('BUTTON');
        // const files = await vscode.workspace.findFiles(
        //     '**/*.{js,ts,jsx}',
        //     '**/node_modules/**'
        // )

        //this.addButton("de.svg");

            var currentTextEditor = await this._helper.getCurrentTextEditor();
            var selection = this._helper.getWordsSelection(currentTextEditor);
            //console.log(selection);
            await this._helper.toggleCharactersAtStartAndEnd(currentTextEditor,selection,"__","__");

            


            //var newPosition = new vscode.Position(this._helper.getPrimarySelection(currentTextEditor).active.line,0);
            // console.log(newPosition);
            // const workSpaceEdit = new vscode.WorkspaceEdit();
            // workSpaceEdit.insert(
            //     currentTextEditor.document.uri,
            //     newPosition,
            //     `TEST\n`
            // )
            
            // await vscode.workspace.applyEdit(workSpaceEdit);
        }
    

}