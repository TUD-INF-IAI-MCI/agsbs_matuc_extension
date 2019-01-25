"use strict";
/**
 * @author  Lucas Vogel
 */
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
/**
 * Helper for the insert-functions.
 */
class InsertHelper {
    constructor() {
        /**
         * checks where the current page ends by searching for the start of a new page
         * @param selection optional. The selection to work with.
         * @param currentTextEditor optional. The text editor to work with.
         * @returns false if error, otherwise a point from type vscode.Position ending at the end of the page.
         */
        this.getPageEndLine = (selection, currentTextEditor) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (currentTextEditor === undefined) {
                    currentTextEditor = yield this._helper.getCurrentTextEditor();
                }
                if (selection === undefined) {
                    selection = this._helper.getWordsSelection(currentTextEditor);
                }
                var newpageString = this.getNewPageIdentifier();
                var newSelection = yield this.iterateDownwardsToCheckForStringStart(newpageString);
                if (newSelection !== false) {
                    if (selection.end.line > 0) { //if there is room above the line
                        var previousLineNumber = newSelection.end.line - 1;
                        var previousLineLength = currentTextEditor.document.lineAt(previousLineNumber).range.end.character;
                        var newEndPoint = new vscode.Position(previousLineNumber, previousLineLength);
                        resolve(newEndPoint);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            }));
        });
        this._helper = new helper_1.default;
    }
    /**
     * Returns the page identifier
     */
    getNewPageIdentifier() {
        return ("|| - Seite ");
    }
    /**
     * Iterates downwards starting at the current selection and checks if a line starts with a given string
     * @param testString String to test with
     * @param currentTextEditor optional. The Editor to work with
     * @param selection optional. The Selection to work with
     */
    iterateDownwardsToCheckForStringStart(testString, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this._helper.getWordsSelection(currentTextEditor);
            }
            var selectionStartLine = selection.end.line;
            var selectionStartsWith = yield this._helper.checkIfSelectionStartsWith(testString, currentTextEditor, selection);
            if (selectionStartsWith === true) {
                return selection;
            }
            var documentEndLine = currentTextEditor.document.lineCount;
            for (var i = selectionStartLine; i < documentEndLine; i++) {
                var lineLength = currentTextEditor.document.lineAt(i).range.end.character;
                var newStartPosition = new vscode.Position(i, 0);
                var newEndPosition = new vscode.Position(i, lineLength);
                var newSelection = new vscode.Selection(newStartPosition, newEndPosition);
                selectionStartLine = selection.start.line;
                selectionStartsWith = yield this._helper.checkIfSelectionStartsWith(testString, currentTextEditor, newSelection);
                if (selectionStartsWith === true) {
                    return newSelection;
                }
            }
            return false;
        });
    }
    /**
     * Checks the whole Document ot it includes a specific string.
     * @param testString String to test with
     * @param currentTextEditor optional. The Editor to work with.
     * @returns true if the string was found, otherwise false
     */
    checkDocumentForString(testString, currentTextEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            var documentText = currentTextEditor.document.getText();
            if (documentText.includes(testString)) {
                return true;
            }
            return false;
        });
    }
}
exports.default = InsertHelper;
//# sourceMappingURL=insertHelper.js.map