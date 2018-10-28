const vscode = require('vscode');

class Taskbar {

    constructor() {
        vscode.window.showInformationMessage('CONSTRUCTOR');
        this.panel = {};
        console.log("THIS");
        console.log(this);
    }

    showTaskbar() {
        vscode.window.showInformationMessage('show');
        var panel = vscode.window.createWebviewPanel(
            'catCoding', // Identifies the type of the webview. Used internally
            "Cat Coding", // Title of the panel displayed to the user
            //vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Two,
            { } // Webview options. More on these later.
        );
        console.log("this is".this.panel!=={});
        if(this.panel!=={}){
        panel.webview.html = this.getWebviewContent();
        var layout = { orientation: 1, groups: [{  size: 0.85 }, {  size: 0.15 }] };
         vscode.commands.executeCommand('vscode.setEditorLayout', layout);
            this.panel=panel;
         return panel;
        } else {
            return false;
        }
        
    }
    hideTaskbar() {
        vscode.window.showInformationMessage('hide');
        //vscode.window.showInformationMessage('AGSBS Deactivated!');
        //this.panel.dispose();
    }
    update(context) {
        //vscode.window.showInformationMessage('Update');
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('AGSBS DEACTIVATED!');
            //this.hideTaskbar();
            return;
        }

        let doc = editor.document;

        // Only update status if a Markdown file
        //vscode.window.showInformationMessage(doc.languageId );
        if (doc.languageId === "markdown") {
            //main();
            vscode.window.showInformationMessage('will show');
            this.showTaskbar();
            //console.log(this.panel);
        } else {
            //vscode.window.showInformationMessage('AGSBS Deactivated!');
            vscode.window.showInformationMessage('will hide');
            this.hideTaskbar();
        }
    }

     getWebviewContent() {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
        Test
    </body>
    </html>`;
    }

    _onEvent() {
        vscode.window.showInformationMessage('AGSBS!');
    }
}



module.exports = Taskbar;