const vscode = require('vscode');
const util = require('util');
const { spawn } = require( 'child_process' );
const Taskbar = require( "./taskbar");
 class Startup {
    Taskbar;
    taskbarPanel;

   constructor() { 
    this.Taskbar= new Taskbar;
    console.log("CONSTRUCTOR:");
    console.log(this.Taskbar);
    console.log("-----");
      this.update();
       
   }

   public update() {
    vscode.window.showInformationMessage('UPDATE!');
       console.log("UPDATE:");
    console.log(this.Taskbar);
    console.log(this.taskbarPanel);
    console.log("-----");
    //this.taskbarPanel= this.Taskbar.getPanel();
    console.log(this.Taskbar);
    //Taskbar.prototype.ls();
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let doc = editor.document;
    if (doc.languageId === "markdown") {
        var panel = this.Taskbar.showTaskbar();
        console.log("PANEL");
        console.log(panel);
        this.taskbarPanel= panel;
    } else {
        this.Taskbar.hideTaskbar();
    }
}
}
module.exports = Startup;