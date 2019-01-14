"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helper_1 = require("./helper");
const editorFunctions_1 = require("./editorFunctions");
const projectToolsFunctions_1 = require("./projectToolsFunctions");
class Taskbar {
    constructor(sidebarCallback, context) {
        /** this Function gets called from the Webview when a button is clicked.
         * It calls one of the callbacks from EditorFunctions.
         * @param message The content of the message from the Webview
         */
        this._messageFromWebviewHandler = (message) => {
            this._callbacks[message.text]();
        };
        /** Adds a Button to the Taskbar
         * @param iconName the Name of the Icon in the Icon Folder, with file extension (so for example "icon.svg")
         * @param name Displayname of the Icon
         * @param section optional section the button is displayed in
         */
        this.addButton = (iconName, name, callback, section) => {
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
            var html = `<button name="${name}" title="${name}" onclick="sendMessage('${id}')" style ="-webkit-mask-image: url(${icon});mask-image: url(${icon})">
                        
                    </button>
                    `;
            //<img src="${icon}" style="width:100%"/><br>
            //<br><label for="${name}">${name}</label>
            this._callbacks[id] = callback;
            newSection = "SECTION-" + newSection;
            this._addToHTML(newSection, html);
        };
        /** Adds a Button to the Taskbar Project Tools
         * @param iconName the Name of the Icon in the Icon Folder, with file extension (so for example "icon.svg")
         * @param name Displayname of the Icon
         * @param section optional section the button is displayed in
         */
        this.addProjectTool = (iconName, name, callback, section) => {
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
            var html = `<button name="${name}" title="${name}" onclick="sendMessage('${id}')" style ="-webkit-mask-image: url(${icon});mask-image: url(${icon})">
                        
                    </button>
                    `;
            this._callbacks[id] = callback;
            newSection = "SECTION-" + newSection;
            this._addToHTML(newSection, html);
        };
        /** This adds HTML to the taskbars Webview, at the given point.
         * This point is predefined in the _getBaseHTML-Function and _generateSectionHTML, for example SECTION-*, HEAD_END, BODY_START or BODY_END
         * @param section section Name, see examples above
         * @param html html to insert
         */
        this._addToHTML = (section, html) => {
            var marker = "<!--" + section + "-->";
            var oldHTML = this._panel.webview.html;
            html = html + marker;
            var newHTML = oldHTML.replace(marker, html);
            this._panel.webview.html = newHTML;
        };
        /** Generate a HTML snippet to insert into the Webview for a given Name
         * @param name Name of the section
         * @returns a HTML snippet
         */
        this._generateSectionHTML = (name) => {
            return `<fieldset name="${name}"><legend>${name}</legend><!--SECTION-${name}--></fieldset>`;
        };
        this._context = context;
        this._taskbarIsVisible = false;
        this._sidebarCallback = sidebarCallback;
        this._helper = new helper_1.default;
        this._editorFunctions = new editorFunctions_1.default(this, this._sidebarCallback, context);
        this._projectToolsFunctions = new projectToolsFunctions_1.default(this, this._sidebarCallback, context);
        this._panel = null;
        this._callbacks = [];
    }
    /**
     * Returns the current State of visibility of the Taskbar.
     * @return The current visibility from type Boolean.
     */
    isVisible() {
        return this._taskbarIsVisible;
    }
    /**
     * Opens a Taskbar Webview
     * @return A WebviewPanel from Type vscode.WebviewPanel
     */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._taskbarIsVisible = true;
                var panel = vscode.window.createWebviewPanel('agsbstaskbar', // Identifies the type of the webview. Used internally
                "AGSBS Toolbar", // Title of the panel displayed to the user
                //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
                {
                    viewColumn: vscode.ViewColumn.Three,
                    preserveFocus: true
                }, {
                    enableScripts: true
                } // Webview options. More on these later.
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
                resolve(panel); //return panel;
            }));
        });
    }
    /**
     * Gets triggered when the Layout of the Editor changes.
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     */
    hide(panel) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield panel.dispose();
                this._taskbarIsVisible = false;
                this._panel = null;
                //vscode.window.showInformationMessage('HIDE Taskbar');
                resolve(true);
            }));
        });
    }
    /** Checks if a section is in the Webview HTML
     * @param section name of the sectiton
     * @returns Boolean, true if the section is already in the WebView
     */
    _sectionIsInWebview(section) {
        var webViewHTML = this._panel.webview.html;
        var sectionIndicator = "<!--SECTION-" + section + "-->";
        if (webViewHTML.includes(sectionIndicator)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns the base Frame HTML for the Webview
     */
    _getBaseHTML() {
        // var fontAwesomeFont = this._helper.getWebviewResourceURI("fontawesome-webfont.woff2","style/fonts",this._context);
        // var fontAwesome = this._helper.getWebviewResourceURI("fontawesome.css","style",this._context);
        var style = this._helper.getWebviewResourceURI("taskbar.css", "style", this._context);
        //var defaultSection = this._generateSectionHTML("");
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
        /**
         * ${defaultSection}
         * <style>
             @font-face {
                font-family: 'Font Awesome 5 Free';
                font-weight: normal;
                font-style: normal;
                src: url('${fontAwesomeFont}') format("woff2");
              }
             </style>
             <link rel="stylesheet" href="${fontAwesome}">
         */
    }
}
exports.default = Taskbar;
//# sourceMappingURL=taskbar.js.map