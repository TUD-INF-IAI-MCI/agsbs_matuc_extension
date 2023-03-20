/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import Helper from "./helper";

/**
 * Helper for the insert-functions.
 */
export default class InsertHelper {
    private _helper: Helper;
    constructor() {
        this._helper = new Helper();
    }

    /**
     * Returns the page identifier
     */
    public getNewPageIdentifier(): string {
        return "|| - Seite ";
    }

    /**
     * checks where the current page ends by searching for the start of a new page
     * @param selection optional. The selection to work with.
     * @param currentTextEditor optional. The text editor to work with.
     * @returns false if error, otherwise a point from type vscode.Position ending at the end of the page.
     */
    public getPageEndLine = async (
        selection?: vscode.Selection,
        currentTextEditor?: vscode.TextEditor
    ): Promise<false | vscode.Position> => {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        const newpageString = this.getNewPageIdentifier();
        const newSelection = await this.iterateDownwardsToCheckForStringStart(newpageString);
        if (newSelection !== false) {
            if (selection.end.line > 0) {
                //if there is room above the line
                const previousLineNumber = newSelection.end.line - 1;
                const previousLineLength = currentTextEditor.document.lineAt(previousLineNumber).range.end.character;
                const newEndPoint = new vscode.Position(previousLineNumber, previousLineLength);
                return newEndPoint;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    /**
     * Iterates downwards starting at the current selection and checks if a line starts with a given string
     * @param testString String to test with
     * @param currentTextEditor optional. The Editor to work with
     * @param selection optional. The Selection to work with
     */
    public async iterateDownwardsToCheckForStringStart(
        testString: string,
        currentTextEditor?: vscode.TextEditor,
        selection?: vscode.Selection
    ): Promise<false | vscode.Selection> {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        let selectionStartLine = selection.end.line;
        let selectionStartsWith = await this._helper.checkIfSelectionStartsWith(
            testString,
            currentTextEditor,
            selection
        );
        if (selectionStartsWith) {
            return selection;
        }
        const documentEndLine = currentTextEditor.document.lineCount;
        for (let i = selectionStartLine; i < documentEndLine; i++) {
            const lineLength = currentTextEditor.document.lineAt(i).range.end.character;
            const newStartPosition = new vscode.Position(i, 0);
            const newEndPosition = new vscode.Position(i, lineLength);
            const newSelection = new vscode.Selection(newStartPosition, newEndPosition);
            selectionStartLine = selection.start.line;
            selectionStartsWith = await this._helper.checkIfSelectionStartsWith(
                testString,
                currentTextEditor,
                newSelection
            );
            if (selectionStartsWith) {
                return newSelection;
            }
        }
        return false;
    }

    /**
     * Checks the whole Document ot it includes a specific string.
     * @param testString String to test with
     * @param currentTextEditor optional. The Editor to work with.
     * @returns true if the string was found, otherwise false
     */
    public async checkDocumentForString(testString: string, currentTextEditor?: vscode.TextEditor): Promise<boolean> {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        const documentText: string = currentTextEditor.document.getText();
        if (documentText.includes(testString)) {
            return true;
        }
        return false;
    }
}
