import * as vscode from 'vscode';

//declare var globalSidebarPanel:any;
export default class Sidebar {
    private _sidebarIsVisible:Boolean;
    private _sidebarPanel:any;
    constructor() {
        this._sidebarIsVisible=false;
        this._sidebarPanel=null;
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
        //globalSidebarPanel = panel;
        this._setPanelHTML(panel, "Test");
        this._sidebarPanel=panel;
        panel.onDidDispose(() => {
            this._sidebarIsVisible =false; //When panel is closed
            this._sidebarPanel=null;

        }, null);
        
        return panel;
    }

    private _setPanelHTML(panel, html){
        panel.webview.html = html;
    }

    /**
     * Gets called from the taskbar class to add and show Elements
     * @param params: Informations on what should be done.
     */
    public taskbarCallback = (params)=>{ //Arrow function, otherwise the context of "this" will change, and is needed for this._sidebarPanel
        
        if(params =="showTestSidebar"){
            vscode.window.showInformationMessage(params);
            console.log("getPanel");
            console.log(this._sidebarPanel);
            console.log("_____")
            this._setPanelHTML(this._sidebarPanel,"<h2>CLICK</h2>");
        }
    }

    /**
     * Gets triggered when the Layout of the Editor changes. 
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    public async hide(panel: vscode.WebviewPanel) {
        vscode.window.showInformationMessage('HIDE Sidebar');
        panel.dispose();
        this._sidebarIsVisible=false;
        this._sidebarPanel=null;
        //globalSidebarPanel= null;
    }
    
}
