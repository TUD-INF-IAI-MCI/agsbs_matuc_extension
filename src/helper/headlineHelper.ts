import * as vscode from 'vscode';
import Language from '../languages';
import Helper from './helper';
import InsertHelper from './insertHelper';


export default class HeadlineHelper {

    private _language: Language;
    private _helper: Helper;
    private _insertHelper:InsertHelper;
    constructor() {
        this._language = new Language;
        this._helper = new Helper;
        this._insertHelper = new InsertHelper;
    }


    /**
     * sets a specific headline grade at the current line. This is a abstraction of setHeadlineAtLine()
     * @param number headline grade
     */
    public setSpecificHeadline = async (number: number) => {
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = await this._helper.getWordsSelection(currentTextEditor);

        this.setHeadlineAtLine(number, selection.start.line);
        this._helper.focusDocument(); //Puts focus back to the text editor
    }

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
        var thisLine = await currentTextEditor.document.lineAt(line).text;
        var headlineRegex = /^\#{1,6}\ /; //?|\#{1,6}$
        var result = thisLine.match(headlineRegex);
        var newHeadlineMarkerString: string = new Array(headlineGrade + 1).join("#") + " ";
        if (result !== null && result !== undefined) {

            var resultString: string = result[0];

            var startPosition = new vscode.Position(line, 0);
            var endPosition = new vscode.Position(line, resultString.length);
            var range = new vscode.Range(startPosition, endPosition);
            const workSpaceEdit = new vscode.WorkspaceEdit();
            workSpaceEdit.replace(
                currentTextEditor.document.uri,
                range,
                newHeadlineMarkerString
            );
            await vscode.workspace.applyEdit(workSpaceEdit);
        }
        else {
            this._helper.insertStringAtStartOfLine(newHeadlineMarkerString);
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

        var startLineNumber: number = selection.start.line;
        for (var i = startLineNumber; i >= 0; i--) { //Go upwards from the current line
            var currentLineText = await currentTextEditor.document.lineAt(i).text;
            var headlineRegex = /^\#{1,6}\ /;
            var result = currentLineText.match(headlineRegex);
            if (result !== null && result !== undefined && result.length > 0) {
                var resultText = result[0];
                var headlineGrade: number = (resultText.match(/\#/g) || []).length;

                if (headlineGrade === 1) {
                    return "## ";
                } else {
                    return resultText;
                }

            }
            var newPageIdentifier = this._insertHelper.getNewPageIdentifier();
            if (currentLineText.startsWith(newPageIdentifier)){
                //console.log("new Page found");
                return "## ";
            }

        }

        //console.log("not Found");
        return "# ";


    }


}