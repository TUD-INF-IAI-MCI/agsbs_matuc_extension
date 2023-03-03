/**
 * @author  Lucas Vogel
 */
import * as vscode from "vscode";
import Helper from "./helper/helper";
import SettingsHelper from "./helper/settingsHelper";
import Sidebar from "./sidebar";
import Taskbar from "./taskbar";
import { EditorLayout } from "./types/types";
import { ConfigurationTarget, workspace } from 'vscode';

/**
 * Gets triggered when the Extension is activated
 * @param context Context of the extension, gets automatically handed over from VSCode at activation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log("AGSBS extension is now active!");   
    const extensionController = new ExtensionController(context);
    const disposable = vscode.commands.registerCommand("agsbs.open", () => {
        vscode.window.showInformationMessage("AGSBS is active.");
        extensionController.showSidebar();
    });

    vscode.commands.registerCommand("agsbs.clone", () => {
        //this.extensionController.showSidebar();
        vscode.commands.executeCommand("agsbs.showGitView");
    });
    context.subscriptions.push(extensionController);
    context.subscriptions.push(disposable);
}

/**
 * this method is called when your extension is deactivated
 */
export function deactivate() {
    vscode.window.showInformationMessage("AGSBS deactivated.");
}

/**
 * Orchestrates Updates and all open Panels
 */
class ExtensionController {
    private _layout: EditorLayout;
    private _defaultLayout: EditorLayout;
    private _helper: Helper;

    private _taskbar: Taskbar;
    private _taskbarPanel: any;

    private _sidebar: Sidebar;
    private _sidebarPanel: vscode.WebviewPanel;

    private _settingsHelper: SettingsHelper;

    private _disposable: vscode.Disposable;

    disposable = vscode.commands.registerCommand("agsbs.focusDocument", () => {
        this._helper.focusDocument();
    });

    public getSidebarPanel(params) {
        console.log("RETURN PANEL" + params);
        return this._sidebarPanel;
    }

    constructor(context: vscode.ExtensionContext) {
        const sidebar = new Sidebar(context);
        const taskbar = new Taskbar(sidebar, context);
        const helper = new Helper();
        this._settingsHelper = new SettingsHelper();
        this._settingsHelper.setup(); //If settings are not set, this will initialize them
        // layout für den Editor in Prozent
        // orientation 1 = zeilen, das andere ist vllt. 0
        // group 0.15 verändert untere Bereich
        // summe muss 1.0 ergeben
        this._layout = {
            orientation: 1,
            groups: [{ groups: [{ size: 0.8 }, { size: 0.2 }], size: 0.85 }, { size: 0.15 }]
        };
        this._defaultLayout = { orientation: 1, groups: [{}] };
        this._helper = helper;

        this._taskbar = taskbar;
        this._sidebar = sidebar;

        const subscriptions: vscode.Disposable[] = []; //Create Disposable for Event subscriptions
        vscode.window.onDidChangeActiveTextEditor(this._update, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
        this._update();
    }
    dispose() {
        this._disposable.dispose();
    }

    /**
     * Shows Side bar
     */
    public async showSidebar() {
        if (this._sidebar.isVisible() === false) {
            this._sidebarPanel = await this._sidebar.show();
        }
    }

    /**
     * Gets triggered when the Layout of the Editor changes.
     */
    private async _update() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            //If no Editor is open, return.
            return;
        }
        const doc = editor.document;
        if (doc.languageId === "markdown" || doc.languageId === "multimarkdown") {
            //Set centered layout auto resize to false
            const config = vscode.workspace.getConfiguration("workbench");
            config.update("editor.centeredLayoutAutoResize", false, ConfigurationTarget.Global);
            //This gets executed if a Markdown File gets opened
            //First, reset Workspace
            if (this._sidebar.isVisible() === false || this._taskbar.isVisible() === false) {
                await this._helper.setEditorLayout(this._layout);
            }
            if (this._sidebar.isVisible() === false && this._taskbar.isVisible()) {
                //If Sidebar is closed but Taskbar is open, close Taskbar to reset
                await this._taskbar.hide(this._taskbarPanel);
            }
            if (this._sidebar.isVisible() && this._taskbar.isVisible() === false) {
                //If Sidebar is open but Taskbar is closed, close Sidebar to reset
                await this._sidebar.hide(this._sidebarPanel);
            }

            if (this._sidebar.isVisible() === false) {
                this._sidebarPanel = await this._sidebar.show();
            }
            if (this._taskbar.isVisible() === false) {
                this._taskbarPanel = await this._taskbar.show();
            }
        } else {
            //TODO: BUG when closing both panels, this should be reported as an Issue to VSCODE because an error is thrown in the core
            //This will crash the Extension debugging Host forever and will force you to reinstall VSCODE from scratch. Seriously.
            //Read the docs.
            //await this._sidebar.hide(this._sidebarPanel);
        }
    }
}
