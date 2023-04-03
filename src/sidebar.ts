/**
 * @author  Lucas Vogel
 */
import * as vscode from "vscode";
import Helper from "./helper/helper";
import Language from "./languages";
import SidebarSnippets from "./snippets/sidebarSnippets";
import MatucCommands from "./matucCommands";
import { showNotification } from "./helper/notificationHelper";

type SidebarSection = "HEADLINE" | "BUTTON" | "FORM_START" | "FORM_END" | "CANCEL" | "CSS" | "SCRIPT";

/**
 * The main class of the sidebar.
 */
export default class Sidebar {
    private _sidebarIsVisible: boolean;
    private _language: Language;
    private _context: vscode.ExtensionContext;
    private _helper: Helper;
    private _panel: vscode.WebviewPanel;
    private _sidebarCallback: (any) => void;
    private _snippets: SidebarSnippets;
    private _matuc: MatucCommands;
    private _wasOpenendBefore: boolean;
    constructor(context) {
        this._sidebarIsVisible = false;
        this._context = context;
        this._helper = new Helper();
        this._panel = null;
        this._sidebarCallback = null;
        this._snippets = new SidebarSnippets();
        this._matuc = new MatucCommands(this);
        this._language = new Language();
        this._wasOpenendBefore = false;

        vscode.commands.registerCommand("agsbs.focusSidebar", () => {
            this.focus();
        });
    }

    /**
     * Returns the current State of visibility of the Sidebar.
     * @return The current visibility from type Boolean.
     */
    public isVisible() {
        return this._sidebarIsVisible;
    }

    /**
     * Puts the focus on the sidebar.
     */
    public focus() {
        this._panel.reveal(this._panel.viewColumn);
    }

    /**
     * Opens a Sidebar Webview
     * @return A promise that resolves to a WebviewPanel from Type vscode.WebviewPanel
     */
    public show(): vscode.WebviewPanel {
        this._sidebarIsVisible = true;
        const panel = vscode.window.createWebviewPanel(
            "agsbssidebar", // Identifies the type of the webview. Used internally
            "AGSBS Sidebar", // Title of the panel displayed to the user
            //vscode.ViewColumn.X, // Editor column to show the new webview panel in.
            {
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: true
            },
            {
                enableScripts: true
            } // Webview options.
        );
        panel.webview.html = this._getBaseHTML();
        panel.onDidDispose(() => {
            this._sidebarIsVisible = false; //When panel is closed
            this._panel = null;
        }, null);
        panel.webview.onDidReceiveMessage((message) => {
            //If the Webview sends a Message
            if (message.hasOwnProperty("text")) {
                this._messageFromWebviewHandler(message);
            } else {
                if (message.hasOwnProperty("cancel")) {
                    this._panel.webview.html = this._getBaseHTML();
                }
            }
        }, undefined);
        this._panel = panel;

        if (this._wasOpenendBefore === false) {
            this._addWelcomeMessage();
            this._addOnboardingSettings();
        }

        return panel; //return panel
    }

    /**
     * Does the Callback to the EditorFunctions
     * @param message from Webview
     */
    private _messageFromWebviewHandler = (message) => {
        if (message.command === "setSettings") this.updateSettings(message.text.key, message.text.value);
        else {
            this._sidebarCallback(JSON.parse(message.text));
            this._panel.webview.html = this._getBaseHTML(); // erase the contents of the sidebar
            this._helper.focusDocument();
        }
    };

    /**
     * Gets triggered when the Layout of the Editor changes.
     * @param panel The WebviewPanel that should be closed, from fype vscode.WebviewPanel
     * @returns a promise that resolves to true if its finished.
     */
    public async hide(panel: vscode.WebviewPanel): Promise<boolean> {
        await panel.dispose();
        this._sidebarIsVisible = false;
        this._panel = null;
        return true;
    }

