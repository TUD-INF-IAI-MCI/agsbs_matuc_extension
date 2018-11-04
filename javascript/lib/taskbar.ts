const vscode = require('vscode');
const util = require('util');
const { spawn } = require( 'child_process' );

export class Taskbar {
     panel;
     sidebar;
     panelIsVisible=false;
     mediaDirectory = 'media'

    constructor() { 
      // this.update();
        //return this;
    }

    public showTaskbar() {
        //vscode.window.showInformationMessage('show');
        if(this.panelIsVisible==true){ //if webView is already visible
            return;
        }
        var panel = vscode.window.createWebviewPanel(
            'agsbstaskbar', // Identifies the type of the webview. Used internally
            "AGSBS Toolbar", // Title of the panel displayed to the user
            //vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Two,
            { 
                enableScripts: true
            } // Webview options. More on these later.
        );
        panel.webview.html = this.getWebviewContent();
        this.panelIsVisible =true;
        var layout = { orientation: 1, groups: [{  size: 0.85 }, {  size: 0.15 }] };
         vscode.commands.executeCommand('vscode.setEditorLayout', layout);
            this.panel=panel;


         panel.onDidDispose(() => {
            // When the panel is closed, cancel any future updates to the webview content
            //vscode.window.showInformationMessage('DISPOSED');
            this.panelIsVisible =false; //When panel is closed
        }, null);

        panel.webview.onDidReceiveMessage(message => {
            //vscode.window.showInformationMessage(message.text);
            //MESSAGE HAS ALSO message.command
            switch (message.text) {
                case 'testbutton':
                    //vscode.window.showErrorMessage(message.text);
                    this.ls();
                    return;
            }
        }, undefined);
        //return panel;
    }
    public hideTaskbar() {
        //vscode.window.showInformationMessage('hide');
        //vscode.window.showInformationMessage('AGSBS Deactivated!');
        if(this.panelIsVisible==true){
            //vscode.window.showInformationMessage('close');
        this.panel.dispose();
        }
        this.panelIsVisible =false;
    }
    
    // public update() {
    //     //Taskbar.prototype.ls();
    //     let editor = vscode.window.activeTextEditor;
    //     if (!editor) {
    //         return;
    //     }
    //     let doc = editor.document;
    //     if (doc.languageId === "markdown") {
    //         Taskbar.prototype.showTaskbar();
    //         console.log(this.panel);
    //     } else {
    //         Taskbar.prototype.hideTaskbar();
    //     }
    // }
    ls() {    
            var ls = spawn( 'matuc_js', [ 'version' ] );//var ls = spawn( 'ls', [ '-lh', '/usr' ] );
            ls.stdout.on( 'data', data => {
                vscode.window.showInformationMessage( `stdout: ${data}` );
            } );

            ls.stderr.on( 'data', data => {
                console.log( `stderr: ${data}` );
            } );

            ls.on( 'close', code => {
                console.log( `child process exited with code ${code}` );
            } );
      }
      
    
    

     getWebviewContent() {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AGSBS</title>
    </head>
    <body>
        <a href='#' onclick="sendMessage('testbutton')">Test</a>
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
    }

}



module.exports = Taskbar;