var vscode = require('vscode');
var util = require('util');
var spawn = require('child_process').spawn;
var Taskbar = require("./taskbar");
var Startup = /** @class */ (function () {
    function Startup() {
        this.Taskbar = new Taskbar;
        console.log("CONSTRUCTOR:");
        console.log(this.Taskbar);
        console.log("-----");
        this.update();
    }
    Startup.prototype.update = function () {
        vscode.window.showInformationMessage('UPDATE!');
        console.log("UPDATE:");
        console.log(this.Taskbar);
        console.log(this.taskbarPanel);
        console.log("-----");
        //this.taskbarPanel= this.Taskbar.getPanel();
        console.log(this.Taskbar);
        //Taskbar.prototype.ls();
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var doc = editor.document;
        if (doc.languageId === "markdown") {
            var panel = this.Taskbar.showTaskbar();
            console.log("PANEL");
            console.log(panel);
            this.taskbarPanel = panel;
        }
        else {
            this.Taskbar.hideTaskbar();
        }
    };
    return Startup;
}());
module.exports = Startup;
