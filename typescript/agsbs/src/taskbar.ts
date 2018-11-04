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
        panel.webview.html = "Test";
        
        panel.onDidDispose(() => {
            this._taskbarIsVisible =false; //When panel is closed
        }, null);

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
    
}