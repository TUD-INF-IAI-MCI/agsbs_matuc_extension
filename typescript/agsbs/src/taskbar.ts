import *as vscode from 'vscode'

export default class Taskbar {
    private _taskbarIsVisible:Boolean;
    constructor() {
        this._taskbarIsVisible=false;
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


    private _getHTML():string{
         var html = `<!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>AGSBS</title>
         </head>
         <body>
             <a href='#' onclick="sendMessage('testbutton')" title='Test Title Tooltip'>Test</a>
             <h1 id="output">Unloaded</h1>
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
        const textEditors = await vscode.window.visibleTextEditors;
        console.log("GGG");
        //console.log(textEditors);
        if(textEditors!==undefined){
            if(textEditors.length<1){
                vscode.window.showErrorMessage("No open editors.");
                return;
            }
            if(textEditors.length>1){
                vscode.window.showErrorMessage("Too many open editors. Please just open one File and without a Split View.");
                return;
            }
            var currentTextEditor = textEditors[0];
            if(currentTextEditor.document.languageId!=="markdown"){
                vscode.window.showErrorMessage("The current File is not a Markdown file and the current Action cannot be executed. Please open a Markdown File.");
                return;
            }
            console.log(currentTextEditor.selection);
            console.log(currentTextEditor.document.uri);
            var newPosition = new vscode.Position(currentTextEditor.selection.active.line,0);
            console.log(newPosition);
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.insert(
                currentTextEditor.document.uri,
                newPosition,
                `TEST\n`
            )
            
            await vscode.workspace.applyEdit(workSpaceEdit);
        }
    }

}