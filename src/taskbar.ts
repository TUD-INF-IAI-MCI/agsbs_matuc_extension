/**
 * @author  Lucas Vogel
 */
import * as vscode from 'vscode';
import Helper from './helper/helper';

import EditorFunctions from './editorFunctions';
import ProjectToolsFunctions from './projectToolsFunctions';

/**
 * Main class of the taskbar
 */
export default class Taskbar {
    private _taskbarIsVisible: Boolean;
    private _panel: vscode.WebviewPanel;
    private _sidebarCallback: any;
    private _helper: Helper;
    private _context: vscode.ExtensionContext;
    private _editorFunctions: EditorFunctions;
    private _callbacks: any;
    private _projectToolsFunctions: ProjectToolsFunctions;
    constructor(sidebarCallback, context) {
        this._context = context;
        this._taskbarIsVisible = false;
        this._sidebarCallback = sidebarCallback;
        this._helper = new Helper;
        this._editorFunctions = new EditorFunctions(this, this._sidebarCallback, context);
        this._projectToolsFunctions = new ProjectToolsFunctions(this, this._sidebarCallback, context);
        this._panel = null;
        this._callbacks = [];
    }

    /**
     * Returns the current State of visibility of the Taskbar.
     * @return The current visibility from type Boolean.
     */
    public isVisible() {
        return this._taskbarIsVisible;
    }

    /** this Function gets called from the Webview when a button is clicked. 
     * It calls one of the callbacks from EditorFunctions.
     * @param message The content of the message from the Webview
     */
    private _messageFromWebviewHandler = (message) => {
        this._callbacks[message.text]();
    }

    /**
     * Opens a Taskbar Webview
     * @return A WebviewPanel from Type vscode.WebviewPanel
     */
    public async show() {
        return new Promise(async (resolve, reject) => {
            this._taskbarIsVisible = true;
            var panel = vscode.window.createWebviewPanel(
                'agsbstaskbar', // Identifies the type of the webview. Used internally
                "AGSBS Toolbar", // Title of the panel displayed to the user
                //vscode.ViewColumn.One, // Editor column to show the new webview panel in.
                {
                    viewColumn: vscode.ViewColumn.Three,
                    preserveFocus: true
                },
                {
                    enableScripts: true
                } // Webview options
            );
            this._panel = panel;
            panel.webview.html = this._getBaseHTML();
            panel.onDidDispose(() => {
                this._taskbarIsVisible = false; //When panel is closed
                this._panel = null;
            }, null);
            panel.webview.onDidReceiveMessage(message => {
                this._messageFromWebviewHandler(message);
            }, undefined);
            this._editorFunctions.setup();
            this._projectToolsFunctions.setup();
            resolve(panel);//return panel;
        });
    }

    /**
     * Gets triggered when the Layout of the Editor changes. 
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    public async hide(panel: vscode.WebviewPanel) {
        return new Promise(async (resolve, reject) => {
            await panel.dispose();
            this._taskbarIsVisible = false;
            this._panel = null;
            resolve(true);
        });
    }

    /** Adds a Button to the Taskbar
     * @param iconName the Name of the Icon in the Icon Folder, with file extension (so for example "icon.svg")
     * @param name Displayname of the Icon
     * @param callback callback to the function, must be an arrow function
     * @param section optional section the button is displayed in
     * @param commandIdentifier optional. The identifier used in the package.json command and key binding.
     */
    public addButton = (iconName: string, name: string, callback: any, section: string, commandIdentifier?: string) => {
        var id = this._helper.generateUuid();
        var newSection = "";
        if (section !== undefined) {
            newSection = section;
        }
        if (this._sectionIsInWebview(newSection) === false) {
            var newSectionHTML = this._generateSectionHTML(section);
            this._addToHTML("TOOLS_END", newSectionHTML);
        }
        var icon = this._helper.getWebviewResourceIconURI(iconName, this._context);
        //use Images as Background Mask to allow dynamic color change with css variables (allow themes)
        var html = `<button name="${name}" title="${name}" onclick="sendMessage('${id}')" style ="-webkit-mask-image: url(${icon});mask-image: url(${icon})"></button>`;
        this._callbacks[id] = callback;
        newSection = "SECTION-" + newSection;
        this._addToHTML(newSection, html);
        if (commandIdentifier !== undefined) {
            if (!commandIdentifier.includes("agsbs.")) {
                commandIdentifier = "agsbs." + commandIdentifier;
            }
            let disposable = vscode.commands.registerCommand(commandIdentifier, () => {
                callback();
            });
        }

    }

