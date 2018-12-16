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
const path = require("path");
const fs = require("fs");
const languages_1 = require("./languages");
class Helper {
    constructor() {
        this._language = new languages_1.default;
    }
    /**
     * Sets the Editor layout to the given specifications
     * @param layout Object of the Editor Layout
     */
    setEditorLayout(layout) {
        vscode.commands.executeCommand('vscode.setEditorLayout', layout);
    }
    focusDocument(editor) {
        var editor;
        return __awaiter(this, void 0, void 0, function* () {
            if (editor === undefined) {
                editor = yield this.getCurrentTextEditor();
            }
            vscode.window.showTextDocument(editor.document, editor.viewColumn);
        });
    }
    /**
     * Returns the path to the current document
     */
    getCurrentDocumentFolderPath() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const textEditors = yield vscode.window.visibleTextEditors;
                if (textEditors.length < 1) {
                    vscode.window.showErrorMessage(this._language.get('noOpenEditors'));
                    resolve(null);
                }
                if (textEditors.length > 1) {
                    vscode.window.showErrorMessage(this._language.get('tooManyOpenEditors'));
                    resolve(null);
                }
                var currentTextEditor = textEditors[0];
                var currentDocumentFileName = currentTextEditor.document.fileName;
                var currentPath = currentDocumentFileName.substr(0, currentDocumentFileName.lastIndexOf(path.sep)); //Seperates the file name from the folder and returns only the folder string
                //(currentPath.toString());
                resolve(currentPath.toString());
            }));
        });
    }
    /**
     * Returns the last active TextEditor and returns it. In case of an error it will promt an Error to the user.
     * @returns current Text Editor or null if it cannot be determined
     */
    getCurrentTextEditor() {
        return __awaiter(this, void 0, void 0, function* () {
            const textEditors = yield vscode.window.visibleTextEditors;
            if (textEditors !== undefined) {
                if (textEditors.length < 1) {
                    vscode.window.showErrorMessage(this._language.get('noOpenEditors'));
                    return null;
                }
                if (textEditors.length > 1) {
                    vscode.window.showErrorMessage(this._language.get('tooManyOpenEditors'));
                    return null;
                }
                var currentTextEditor = textEditors[0];
                if (currentTextEditor.document.languageId !== "markdown") {
                    vscode.window.showErrorMessage(this._language.get('ActionErrorNotMarkdown'));
                    return null;
                }
                return currentTextEditor;
            }
        });
    }
    /**
     * Returns the primary Selection of the given Text Editor
     * @param textEditor from type vscode.TextEditor, the TextEditor the selection is returned from
     */
    getPrimarySelection(textEditor) {
        return textEditor.selection;
    }
    getWordsSelection(textEditor) {
        var selection = this.getPrimarySelection(textEditor);
        var newSelection;
        if (selection.isEmpty) {
            var wordRange = textEditor.document.getWordRangeAtPosition(selection.active);
            if (wordRange !== undefined) { //if there is no actual selection, but a marked word
                newSelection = new vscode.Selection(wordRange.start, wordRange.end);
            }
            else { //if there is no actual selection and also no marked word
                newSelection = new vscode.Selection(selection.start, selection.end);
            }
        }
        else { //if there is a selection
            newSelection = new vscode.Selection(selection.start, selection.end);
        }
        return newSelection;
    }
    /**
     * Inserts a given string at the start of a selection
     * @param charactersToInsert string that will be inserted
     * @param currentTextEditor the current text editor
     * @param selection the current selection
     */
    insertStringAtStartOfSelection(charactersToInsert, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.insert(currentTextEditor.document.uri, selection.start, charactersToInsert);
            yield vscode.workspace.applyEdit(workSpaceEdit);
        });
    }
    /**
     * Insert a String if characters at the beginning of the line of the selection.
     * @param charactersToInsert a string of characters to insert at the beginning
     * @param currentTextEditor optional. The text editor to work with
     * @param selection optional. the selection to work with
     */
    insertStringAtStartOfLine(charactersToInsert, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            const workSpaceEdit = new vscode.WorkspaceEdit();
            if (selection.start.character !== 0) {
                var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
                selection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineStart);
            }
            workSpaceEdit.insert(currentTextEditor.document.uri, selection.start, charactersToInsert);
            yield vscode.workspace.applyEdit(workSpaceEdit);
        });
    }
    /**
     * Inserts a string at the start of a Line if the current Line is empty, or at a new line if it is not
     * @param charactersToInsert String of characters
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    insertStringAtStartOfLineOrLinebreak(charactersToInsert, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            var lineLength = currentTextEditor.document.lineAt(selection.end.line).range.end.character;
            if (lineLength === 0) {
                var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
                selection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineStart);
            }
            else {
                var newStartPositionAtLineEnd = new vscode.Position(selection.end.line, lineLength);
                selection = new vscode.Selection(newStartPositionAtLineEnd, newStartPositionAtLineEnd);
                charactersToInsert = "\n" + charactersToInsert;
            }
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.insert(currentTextEditor.document.uri, selection.start, charactersToInsert);
            yield vscode.workspace.applyEdit(workSpaceEdit);
        });
    }
    /**
     * Wraps Characters around the current selected Area.
     * @param currentTextEditor The TextEditor the Document is housed in
     * @param position Start and End of the Selection
     * @param startCharacters Characters that will be added at the beginning of the selection
     * @param endCharacters  Characters that will be added at the end of the selection
     */
    wrapCharactersAroundSelection(currentTextEditor, selection, startCharacters, endCharacters) {
        return __awaiter(this, void 0, void 0, function* () {
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.insert(currentTextEditor.document.uri, selection.start, startCharacters);
            workSpaceEdit.insert(currentTextEditor.document.uri, selection.end, endCharacters);
            yield vscode.workspace.applyEdit(workSpaceEdit);
        });
    }
    /**
     * Deletes given character lengths from the start and end of a selection
     * @param currentTextEditor the given Text Editor
     * @param selection the selection the edits will be made on
     * @param numberStartCharacters number of characters that will be sliced at the beginning
     * @param numberEndCharacters  number of characters that will be sliced at the end
     */
    deleteCharactersInSelection(currentTextEditor, selection, numberStartCharacters, numberEndCharacters) {
        return __awaiter(this, void 0, void 0, function* () {
            var startPointStart = selection.start;
            var startPointEnd = selection.start.translate(0, numberStartCharacters);
            var start = new vscode.Range(startPointStart, startPointEnd);
            var endPointStart = selection.end.translate(0, -1 * numberEndCharacters);
            var endPointEnd = selection.end;
            var end = new vscode.Range(endPointStart, endPointEnd);
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.delete(currentTextEditor.document.uri, start);
            workSpaceEdit.delete(currentTextEditor.document.uri, end);
            yield vscode.workspace.applyEdit(workSpaceEdit);
        });
    }
    /**
     * checks if the given selection has the given characters at the beginning and end
     * @param currentTextEditor the given Text Editor
     * @param selection the Selection the check will be made on
     * @param startCharacters the start Characters that will be checked
     * @param endCharacters  the end Characters that will be checked
     */
    checkStringForMarkersAtBeginningAndEnd(currentTextEditor, selection, startCharacters, endCharacters) {
        return __awaiter(this, void 0, void 0, function* () {
            var selectedText = currentTextEditor.document.getText(selection);
            if (selectedText === undefined) {
                return false;
            }
            if ((startCharacters.length + endCharacters.length) > selectedText.length) {
                return false; //if the selected text is shorter than the Characters to check against
            }
            var textlength = selectedText.length;
            var startSubstring = selectedText.substr(0, startCharacters.length);
            var endSubstring = selectedText.substr((textlength - endCharacters.length), textlength);
            if (startCharacters === startSubstring && endCharacters === endSubstring) {
                return true;
            }
        });
    }
    /**
     * Toggles the existence of given Characters in a Selection, also checks around the selection for better matching
     * @param startCharacters Characters at the beginning of the selection that will be added or removed
     * @param endCharacters Characters at the end of the selection that will be added or removed
     * @param currentTextEditor optional. The given Text Editor
     * @param selection optional. The selection that will be edited and checked
     */
    toggleCharactersAtStartAndEnd(startCharacters, endCharacters, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            if (startCharacters.length === 0) {
                return false;
            }
            if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, selection, startCharacters, endCharacters)) === true) {
                //If they match immediately
                yield this.deleteCharactersInSelection(currentTextEditor, selection, startCharacters.length, endCharacters.length);
                return true;
            }
            //If they don't match
            var extendedSelection;
            if (selection.start.character >= startCharacters.length) { //Extend selection to the Left if it is possible
                extendedSelection = new vscode.Selection(selection.start.translate(0, -1 * startCharacters.length), selection.end);
                if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters)) === true) {
                    //Extended Selection, if the beginning was not selected
                    yield this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                    return true;
                }
            }
            if (selection.start.character >= (startCharacters.length + endCharacters.length)) { //Extend selection to the Left (stadt + endcharacters) if it is possible
                //reason: if there is nothing selected, and the button gets pressed, the cursor will jump at the end after the characters
                extendedSelection = new vscode.Selection(selection.start.translate(0, (-1 * startCharacters.length + -1 * endCharacters.length)), selection.end);
                if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters)) === true) {
                    //Extended Selection, if the beginning was not selected
                    yield this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                    return true;
                }
            }
            var lineLength = currentTextEditor.document.lineAt(selection.end.line).range.end.character;
            if (selection.end.character <= lineLength - endCharacters.length) { //Extend selection to the Right if it is possible
                extendedSelection = new vscode.Selection(selection.start, selection.end.translate(0, endCharacters.length));
                if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters)) === true) {
                    //Extended Selection, if the beginning was not selected
                    yield this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                    return true;
                }
            }
            if (selection.start.character >= startCharacters.length && selection.end.character <= lineLength - endCharacters.length) { //Extend selection in both directions if it is possible
                extendedSelection = new vscode.Selection(selection.start.translate(0, -1 * startCharacters.length), selection.end.translate(0, endCharacters.length));
                if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters)) === true) {
                    //Extended Selection, if the beginning was not selected
                    yield this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                    return true;
                }
            }
            if (selection.start.character >= startCharacters.length && selection.end.character <= lineLength - endCharacters.length) { //Extend selection to the full length of the line
                var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
                var newStartPositionAtLineEnd = new vscode.Position(selection.end.line, lineLength);
                extendedSelection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineEnd);
                if ((yield this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters)) === true) {
                    //Extended Selection, if the beginning was not selected
                    yield this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                    return true;
                }
            }
            //If they are different and the selection is not longer than the length of the startCharacters
            yield this.wrapCharactersAroundSelection(currentTextEditor, selection, startCharacters, endCharacters);
            return true;
        });
    }
    /**
     * Creates a custom File Resource URI that can be used in the Webview
     * @param name Name of the Icon WITH file extension. So for example "bold.png"
     * @param context Context of the Extension
     * @returns resource from type vscode.Uri
     */
    getWebviewResourceIconURI(name, context) {
        var ressource = this.getWebviewResourceURI(name, "icons", context);
        return ressource;
    }
    /**
     * Gets custom File Ressource URI for use in Webview.
     * @param name Name of the File with extension
     * @param folder Folder or Folder Structure the File is in
     * @param context Context of the Webview
     * @returns vscode URI for use in a WebView
     */
    getWebviewResourceURI(name, folder, context) {
        const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, folder, name));
        // And get the special URI to use with the webview
        const ressource = onDiskPath.with({ scheme: 'vscode-resource' });
        return ressource;
    }
    /** Generates a semi random UUID.
     * @returns a UUID.
     */
    generateUuid() {
        return 'xxxx-xxxx-xxx-yxxx-xxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * Returns the content of a given file
     * @param fileName the complete path to the file
     * @param encoding optional. If not set the default is utf-8
     * @returns string of the content
     */
    getContentOfFile(fileName, encoding) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (encoding === undefined) {
                    encoding = 'utf8';
                }
                if (fileName === "") {
                    vscode.window.showErrorMessage(this._language.get("readingFileError"));
                    reject();
                }
                fs.readFile(fileName, encoding, function (err, data) {
                    if (err) {
                        vscode.window.showErrorMessage(this._language.get("readingFileError"));
                        reject(err);
                    }
                    resolve(data);
                });
            }));
        });
    }
    /**
     * Checks if a selection starts with a given string
     * @param testText text to check if the selection begins with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    checkIfSelectionStartsWith(testText, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            if (testText === undefined || testText === "") {
                return false;
            }
            var selectedText = currentTextEditor.document.getText(selection);
            if (selectedText.startsWith(testText)) {
                return (true);
            }
            else {
                return (false);
            }
        });
    }
    /**
     * Checks if a selection ends with a given string
     * @param testText text to check if the selection begins with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    checkIfSelectionEndsWith(testText, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            if (testText === undefined || testText === "") {
                return false;
            }
            var selectedText = currentTextEditor.document.getText(selection);
            if (selectedText.endsWith(testText)) {
                return true;
            }
            selectedText = selectedText.replace(/\ +$/, ""); //removes trailing spaces
            if (selectedText.endsWith(testText)) {
                return true;
            }
            return false;
        });
    }
    /**
     * Iterates upwards from the given selection until it found a line that begins with the given test string, or the beginning of the file
     * @param testString text to check if the selection begins with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    iterateUpwardsToCheckForString(testString, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            var selectionStartLine = selection.start.line;
            var selectionStartsWith = yield this.checkIfSelectionStartsWith(testString, currentTextEditor, selection);
            if (selectionStartsWith === true) {
                return selection;
            }
            for (var i = selectionStartLine; i >= 0; i--) {
                var newStartPosition = new vscode.Position(i, 0);
                var newSelection = new vscode.Selection(newStartPosition, selection.end);
                selectionStartLine = selection.start.line;
                selectionStartsWith = yield this.checkIfSelectionStartsWith(testString, currentTextEditor, newSelection);
                if (selectionStartsWith === true) {
                    return newSelection;
                }
            }
            return false;
        });
    }
    /**
     * Iterates downwards from the given selection until it found a line that begins with the given test string, or the end of the file
     * @param testString text to check if the selection ends with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    iterateDownwardsToCheckForString(testString, currentTextEditor, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this.getWordsSelection(currentTextEditor);
            }
            var selectionStartLine = selection.end.line;
            var selectionStartsWith = yield this.checkIfSelectionEndsWith(testString, currentTextEditor, selection);
            if (selectionStartsWith === true) {
                return selection;
            }
            var documentEndLine = currentTextEditor.document.lineCount;
            for (var i = selectionStartLine; i < documentEndLine; i++) {
                var lineLength = currentTextEditor.document.lineAt(i).range.end.character;
                var newEndPosition = new vscode.Position(i, lineLength);
                var newSelection = new vscode.Selection(selection.start, newEndPosition);
                selectionStartLine = selection.start.line;
                selectionStartsWith = yield this.checkIfSelectionEndsWith(testString, currentTextEditor, newSelection);
                if (selectionStartsWith === true) {
                    return newSelection;
                }
            }
            return false;
        });
    }
}
exports.default = Helper;
//# sourceMappingURL=helper.js.map