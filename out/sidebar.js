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
/**
 * @author  Lucas Vogel
 */
const vscode = require("vscode");
const helper_1 = require("./helper/helper");
const languages_1 = require("./languages");
const sidebarSnippets_1 = require("./snippets/sidebarSnippets");
const matucCommands_1 = require("./matucCommands");
/**
 * The main class of the sidebar.
 */
class Sidebar {
    constructor(context) {
        /**
         * Does the Callback to the EditorFunctions
         * @param message from Webview
         */
        this._messageFromWebviewHandler = (message) => {
            this._sidebarCallback(JSON.parse(message.text));
            this._panel.webview.html = this._getBaseHTML(); // erase the contents of the sidebar
            this._helper.focusDocument();
        };
        /**
         * Adds a HTML-snippet to the Sidebar.
         * @param html a HTML form snippet. IMPORTANT: do NOT add <form> tags, only the items. ALSO: adding names to every item is MANDATORY
         * @param callback the function callback called when the form is submitted
         * @param buttonText optional. Curstom text for the Submit-Button
         * @param css optional. Custom CSS for the form
         * @param script optional. Custom javascript for the form
         */
        this.addToSidebar = (html, headline, callback, buttonText, css, script) => __awaiter(this, void 0, void 0, function* () {
            this._panel.webview.html = this._getBaseHTML();
            this._sidebarCallback = callback;
            this._addToHTML("FORM_END", html);
            if (headline !== undefined && headline !== "") {
                this._addToHTML("HEADLINE", `<h2>${headline}</h2>`);
            }
            var closeButtonRessource = this._helper.getWebviewResourceIconURI("close.svg", this._context);
            this._addToHTML("CANCEL", `<br><button id='cancel' value="cancel" onclick='sendMessageCancel()' title='cancel'><img src='${closeButtonRessource}'></button>`);
            if (buttonText !== undefined) {
                this._addToHTML("BUTTON", `<input type="submit" value="${buttonText}">`);
            }
            else {
                var standardButtonText = this._language.get("ok");
                this._addToHTML("BUTTON", `<input type="submit" value="${standardButtonText}">`);
            }
            if (css !== undefined) {
                this._addToHTML("CSS", css);
            }
            if (script !== undefined) {
                this._addToHTML("SCRIPT", script);
            }
            this.focus(); //gives the focus to the sidebar so people can use tab, usw.
        });
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
        /** Gets the base HTML for the sidebar
         * @returns base HTML
         */
        this._getBaseHTML = () => {
            var style = this._helper.getWebviewResourceURI("sidebar.css", "style", this._context);
            var script = this._snippets.get("sidebarBaseHTMLScript");
            return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AGSBS Sidebar</title>
                <link rel="stylesheet" href="${style}">
                <style>
                <!--CSS-->
                </style>
            </head>
            <body>  
            <!--CANCEL-->
                <!--HEADLINE-->
                
                <form id="inputForm">
               <!--FORM_START-->
               <!--FORM_END-->
               
               <!--BUTTON-->
                </form>
                <script>
                <!--SCRIPT-->
                </script>
                
                <script>
                ${script}
                </script>
            </body>
        </html>
        `;
        };
        /**
         * Adds a welcome message if the extension is opened for the first time
         */
        this._addWelcomeMessage = () => __awaiter(this, void 0, void 0, function* () {
            var matucIsInstalled = yield this._matuc.matucIsInstalled();
            var welcomeText = this._language.get("sidebarWelcome");
            var form = "<h2>" + welcomeText + "</h2>";
            form = this._addMultipleText(["textWhatToDo", "sendingError"], form);
            if (matucIsInstalled === false) {
                form += "<br role='none'><br role='none'>" + this._language.get("MatucIsInstalledWarning");
            }
            this._wasOpenendBefore = true;
            this._addToHTML("HEADLINE", form);
        });
        this._sidebarIsVisible = false;
        this._context = context;
        this._helper = new helper_1.default();
        this._panel = null;
        this._sidebarCallback = null;
        this._snippets = new sidebarSnippets_1.default;
        this._matuc = new matucCommands_1.default;
        this._language = new languages_1.default;
        this._wasOpenendBefore = false;
        let disposable = vscode.commands.registerCommand("agsbs.focusSidebar", () => {
            this.focus();
        });
    }
    /**
     * Returns the current State of visibility of the Sidebar.
     * @return The current visibility from type Boolean.
     */
    isVisible() {
        return this._sidebarIsVisible;
    }
    /**
     * Puts the focus on the sidebar.
     */
    focus() {
        this._panel.reveal(this._panel.viewColumn);
    }
    /**
     * Opens a Sidebar Webview
     * @return A promise that resolves to a WebviewPanel from Type vscode.WebviewPanel
     */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._sidebarIsVisible = true;
                var panel = vscode.window.createWebviewPanel('agsbssidebar', // Identifies the type of the webview. Used internally
                "AGSBS Sidebar", // Title of the panel displayed to the user
                //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
                {
                    viewColumn: vscode.ViewColumn.Two,
                    preserveFocus: true
                }, {
                    enableScripts: true
                } // Webview options.
                );
                panel.webview.html = this._getBaseHTML();
                panel.onDidDispose(() => {
                    this._sidebarIsVisible = false; //When panel is closed
                    this._panel = null;
                }, null);
                panel.webview.onDidReceiveMessage(message => {
                    if (message.hasOwnProperty('text')) {
                        this._messageFromWebviewHandler(message);
                    }
                    else {
                        if (message.hasOwnProperty('cancel')) {
                            this._panel.webview.html = this._getBaseHTML();
                        }
                    }
                }, undefined);
                this._panel = panel;
                if (this._wasOpenendBefore === false) {
                    this._addWelcomeMessage();
                }
                resolve(panel); //return panel
            }));
        });
    }
    /**
     * Gets triggered when the Layout of the Editor changes.
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     * @returns a promise that resolves to true if its finished.
     */
    hide(panel) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield panel.dispose();
                this._sidebarIsVisible = false;
                this._panel = null;
                resolve(true);
            }));
        });
    }
    /**
     * Create multiple paragraph basing on a string list and returns new element
     *  @param textList the string list
     *  @param element where the paragraph should be appended
     */
    _addMultipleText(textList, element) {
        textList.forEach(item => {
            element += "<p>" + this._language.get(item) + "</p>";
        });
        return element;
    }
}
exports.default = Sidebar;
//# sourceMappingURL=sidebar.js.map