    /**
     * Adds a HTML-snippet to the Sidebar.
     * @param html a HTML form snippet. IMPORTANT: do NOT add <form> tags, only the items. ALSO: adding names to every item is MANDATORY
     * @param callback the function callback called when the form is submitted
     * @param buttonText optional. Curstom text for the Submit-Button
     * @param css optional. Custom CSS for the form
     * @param script optional. Custom javascript for the form
     */
    public addToSidebar = async ({
        html,
        headline,
        callback,
        buttonText,
        css,
        script
    }: {
        html: string;
        headline: string;
        callback?: (any) => Promise<void | boolean>;
        buttonText?: string;
        css?: string;
        script?: string;
    }): Promise<void> => {
        this._panel.webview.html = this._getBaseHTML();
        this._sidebarCallback = callback;
        this._addToHTML("FORM_END", html);
        if (headline !== undefined && headline !== "") {
            this._addToHTML("HEADLINE", `<h2>${headline}</h2>`);
        }
        const closeButtonRessource = this._helper.getWebviewResourceIconURI("close.svg", this._context);
        this._addToHTML(
            "CANCEL",
            `<br><button id='cancel' value="cancel" onclick='sendMessageCancel()' title='cancel'><img src='${closeButtonRessource}'></button>`
        );
        if (buttonText !== undefined) {
            this._addToHTML("BUTTON", `<input type="submit" value="${buttonText}">`);
        } else {
            const standardButtonText = this._language.get("ok");
            this._addToHTML("BUTTON", `<input type="submit" value="${standardButtonText}">`);
        }
        if (css !== undefined) {
            this._addToHTML("CSS", css);
        }
        if (script !== undefined) {
            this._addToHTML("SCRIPT", script);
        }
        this.focus(); //gives the focus to the sidebar so people can use tab, usw.
    };

    /** This adds HTML to the taskbars Webview, at the given point.
     * This point is predefined in the _getBaseHTML-Function and _generateSectionHTML, for example SECTION-*, HEAD_END, BODY_START or BODY_END
     * @param section section Name, see examples above
     * @param html html to insert
     */
    private _addToHTML = (section: SidebarSection, html: string) => {
        const marker = "<!--" + section + "-->";
        const oldHTML = this._panel.webview.html;
        html = html + marker;
        const newHTML = oldHTML.replace(marker, html);
        this._panel.webview.html = newHTML;
    };

