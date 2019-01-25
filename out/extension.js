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
const taskbar_1 = require("./taskbar");
const sidebar_1 = require("./sidebar");
const settingsHelper_1 = require("./helper/settingsHelper");
/**
 * Gets triggered when the Extension is activated
 * @param context Context of the extension, gets automatically handed over from VSCode at activation
 */
function activate(context) {
    console.log('AGSBS is now active!');
    let extensionController = new ExtensionController(context);
    let disposable = vscode.commands.registerCommand('agsbs.open', () => {
        vscode.window.showInformationMessage('AGSBS is active.');
    });
    context.subscriptions.push(extensionController);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
/**
 * this method is called when your extension is deactivated
 */
function deactivate() {
    vscode.window.showInformationMessage('AGSBS deactivated.');
}
exports.deactivate = deactivate;
/**
 * Orchestrates Updates and all open Panels
 */
class ExtensionController {
    getSidebarPanel(params) {
        console.log("RETURN PANEL" + params);
        return this._sidebarPanel;
    }
    constructor(context) {
        let sidebar = new sidebar_1.default(context);
        let taskbar = new taskbar_1.default(sidebar, context);
        let helper = new helper_1.default();
        this._settingsHelper = new settingsHelper_1.default;
        this._settingsHelper.setup(); //If settings are not set, this will initialize them
        this._layout = { orientation: 1, groups: [{ groups: [{ size: 0.8 }, { size: 0.2 }], size: 0.85 }, { size: 0.15 }] };
        this._defaultLayout = { orientation: 1, groups: [{}] };
        this._helper = helper;
        this._taskbar = taskbar;
        this._sidebar = sidebar;
        let subscriptions = []; //Create Disposable for Event subscriptions 
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
    _update() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode.window.activeTextEditor;
            if (!editor) { //If no Editor is open, return.
                return;
            }
            let doc = editor.document;
            if (doc.languageId === "markdown" || doc.languageId === "multimarkdown") { //This gets executed if a Markdown File gets opened
                //First, reset Workspace
                if (this._sidebar.isVisible() === false || this._taskbar.isVisible() === false) {
                    yield this._helper.setEditorLayout(this._layout);
                }
                if (this._sidebar.isVisible() === false && this._taskbar.isVisible() === true) {
                    //If Sidebar is closed but Taskbar is open, close Taskbar to reset
                    yield this._taskbar.hide(this._taskbarPanel);
                }
                if (this._sidebar.isVisible() === true && this._taskbar.isVisible() === false) {
                    //If Sidebar is open but Taskbar is closed, close Sidebar to reset
                    yield this._sidebar.hide(this._sidebarPanel);
                }
                if (this._sidebar.isVisible() === false) {
                    this._sidebarPanel = yield this._sidebar.show();
                }
                if (this._taskbar.isVisible() === false) {
                    this._taskbarPanel = yield this._taskbar.show();
                }
            }
            else {
                //TODO: BUG when closing both panels, this should be reported as an Issue to VSCODE because an error is thrown in the core
                //This will crash the Extension debugging Host forever and will force you to reinstall VSCODE from scratch. Seriously.
                //Read the docs.
                //await this._sidebar.hide(this._sidebarPanel);
                //await this._taskbar.hide(this._taskbarPanel); 
            }
        });
    }
}
//# sourceMappingURL=extension.js.map