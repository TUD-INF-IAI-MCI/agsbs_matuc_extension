// 'use strict';

 import * as vscode from 'vscode';
import Helper from './helper';
import Taskbar from './taskbar';
import Sidebar from './sidebar';

/**
 * Gets triggered when the Extension is activated
 * @param context Context of the extension, gets automatically handed over from VSCode at activation
 */

export function activate(context: vscode.ExtensionContext) {
    console.log('AGSBS is now active!');
     let extensionController = new ExtensionController(context);


    let disposable = vscode.commands.registerCommand('extension.agsbs', () => {
        vscode.window.showInformationMessage('AGSBS is active.');
    });
    context.subscriptions.push(extensionController);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage('AGSBS deactivated.');
}

/**
 * Orchestrates Updates and all open Panels
 */
class ExtensionController {
    private _layout: Object;
    private _defaultLayout: Object;
    private _helper: Helper;

     private _taskbar: Taskbar;
     private _taskbarPanel:any;

     private _sidebar: Sidebar;
     private _sidebarPanel: any;

     private _disposable: vscode.Disposable;
     public getSidebarPanel(params){
        console.log("RETURN PANEL"+params);
        return this._sidebarPanel;
    }

    constructor(context: vscode.ExtensionContext) {

        
        
        let sidebar = new Sidebar(context);
        let taskbar = new Taskbar(sidebar,context);
        let helper = new Helper();
        this._layout= { orientation: 1, groups: [{groups:[{size:0.8},{  size: 0.2 }], size:0.85}, {  size: 0.15 }] };
        this._defaultLayout = { orientation: 1, groups: [{}]};
        this._helper = helper;

        this._taskbar = taskbar;
        this._sidebar = sidebar;



        let subscriptions: vscode.Disposable[] = []; //Create Disposable for Event subscriptions 
        vscode.window.onDidChangeActiveTextEditor(this._update, this, subscriptions);
        
        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
        this._update();
    }
    dispose() {
        this._disposable.dispose();
    }
    
    
    /**
     * Gets triggered when the Layout of the Editor changes. 
     */
    private async _update() {

        let editor = vscode.window.activeTextEditor;
        if (!editor) {//If no Editor is open, return.
            return;
        }
        let doc = editor.document;
        if (doc.languageId === "markdown" || doc.languageId==="multimarkdown") {//This gets executed if a Markdown File gets opened
            //First, reset Workspace
            await this._helper.setEditorLayout(this._layout);
            if(this._sidebar.isVisible()===false && this._taskbar.isVisible()===true){
                //If Sidebar is closed but Taskbar is open, close Taskbar to reset
                await this._taskbar.hide(this._taskbarPanel);
                //vscode.window.showInformationMessage('HIDE Taskbar after');
                //await this._helper.setEditorLayout(this._defaultLayout);
            }
            if(this._sidebar.isVisible()===true && this._taskbar.isVisible()===false){
                //If Sidebar is open but Taskbar is closed, close Sidebar to reset
                await this._sidebar.hide(this._sidebarPanel);
                //vscode.window.showInformationMessage('HIDE Sidebar after');
                //await this._helper.setEditorLayout(this._defaultLayout);
            }
            
            
            if(this._sidebar.isVisible() === false){
                this._sidebarPanel = await this._sidebar.show();
            }
            if(this._taskbar.isVisible() === false){
                this._taskbarPanel = await this._taskbar.show();
            }
            
            
            
            
        } else { 
            
            
            console.log("PANELS");
             console.log(this._taskbarPanel);
             console.log(this._sidebarPanel);
             //TODO: BUG when closing both panels, this should be reported as an Issue to VSCODE because an error is thrown in the core
             //This will crash the Extension debugging Host forever and will force you to reinstall VSCODE from scratch. Seriously.

             //await this._sidebar.hide(this._sidebarPanel);
            //await this._taskbar.hide(this._taskbarPanel); 

        }
        //vscode.window.showInformationMessage('UPDATE');
    }

}