    /** Adds a Button to the Taskbar Project Tools
     * @param iconName the Name of the Icon in the Icon Folder, with file extension (so for example "icon.svg")
     * @param name Displayname of the Icon
     * @param section optional section the button is displayed in
     * @param commandIdentifier optional. The identifier used in the package.json command and key binding.
     */
    public addProjectTool = (iconName: string, name: string, callback: any, section: string, commandIdentifier?: string) => {
        var id = this._helper.generateUuid();
        var newSection = "";
        if (section !== undefined) {
            newSection = section;
        }
        if (this._sectionIsInWebview(newSection) === false) {
            var newSectionHTML = this._generateSectionHTML(section);
            this._addToHTML("PROJECTTOOLS_END", newSectionHTML);
        }
        var icon = this._helper.getWebviewResourceIconURI(iconName, this._context);
        //use Images as Background Mask to allow dynamic color change with css variables (allow themes)
        var html = `<button name="${name}" title="${name}" onclick="sendMessage('${id}')" style ="-webkit-mask-image: url(${icon});mask-image: url(${icon})"></button>`;
        this._callbacks[id] = callback;
        newSection = "SECTION-" + newSection;
        this._addToHTML(newSection, html);
        if (commandIdentifier !== undefined) {
            if (!commandIdentifier.includes("agsbs.")) {
                commandIdentifier = "agsbs." + commandIdentifier;
            }
            let disposable = vscode.commands.registerCommand(commandIdentifier, () => {
                callback();
            });
        }
    }

    /** This adds HTML to the taskbars Webview, at the given point. 
     * This point is predefined in the _getBaseHTML-Function and _generateSectionHTML, for example SECTION-*, HEAD_END, BODY_START or BODY_END
     * @param section section Name, see examples above
     * @param html html to insert 
     */
    private _addToHTML = (section: string, html: string) => {
        var marker = "<!--" + section + "-->";
        var oldHTML = this._panel.webview.html;
        html = html + marker;
        var newHTML = oldHTML.replace(marker, html);
        this._panel.webview.html = newHTML;
    }

    /** Generate a HTML snippet to insert into the Webview for a given Name
     * @param name Name of the section
     * @returns a HTML snippet
     */
    private _generateSectionHTML = (name: string) => {
        return `<fieldset name="${name}"><legend>${name}</legend><!--SECTION-${name}--></fieldset>`;
    }

    /** Checks if a section is in the Webview HTML
     * @param section name of the sectiton 
     * @returns Boolean, true if the section is already in the WebView
     */
    private _sectionIsInWebview(section: string) {
        var webViewHTML = this._panel.webview.html;
        var sectionIndicator = "<!--SECTION-" + section + "-->";
        if (webViewHTML.includes(sectionIndicator)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the base Frame HTML for the Webview
     */
    private _getBaseHTML(): string {

        // var fontAwesomeFont = this._helper.getWebviewResourceURI("fontawesome-webfont.woff2","style/fonts",this._context);
        // var fontAwesome = this._helper.getWebviewResourceURI("fontawesome.css","style",this._context);
        //If font Awesome is needed, it can be imported here.

        var style = this._helper.getWebviewResourceURI("taskbar.css", "style", this._context);
        var html = `<!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>AGSBS</title>
             <link rel="stylesheet" href="${style}">
             <!--HEAD_END-->
         </head>
         <body>
         <!--BODY_START-->
         <div class="projectContainer">
            <!--TOOLS_START-->
           
            <!--TOOLS_END-->
            </div>

            <div class="projectContainer">
            <!--PROJECTTOOLS_START-->

            <!--PROJECTTOOLS_END-->
            </div>
            <!--BODY_END-->
          <script>
             //const output = document.getElementById('output');
             //output.innerHTML= "Loaded";
                 const vscode = acquireVsCodeApi();
                 function sendMessage(message){
                     vscode.postMessage({
                         text: message
                     })
                 }
         </script>
         </body>
         </html>`;
        return html;
    }
}