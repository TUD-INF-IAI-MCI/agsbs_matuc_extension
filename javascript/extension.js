
const vscode = require('vscode');

//const Taskbar = require( "./lib/taskbar");
const Startup = require( "./lib/startup");
//let taskbar = new Taskbar();


function activate(context) {
    let startup = new Startup();
    console.log('Congratulations, your extension "agsbs" is now active!');
    vscode.window.showInformationMessage('AGSBS is Active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
    let disposable = vscode.commands.registerCommand('extension.agsbs', function () {
       main(context);
    });
    
     console.log(startup);
    vscode.window.onDidChangeActiveTextEditor(startup.update, this);
    context.subscriptions.push(startup); //For Disposables
    context.subscriptions.push(disposable);
}


exports.activate = activate;

// this method is called when the extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;




function main (context){

         const panel = vscode.window.createWebviewPanel(
            'catCoding', // Identifies the type of the webview. Used internally
            "Cat Coding", // Title of the panel displayed to the user
            //vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Two,
            { } // Webview options. More on these later.
        );
        panel.webview.html = getWebviewContent();
        layout = { orientation: 1, groups: [{  size: 0.85 }, {  size: 0.15 }] };
         vscode.commands.executeCommand('vscode.setEditorLayout', layout);
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
</body>
</html>`;
}
