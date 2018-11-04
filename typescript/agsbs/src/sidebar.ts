import * as vscode from 'vscode';

export default class Sidebar {
    private _sidebarIsVisible:Boolean;
    constructor() {
        this._sidebarIsVisible=false;
    }

    /**
     * Returns the current State of visibility of the Sidebar.
     * @return The current visibility from type Boolean.
     */
    public isVisible(){
        return this._sidebarIsVisible;
    }

    /**
     * Opens a Sidebar Webview
     * @return A WebviewPanel from Type vscode.WebviewPanel
     */
    public async show() {
        this._sidebarIsVisible=true;
        vscode.window.showInformationMessage('UPDATE');
        var panel = vscode.window.createWebviewPanel(
            'agsbssidebar', // Identifies the type of the webview. Used internally
            "AGSBS Sidebar", // Title of the panel displayed to the user
            //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
            vscode.ViewColumn.Two,
            { 
                enableScripts: true
            } // Webview options. More on these later.
        );
        panel.webview.html = "Test";

        panel.onDidDispose(() => {
            this._sidebarIsVisible =false; //When panel is closed
        }, null);

        return panel;
    }

    /**
     * Gets triggered when the Layout of the Editor changes. 
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    public async hide(panel: vscode.WebviewPanel) {
        vscode.window.showInformationMessage('HIDE Sidebar');
        panel.dispose();
        this._sidebarIsVisible=false;
    }
    
}