    /** Gets the base HTML for the sidebar
     * @returns base HTML
     */
    private _getBaseHTML = () => {
        const style = this._helper.getWebviewResourceURI("sidebar.css", "style", this._context);
        const script = this._snippets.get("sidebarBaseHTMLScript");
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
    private _addWelcomeMessage = async () => {
        const matucIsInstalled = await this._matuc.matucIsInstalled();
        const welcomeText = this._language.get("sidebarWelcome");
        let form = "<h2>" + welcomeText + "</h2>";
        const versionNumberText = this._language.get("versionNumber");
        form +=
            "<br /> " +
            versionNumberText.replace(
                "$versionNumber$",
                vscode.extensions.getExtension("TUD-AGSBS.agsbsextension").packageJSON.version
            );
        form = this._addMultipleText(["textWhatToDo", "sendingError"], form);
        if (matucIsInstalled === false) {
            form += "<br role='none'><br role='none'>" + this._language.get("MatucIsInstalledWarning");
        }
        this._wasOpenendBefore = true;
        this._addToHTML("HEADLINE", form);
    };

    /**
     * Create multiple paragraph basing on a string list and returns new element
     *  @param textList the string list
     *  @param element where the paragraph should be appended
     */
    private _addMultipleText(textList, element) {
        textList.forEach((item) => {
            element += "<p>" + this._language.get(item) + "</p>";
        });
        return element;
    }

    /**
     * Add onboarding settings to the sidebar,
     * "agsbs.gitLocalPath": "C:\\Users\\USER\\Documents\\AGSBS_Git",
     *  "agsbs.gitServerPath": "USER.inf.tu-dresden.de/srv/git/REPO",
     *  "agsbs.gitUserEmail": "MAIL",
     *  "agsbs.gitUserName": "NAME",
     *  "agsbs.gitLoginName": "GITLOGIN",
     */

    private _addOnboardingSettings = async () => {
        const gitLocalPath = vscode.workspace.getConfiguration("agsbs").get("gitLocalPath") as string;
        const gitServerPath = vscode.workspace.getConfiguration("agsbs").get("gitServerPath") as string;
        const gitUserEmail = vscode.workspace.getConfiguration("agsbs").get("gitUserEmail") as string;
        const gitUserName = vscode.workspace.getConfiguration("agsbs").get("gitUserName") as string;
        const gitLoginName = vscode.workspace.getConfiguration("agsbs").get("gitLoginName") as string;

        interface Settings {
            gitLocalPath: string;
            gitServerPath: string;
            gitUserEmail: string;
            gitUserName: string;
            gitLoginName: string;
        }

        const settings: Settings = {
            gitLocalPath: gitLocalPath,
            gitServerPath: gitServerPath,
            gitUserEmail: gitUserEmail,
            gitUserName: gitUserName,
            gitLoginName: gitLoginName
        };

        // create a row for each setting
        let settingsForm = `
        <form id="inputForm">
        `;
        for (let i = 0; i < Object.keys(settings).length; i++) {
            const key = Object.keys(settings)[i];
            const value = Object.values(settings)[i];

            settingsForm += `
            <span class="label"> agsbs.${key}: </span>
            <div class="settingsInputRowWrapper">
            <div class="inputFieldWrapper">
                <input id='${key}' type='text' class="inputText" name='${key}' placeholder="${value}"/>
                <input id='${key}UndoButton' class='undoButton' type='button' title='${value}' onClick='applySetting(\"${key}\", \"${value}\")' value="${this._language.get(
                "undoBtnText"
            )}"/>
            </div>
            <input id='${key}Button' class='setButton' type='button' onClick='onSetClick(\"${key}\")' value="${this._language.get(
                "set"
            )}"/>
            </div>
            `;
        }

        settingsForm += `
        </form>
        `;

        // set user settings on submit
        const script = `
        onSetClick = (setting) => {
            const settingsKey = setting;
            const settingsValue = document.getElementById(setting).value;
            if(settingsValue === '' ) { return; }
            applySetting(settingsKey, settingsValue);
        };

        applySetting = (settingsKey, settingsValue) => {
            vscode.postMessage({
                command: 'setSettings',
                text: { key: settingsKey, value: settingsValue },
            });
            console.log('send setting: ' + settingsKey + ' ' + settingsValue)
        }
        `;

        const css = `
        .label {
            font-size: 14px;
            font-weight: bold;
        }
        .settingsInputRowWrapper { 
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0px 10px 0px;
            max-width: 500px;
        }

        .inputText{
            margin-top: 0 !important; // override default margin from sidebar.css
        }

        .setButton {
            border-radius: 2px;
            width: 50px;
            height: 100%;
            padding: 5px;
            margin-left: 15px;
            background-color: #0099FF;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            outline: none;
        }
        .setButton:hover {
            background-color: #0066CC;
            box-shadow: 0 0 5px 0 #0066CC;
        }
        .setButton:focus {
            outline: none;
        }
        .setButtonSuccess {
            background-color: #99FF00;
            color: black;
        }
        .inputFieldWrapper {
            position: relative;
            display: inline-block;    
            flex: 1;
        }
        .undoButton {
            cursor: pointer;
            background: #002843;
            border: 0;
            border-radius: 2px;
            color: white;
            padding: 2px 7px;
            position: absolute;
            right: 5px;
            top: 3.25px;
            width: auto !important;
            visibility: hidden;
        }
        .visible {
            visibility: visible;
        }

        `;

        this._addToHTML("FORM_START", settingsForm);
        this._addToHTML("SCRIPT", script);
        this._addToHTML("CSS", css);
    };
    private updateSettings(key: string, value: string) {
        if (!key || !value) return;
        const configuration = vscode.workspace.getConfiguration();
        const target = vscode.ConfigurationTarget.Global;
        configuration.update(`agsbs.${key}`, value, target, false);
        showNotification({ message: `Set ${key} to ${value}` });

        // find button with key in html and replace value with "Set!"
        const html = this._panel.webview.html;
        // find button with id=`${key}Button`
        const button = html.match(new RegExp(`<input id='${key}Button(?=[\"\'])[^>]*?/>`));

        // replace value with "Set!"
        let newButton = button[0].replace(/value=".*?"/, `value="Set!"`);
        // add class "setButtonSuccess" to button classes
        newButton = newButton.replace(/class=(['"])(.*?)\1/, `class='$2 setButtonSuccess'`);
        // replace button in html
        let newHtml = html.replace(button[0], newButton);

        // find input with id=`${key}` and replace placeholder with value and remove value
        const input = html.match(new RegExp(`<input id='${key}'.*?/>`));
        let newInput = input[0].replace(/placeholder=".*?"/, `placeholder="${value}"`);
        newInput = newInput.replace(/value=".*?"/, ``);

        // find undo button with id=`${key}UndoButton`
        const undoButton = html.match(new RegExp(`<input id='${key}UndoButton(?=[\"\'])[^>]*?/>`));
        // add visible class to undo button
        const newUndoButton = undoButton[0].replace(/class=(['"])(.*?)\1/, `class='$2 visible'`);

        // replace undo button in html
        newHtml = newHtml.replace(undoButton[0], newUndoButton);

        // replace input in html
        newHtml = newHtml.replace(input[0], newInput);

        this._panel.webview.html = newHtml;
    }
}
