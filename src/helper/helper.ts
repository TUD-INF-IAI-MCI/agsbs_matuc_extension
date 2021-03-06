/**
 * @author  Lucas Vogel
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Language from '../languages';
import * as Papa from 'papaparse';
import * as chardet from 'chardet';
import * as iconvLite from 'iconv-lite';

export default class Helper {
    private _language: Language;
    constructor() {
        this._language = new Language;


    }
    /**
     * Sets the Editor layout to the given specifications
     * @param layout Object of the Editor Layout
     */
    public async setEditorLayout(layout: Object) {
        return new Promise(async (resolve, reject) => {
            await vscode.commands.executeCommand('vscode.setEditorLayout', layout);
            resolve(true);
        });

    }

    /**
     * Puts the focus to the given editor
     * @param editor optional. Editor to focus.
     */
    public async focusDocument(editor?: vscode.TextEditor) {
        return new Promise(async (resolve, reject) => {
            if (editor === undefined) {
                var editor = await this.getCurrentTextEditor();
            }
            if(editor !== null){
                await vscode.window.showTextDocument(editor.document, editor.viewColumn, false);
            } else {
                //cause if repo is cloned and no editor is open
                await vscode.window.showWarningMessage(this._language.get("noEditorIsOpenCannotLoadDocument"));
            }
            resolve(true);
        });
    }

    /**
     * Returns the path to the current document
     */
    public async getCurrentDocumentFolderPath() {
        return new Promise(async (resolve, reject) => {
            const textEditors = await vscode.window.visibleTextEditors;
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
            var currentPath = currentDocumentFileName.substr(0, currentDocumentFileName.lastIndexOf(path.sep));
            resolve(currentPath.toString());
        });
    }

    /**
     * Returns the last active TextEditor and returns it. In case of an error it will promt an Error to the user.
     * @returns current Text Editor or null if it cannot be determined
     */
    public async getCurrentTextEditor() {

        const textEditors = await vscode.window.visibleTextEditors;
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
    }
    /**
     * Returns the primary Selection of the given Text Editor
     * @param textEditor from type vscode.TextEditor, the TextEditor the selection is returned from
     */
    public getPrimarySelection(textEditor: vscode.TextEditor) {
        return textEditor.selection;
    }
    public getWordsSelection(textEditor: vscode.TextEditor) {

        var selection = this.getPrimarySelection(textEditor);
        var newSelection: vscode.Selection;

        if (selection.isEmpty) {
            var wordRange = textEditor.document.getWordRangeAtPosition(selection.active);
            if (wordRange !== undefined) { //if there is no actual selection, but a marked word
                newSelection = new vscode.Selection(wordRange.start, wordRange.end);
            } else { //if there is no actual selection and also no marked word
                newSelection = new vscode.Selection(selection.start, selection.end);
            }
        } else { //if there is a selection
             newSelection = new vscode.Selection(selection.start, selection.end);

        }
        return newSelection;

    }
    /**
     * Look for next blank line after current cursor position
     * @param currentTextEditor the current text editor
     * @returns {int} number of next blank line
     */
    public async getNextBlankLineAfterPos(currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        var lineCount = currentTextEditor.document.lineCount;
        var currentLine = currentTextEditor.selection.active.line;
        for (var i = currentLine; i < lineCount;  i++){
            if (currentTextEditor.document.lineAt(i).isEmptyOrWhitespace){
                return i; // next blank line
            }
        }
        return lineCount + 1 ; // use end of file / editor
    }
    /**
     * Inserts a given string at the start of a selection
     * @param charactersToInsert string that will be inserted
     * @param currentTextEditor the current text editor
     * @param selection the current selection
     */
    public async insertStringAtStartOfSelection(charactersToInsert: any, currentTextEditor?: vscode.TextEditor, selection?: vscode.Range) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        const workSpaceEdit = new vscode.WorkspaceEdit();
        charactersToInsert = charactersToInsert.replace("images.html", "bilder.html"); //ToDo quick and dirty
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            charactersToInsert
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * Insert a string at each line of a selection
     * @param charactersToInsert string that will be inserted
     * @param currentTextEditor the current text editor
     * @param selection the current selection
     */
    public async insertStringAtStartOfForEachLineOfSelection(charactersToInsert?: any, currentTextEditor?: vscode.TextEditor, selection?: vscode.Range) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        if (charactersToInsert === undefined) {
            charactersToInsert = 0;
        }

        const workSpaceEdit = new vscode.WorkspaceEdit();
        var line; // line of selection
        for (line = selection.start.line; line <= selection.end.line; line++){
            charactersToInsert++;
            if ((await this.getLineContent(line)).length <= 0) { break;}
            workSpaceEdit.insert(
                currentTextEditor.document.uri,
                new vscode.Position(line, 0), charactersToInsert +". ");
        }
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * Insert a String if characters at the beginning of the line of the selection.
     * @param charactersToInsert a string of characters to insert at the beginning
     * @param currentTextEditor optional. The text editor to work with
     * @param selection optional. the selection to work with
     */
    public async insertStringAtStartOfLine(charactersToInsert: any, currentTextEditor?: vscode.TextEditor, selection?: vscode.Range) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        const workSpaceEdit = new vscode.WorkspaceEdit();
        if (selection.start.character !== 0) {
            var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
            selection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineStart);
        } else {
            // insert footnote after a string
            var nextBlankLine = await this.getNextBlankLineAfterPos();
            var newCursorPos = new vscode.Position(nextBlankLine +1, 0);
            selection = new vscode.Selection(newCursorPos, newCursorPos);
        }
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            charactersToInsert
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * Inserts a string at the start of a Line if the current Line is empty, or at a new line if it is not
     * @param charactersToInsert String of characters
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    public async insertStringAtStartOfLineOrLinebreak(charactersToInsert: any, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        var lineLength = currentTextEditor.document.lineAt(selection.end.line).range.end.character;


        if (lineLength === 0) {
            var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
            selection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineStart);
        } else {
            var newStartPositionAtLineEnd = new vscode.Position(selection.end.line, lineLength);
            selection = new vscode.Selection(newStartPositionAtLineEnd, newStartPositionAtLineEnd);
            charactersToInsert = "\n" + charactersToInsert;
        }
        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            charactersToInsert
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * Wraps Characters around the current selected Area.
     * @param currentTextEditor The TextEditor the Document is housed in
     * @param position Start and End of the Selection
     * @param startCharacters Characters that will be added at the beginning of the selection
     * @param endCharacters  Characters that will be added at the end of the selection
     */
    public async wrapCharactersAroundSelection(currentTextEditor: vscode.TextEditor, selection: vscode.Range, startCharacters: string, endCharacters: string) {
        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.start,
            startCharacters
        );
        workSpaceEdit.insert(
            currentTextEditor.document.uri,
            selection.end,
            endCharacters
        );
        var newLinesExtra = (startCharacters.match(/\n/g) || []).length; //Checks how many new lines there are
        var startLine = selection.start.line + newLinesExtra;
        var startCharacter = selection.start.character + startCharacters.length;
        if (newLinesExtra !== 0) {
            startCharacter = 0;
        }
        await vscode.workspace.applyEdit(workSpaceEdit);
        var newStartPosition = new vscode.Position(startLine, startCharacter);
        var newEndPosition = newStartPosition;
        if (selection.start.line !== selection.end.line) {
            newEndPosition = new vscode.Position(selection.end.line + newLinesExtra, selection.end.character);
        } else {
            var selectionLength = selection.end.character - selection.start.character;
            newEndPosition = new vscode.Position(selection.start.line + newLinesExtra, startCharacter + selectionLength);
        }
        var newSelection = new vscode.Selection(newStartPosition, newEndPosition);
        return newSelection;
        //currentTextEditor.selection = newSelection;
    }

    /**
     * Deletes given character lengths from the start and end of a selection
     * @param currentTextEditor the given Text Editor
     * @param selection the selection the edits will be made on
     * @param numberStartCharacters number of characters that will be sliced at the beginning
     * @param numberEndCharacters  number of characters that will be sliced at the end
     */
    public async deleteCharactersInSelection(currentTextEditor: vscode.TextEditor, selection: vscode.Range, numberStartCharacters: number, numberEndCharacters: number) {
        var startPointStart = selection.start;
        var startPointEnd = selection.start.translate(0, numberStartCharacters);
        var start = new vscode.Range(startPointStart, startPointEnd);
        var endPointStart = selection.end.translate(0, -1 * numberEndCharacters);
        var endPointEnd = selection.end;
        var end = new vscode.Range(endPointStart, endPointEnd);

        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.delete(
            currentTextEditor.document.uri,
            start
        );
        workSpaceEdit.delete(
            currentTextEditor.document.uri,
            end
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * checks if the given selection has the given characters at the beginning and end
     * @param currentTextEditor the given Text Editor
     * @param selection the Selection the check will be made on
     * @param startCharacters the start Characters that will be checked
     * @param endCharacters  the end Characters that will be checked
     */
    public async checkStringForMarkersAtBeginningAndEnd(currentTextEditor: vscode.TextEditor, selection: vscode.Range, startCharacters: string, endCharacters: string) {
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
    }

    /**
     * Toggles given Characters at the beginning of a line
     * @param characters characters that should be toggled
     * @param line optional. Line to work with
     * @param currentTextEditor optional. Editor to work with
     */
    public async toggleCharactersAtBeginningOfLine(characters: string, line?: number, currentTextEditor?: vscode.TextEditor) {
        if (!characters) { return; }
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (line === undefined) {
            var selection = this.getWordsSelection(currentTextEditor);
            line = selection.start.line;
        }
        // check for tailing whitespace
        if (characters[characters.length - 1] !== " ") {
            characters = characters + " ";
        }
        var lineText = currentTextEditor.document.lineAt(line).text;
        var startSubstring = lineText.substr(0, characters.length);
        if (startSubstring === characters) {
            const workSpaceEdit = new vscode.WorkspaceEdit();
            for (line = selection.start.line; line <= selection.end.line; line++){
                if ((await this.getLineContent(line)).length <= 0) { break;}
                var characterSelection = new vscode.Selection(new vscode.Position(line, 0),
                                         new vscode.Position(line, characters.length));
                await workSpaceEdit.delete(
                    currentTextEditor.document.uri,
                    characterSelection
                );
            }

            await vscode.workspace.applyEdit(workSpaceEdit);
        } else {
            const workSpaceEdit = new vscode.WorkspaceEdit();
            var i;
            for (i = selection.start.line; i <= selection.end.line; i++){
                if ((await this.getLineContent(i)).length <= 0) { break;}
                workSpaceEdit.insert(
                    currentTextEditor.document.uri,
                    new vscode.Position(i,0), characters
                );
            }

            await vscode.workspace.applyEdit(workSpaceEdit);
        }

    }

    public async multiCursorsToggleCharactersAtStartAndEnd(startCharacters: string, endCharacters: string,
        currentTextEditor?: vscode.TextEditor, selection?: vscode.Range) {
        var newSelections = [];
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        var i;
        var selections = currentTextEditor.selections;
        for (i = 0; i < selections.length; i++) {
            newSelections.push(await this.toggleCharactersAtStartAndEnd(startCharacters, endCharacters, currentTextEditor,
                selections[i]));
        }
        currentTextEditor.selections = newSelections;
    }

    /**
     * Toggles the existence of given Characters in a Selection, also checks around the selection for better matching
     * @param startCharacters Characters at the beginning of the selection that will be added or removed
     * @param endCharacters Characters at the end of the selection that will be added or removed
     * @param currentTextEditor optional. The given Text Editor
     * @param selection optional. The selection that will be edited and checked
     */
    public async toggleCharactersAtStartAndEnd(startCharacters: string, endCharacters: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Range) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        if (startCharacters.length === 0) {
            return false;
        }

        if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, selection, startCharacters, endCharacters) === true) {
            //If they match immediately
            await this.deleteCharactersInSelection(currentTextEditor, selection, startCharacters.length, endCharacters.length);
            return true;
        }

        //If they don't match
        var extendedSelection: vscode.Selection;
        if (selection.start.character >= startCharacters.length) {//Extend selection to the Left if it is possible

            extendedSelection = new vscode.Selection(selection.start.translate(0, -1 * startCharacters.length), selection.end);
            if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters) === true) {
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                return true;
            }
        }
        if (selection.start.character >= (startCharacters.length + endCharacters.length)) {//Extend selection to the Left (stadt + endcharacters) if it is possible
            //reason: if there is nothing selected, and the button gets pressed, the cursor will jump at the end after the characters
            extendedSelection = new vscode.Selection(selection.start.translate(0, (-1 * startCharacters.length + -1 * endCharacters.length)), selection.end);
            if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters) === true) {
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                return true;
            }
        }
        var lineLength = currentTextEditor.document.lineAt(selection.end.line).range.end.character;
        if (selection.end.character <= lineLength - endCharacters.length) {//Extend selection to the Right if it is possible

            extendedSelection = new vscode.Selection(selection.start, selection.end.translate(0, endCharacters.length));
            if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters) === true) {
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                return true;
            }
        }
        if (selection.start.character >= startCharacters.length && selection.end.character <= lineLength - endCharacters.length) {//Extend selection in both directions if it is possible

            extendedSelection = new vscode.Selection(selection.start.translate(0, -1 * startCharacters.length), selection.end.translate(0, endCharacters.length));
            if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters) === true) {
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                return true;
            }
        }
        if (selection.start.character >= startCharacters.length && selection.end.character <= lineLength - endCharacters.length) {//Extend selection to the full length of the line
            var newStartPositionAtLineStart = new vscode.Position(selection.start.line, 0);
            var newStartPositionAtLineEnd = new vscode.Position(selection.end.line, lineLength);
            extendedSelection = new vscode.Selection(newStartPositionAtLineStart, newStartPositionAtLineEnd);
            if (await this.checkStringForMarkersAtBeginningAndEnd(currentTextEditor, extendedSelection, startCharacters, endCharacters) === true) {
                //Extended Selection, if the beginning was not selected
                await this.deleteCharactersInSelection(currentTextEditor, extendedSelection, startCharacters.length, endCharacters.length);
                return true;
            }
        }
        //If they are different and the selection is not longer than the length of the startCharacters
        return await this.wrapCharactersAroundSelection(currentTextEditor, selection, startCharacters, endCharacters);
    }

    /**
     * Creates a custom File Resource URI that can be used in the Webview
     * @param name Name of the Icon WITH file extension. So for example "bold.png"
     * @param context Context of the Extension
     * @returns resource from type vscode.Uri
     */
    public getWebviewResourceIconURI(name, context): vscode.Uri {
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
    public getWebviewResourceURI(name, folder, context): vscode.Uri {
        const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, folder, name));
        // And get the special URI to use with the webview
        const ressource = onDiskPath.with({ scheme: 'vscode-resource' });
        return ressource;
    }

    /** Generates a semi random UUID.
     * @returns a UUID.
     */
    public generateUuid() {
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
    public async getContentOfFile(fileName: string, encoding?: string) {
        return new Promise(async (resolve, reject) => {
            if (encoding === undefined) {
                encoding = chardet.detectFileSync(fileName);
            }
            if (fileName === "") {
                vscode.window.showErrorMessage(this._language.get("readingFileError"));
                reject();
            }
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    vscode.window.showErrorMessage(this._language.get("readingFileError"));
                    reject(err);
                }
                // ToDo check under OS X
                if(encoding){
                    resolve(iconvLite.decode(data, encoding));
                }else{
                    resolve(data);
                }
            });
        });
    }


    /**
     * Checks if a selection starts with a given string
     * @param testText text to check if the selection begins with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    public async checkIfSelectionStartsWith(testText: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {

        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
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
        } else {
            return (false);
        }
    }

    /**
     * Checks if a selection ends with a given string
     * @param testText text to check if the selection begins with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    public async checkIfSelectionEndsWith(testText: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {

        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
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
    }

    /**
     * Iterates upwards from the given selection until it found a line that begins with the given test string, or the beginning of the file
     * @param testString text to check if the selection begins with
     * @param antiString string, if this is found instead of the test string the search will stop
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     */
    public async iterateUpwardsToCheckForString(testString: string, antiString: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        var selectionStartLine = selection.start.line;
        var selectionStartsWith = await this.checkIfSelectionStartsWith(testString, currentTextEditor, selection);
        var selectionStartsWithAntiString = await this.checkIfSelectionStartsWith(antiString, currentTextEditor, newSelection); //Check if the current line starts with the antistring
        if (selectionStartsWithAntiString === true) {
            return false;
        }
        var newEndPositionStart = new vscode.Position(selection.start.line, 0);
        var newEndPositionEnd = new vscode.Position(selection.start.line, currentTextEditor.document.lineAt(selection.start.line).range.end.character);
        var newEndSelectionAtFirstLine = new vscode.Selection(newEndPositionStart, newEndPositionEnd);
        selectionStartsWithAntiString = await this.checkIfSelectionEndsWith(antiString, currentTextEditor, newEndSelectionAtFirstLine); //Check if the current line ENDS with the antistring
        if (selectionStartsWithAntiString === true) {
            return false;
        }
        if (selectionStartsWith === true) {
            return selection;
        }
        for (var i = selectionStartLine; i >= 0; i--) {
            var newStartPosition = new vscode.Position(i, 0);
            var newSelection = new vscode.Selection(newStartPosition, selection.end);
            selectionStartLine = selection.start.line;
            selectionStartsWith = await this.checkIfSelectionStartsWith(testString, currentTextEditor, newSelection);
            selectionStartsWithAntiString = await this.checkIfSelectionStartsWith(antiString, currentTextEditor, newSelection); //Checks if this line starts with the antistring
            if (selectionStartsWithAntiString === true) {
                return false;
            }
            newEndPositionStart = new vscode.Position(newSelection.start.line, 0);
            newEndPositionEnd = new vscode.Position(newSelection.start.line, currentTextEditor.document.lineAt(newSelection.start.line).range.end.character);
            newEndSelectionAtFirstLine = new vscode.Selection(newEndPositionStart, newEndPositionEnd);
            selectionStartsWithAntiString = await this.checkIfSelectionEndsWith(antiString, currentTextEditor, newEndSelectionAtFirstLine); //Check if this line ends with the antistring
            if (selectionStartsWithAntiString === true) {
                return false;
            }
            if (selectionStartsWith === true) {
                return newSelection;
            }
        }
        return false;
    }

    /**
     * Iterates downwards from the given selection until it found a line that begins with the given test string, or the end of the file
     * @param testString text to check if the selection ends with
     * @param currentTextEditor optional. The given text editor
     * @param selection optional. A custom selection
     * @returns false if nothing is found, otherwise a new selection ending with the line
     */
    public async iterateDownwardsToCheckForString(testString: string, currentTextEditor?: vscode.TextEditor, selection?: vscode.Selection) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        var selectionStartLine = selection.end.line;
        var selectionStartsWith = await this.checkIfSelectionEndsWith(testString, currentTextEditor, selection);
        if (selectionStartsWith === true) {
            return selection;
        }
        var documentEndLine = currentTextEditor.document.lineCount;
        for (var i = selectionStartLine; i < documentEndLine; i++) {
            var lineLength = currentTextEditor.document.lineAt(i).range.end.character;
            var newEndPosition = new vscode.Position(i, lineLength);
            var newSelection = new vscode.Selection(selection.start, newEndPosition);
            selectionStartLine = selection.start.line;
            selectionStartsWith = await this.checkIfSelectionEndsWith(testString, currentTextEditor, newSelection);
            if (selectionStartsWith === true) {
                return newSelection;
            }
        }
        return false;
    }

    /**
     * Makes a directory with a promise
     * @param path path that will be created
     * @returns promise that resolves into the path
     */
    public mkDir(path: string) {
        return new Promise(async (resolve, reject) => {
            fs.mkdir(path, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(this._language.get('createFolderError'));
                    console.log(err);
                }
                resolve(path);
            });
        });
    }
    /**
     * Checks if a path to a folder exists
     * @param path string absolute path to the folder
     * @returns promise that resolves to true if path exist, otherwise false.
     */
    public folderExists(path: string) {
        return new Promise(async (resolve, reject) => {
            if (fs.existsSync(path)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Checks if file Exists
     * @param path path to file
     * @returns true if file exists, otherwise false
     */
    public fileExists(path: string) {
        return new Promise(async (resolve, reject) => {
            if (fs.existsSync(path)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Parses CSV to JSON
     * @param csvData csv data as String
     * @returns JSON if possible, otherwise false
     */
    public async parseCSVtoJSON(csvData: string, delimiter: string) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = Papa.parse(csvData,
                {
                    delimiter: delimiter,
                });

                resolve(result);
            } catch (e) {
                console.log(e);
                resolve(false);
            }
        });
    }

    /**
     * Replaces a Selection with a different Text
     * @param replacetext text that replaces the selection
     * @param selection otional. The selection used
     * @param currentTextEditor optional. The editor used
     */
    public async replaceSelection(replacetext: string, selection?: vscode.Selection, currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this.getWordsSelection(currentTextEditor);
        }
        const workSpaceEdit = new vscode.WorkspaceEdit();
        workSpaceEdit.replace(
            currentTextEditor.document.uri,
            selection,
            replacetext
        );
        await vscode.workspace.applyEdit(workSpaceEdit);
    }

    /**
     * gets the content of a line
     * @param line number of the line
     * @param currentTextEditor optional. The editor the Document is in
     * @returns string of content or null if not possible
     */
    public async getLineContent(line: number, currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this.getCurrentTextEditor();
        }
        if (line < 0) {
            return null;
        }
        var lengthOfDocument = currentTextEditor.document.lineCount;
        if (line >= lengthOfDocument) {
            return null;
        }
        var content: string = await currentTextEditor.document.lineAt(line).text;
        return content;
    }

    /**
     * returns the directory of a path to a given file
     * @param filepath the full path to the file
     * @returns Folder/ Directory or error
     */
    public async getFolderFromFilePath(filepath: string) {
        var filepath = await path.dirname(filepath);
        return (filepath);
    }

    /**
     * adds a Folder to the open Worspaces
     * @param path string to the Folder
     */
    public async addWorkspaceFolder(path: string) {
        var uri = vscode.Uri.file(path);
        await vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: uri });
    }

    public normalizePath(path2normalize: string){
        return path.normalize(path2normalize);
    }

    public async ShowMkErrorMessage(mkResult: Object) {
        Object.keys(mkResult).forEach(key => {
            var location = key.split(path.sep).reverse()[0];  // file name or directory name
            var errorMessage = "";  // text of the errorMessageq
            var mkMessageContent = mkResult[key][0];
            if(typeof(mkMessageContent) === 'string'){  // mkResult can be a string:
                errorMessage = `error in ${location} more details ${mkMessageContent}`;
            } else {
                // mk is an object and looks like the following example
                //  {line number: " Detailed description of error"}
                Object.keys(mkMessageContent).forEach(key2 => {
                    errorMessage = `Fehler in ${location}: ${key2} : ${mkMessageContent[key2]}`;
                });
            }
            vscode.window.showErrorMessage(errorMessage);
        });

    }
}
