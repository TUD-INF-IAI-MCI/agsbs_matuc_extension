/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import Language from "../languages";
import Helper from "./helper";
import InsertHelper from "./insertHelper";

export default class HeadlineHelper {
    private _language: Language;
    private _helper: Helper;
    private _insertHelper: InsertHelper;
    constructor() {
        this._language = new Language();
        this._helper = new Helper();
        this._insertHelper = new InsertHelper();
    }

    /**
     * sets a specific headline grade at the current line. This is a abstraction of setHeadlineAtLine()
     * @param number headline grade
     */
    public setSpecificHeadline = async (number: number) => {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const selection = this._helper.getWordsSelection(currentTextEditor);
        this.setHeadlineAtLine(number, selection.start.line);
        this._helper.focusDocument(); //Puts focus back to the text editor
    };

    /**
     * sets a Headline with a given grade at a given line.
     * @param headlineGrade number of the grade
     * @param line line it should be inserted
     * @param currentTextEditor optional. the TextEditor to work with
     * @returns false if error, otherwise nothing.
     */
    public async setHeadlineAtLine(headlineGrade: number, line: number, currentTextEditor?: vscode.TextEditor) {
        if (headlineGrade < 1) {
            vscode.window.showErrorMessage(this._language.get("headlineNumberTooSmall"));
            return false;
        }
        if (headlineGrade > 6) {
            vscode.window.showErrorMessage(this._language.get("headlineNumberTooBig"));
            return false;
        }
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        const thisLine = currentTextEditor.document.lineAt(line).text;
        const headlineRegex = /^\#{1,6}\ /; //?|\#{1,6}$
        const result = thisLine.match(headlineRegex);
        const newHeadlineMarkerString: string = new Array(headlineGrade + 1).join("#") + " ";
        if (result !== null && result !== undefined) {
            const resultString: string = result[0];
            const startPosition = new vscode.Position(line, 0);
            const endPosition = new vscode.Position(line, resultString.length);
            const range = new vscode.Range(startPosition, endPosition);
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.replace(currentTextEditor.document.uri, range, newHeadlineMarkerString);
            await vscode.workspace.applyEdit(workSpaceEdit);
        } else {
            this._helper.styleSelection(newHeadlineMarkerString, "");
        }
    }

    /**
     * Looks at all the lines above and returns the next headline grade as a usable string.
     * It will return one with first grade if there is no h1 above or in the current page. Otherwise it will return the above used headline grade.
     * @param selection optional. The selection to work with.
     * @param currentTextEditor optional. The Editor to work with.
     */
    public async getNextHeadlineString(selection?: vscode.Selection, currentTextEditor?: vscode.TextEditor) {
        if (currentTextEditor === undefined) {
            currentTextEditor = await this._helper.getCurrentTextEditor();
        }
        if (selection === undefined) {
            selection = this._helper.getWordsSelection(currentTextEditor);
        }
        const startLineNumber: number = selection.start.line;
        for (let i = startLineNumber; i >= 0; i--) {
            //Go upwards from the current line
            const currentLineText = currentTextEditor.document.lineAt(i).text;
            const headlineRegex = /^\#{1,6}\ /;
            const result = currentLineText.match(headlineRegex);
            if (result !== null && result !== undefined && result.length > 0) {
                const resultText = result[0];
                const headlineGrade: number = (resultText.match(/\#/g) || []).length;

                if (headlineGrade === 1) {
                    return "## ";
                } else {
                    return resultText;
                }
            }
            const newPageIdentifier = this._insertHelper.getNewPageIdentifier();
            if (currentLineText.startsWith(newPageIdentifier)) {
                return "## ";
            }
        }
        return "# ";
    }
}
