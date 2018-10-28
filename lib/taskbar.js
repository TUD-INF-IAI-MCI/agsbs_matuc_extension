"use strict";
exports.__esModule = true;
var vscode = require('vscode');
var util = require('util');
var spawn = require('child_process').spawn;
var Taskbar = /** @class */ (function () {
    function Taskbar() {
        this.panelIsVisible = false;
        this.mediaDirectory = 'media';
        this.update();
    }
    Taskbar.prototype._showTaskbar = function () {
        var _this = this;
        //vscode.window.showInformationMessage('show');
        if (this.panelIsVisible == true) { //if webView is already visible
            return;
        }
        var panel = vscode.window.createWebviewPanel('agsbstaskbar', // Identifies the type of the webview. Used internally
        "AGSBS Toolbar", // Title of the panel displayed to the user
        //vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
        vscode.ViewColumn.Two, {
            enableScripts: true
        } // Webview options. More on these later.
        );
        panel.webview.html = this.getWebviewContent();
        this.panelIsVisible = true;
        var layout = { orientation: 1, groups: [{ size: 0.85 }, { size: 0.15 }] };
        vscode.commands.executeCommand('vscode.setEditorLayout', layout);
        this.panel = panel;
        panel.onDidDispose(function () {
            // When the panel is closed, cancel any future updates to the webview content
            //vscode.window.showInformationMessage('DISPOSED');
            _this.panelIsVisible = false; //When panel is closed
        }, null);
        panel.webview.onDidReceiveMessage(function (message) {
            //vscode.window.showInformationMessage(message.text);
            //MESSAGE HAS ALSO message.command
            switch (message.text) {
                case 'testbutton':
                    //vscode.window.showErrorMessage(message.text);
                    _this.ls();
                    return;
            }
        }, undefined);
    };
    Taskbar.prototype._hideTaskbar = function (panel) {
        //vscode.window.showInformationMessage('hide');
        //vscode.window.showInformationMessage('AGSBS Deactivated!');
        if (this.panelIsVisible == true) {
            //vscode.window.showInformationMessage('close');
            this.panel.dispose();
        }
        this.panelIsVisible = false;
    };
    Taskbar.prototype.update = function () {
        //Taskbar.prototype.ls();
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var doc = editor.document;
        if (doc.languageId === "markdown") {
            Taskbar.prototype._showTaskbar();
            console.log(this.panel);
        }
        else {
            Taskbar.prototype._hideTaskbar(this.panel);
        }
    };
    Taskbar.prototype.ls = function () {
        var ls = spawn('matuc_js', ['version']); //var ls = spawn( 'ls', [ '-lh', '/usr' ] );
        ls.stdout.on('data', function (data) {
            vscode.window.showInformationMessage("stdout: " + data);
        });
        ls.stderr.on('data', function (data) {
            console.log("stderr: " + data);
        });
        ls.on('close', function (code) {
            console.log("child process exited with code " + code);
        });
    };
    Taskbar.prototype.getWebviewContent = function () {
        return "<!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Cat Coding</title>\n    </head>\n    <body>\n        <button onclick=\"sendMessage('testbutton')\">Test</button>\n        <h1 id=\"output\">Unloaded</h1>\n        <script>\n        const output = document.getElementById('output');\n        output.innerHTML= \"Loaded\";\n        \n            const vscode = acquireVsCodeApi();\n\n            function sendMessage(message){\n                vscode.postMessage({\n                    command: 'button',\n                    text: message\n                })\n            }\n            \n    </script>\n    </body>\n    </html>";
    };
    return Taskbar;
}());
exports.Taskbar = Taskbar;
module.exports = Taskbar;
