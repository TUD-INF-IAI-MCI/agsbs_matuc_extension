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
const languages_1 = require("../languages");
const helper_1 = require("./helper");
const insertHelper_1 = require("./insertHelper");
class HeadlineHelper {
    constructor() {
        /**
         * sets a specific headline grade at the current line. This is a abstraction of setHeadlineAtLine()
         * @param number headline grade
         */
        this.setSpecificHeadline = (number) => __awaiter(this, void 0, void 0, function* () {
            var currentTextEditor = yield this._helper.getCurrentTextEditor();
            var selection = yield this._helper.getWordsSelection(currentTextEditor);
            this.setHeadlineAtLine(number, selection.start.line);
            this._helper.focusDocument(); //Puts focus back to the text editor
        });
        this._language = new languages_1.default;
        this._helper = new helper_1.default;
        this._insertHelper = new insertHelper_1.default;
    }
    /**
     * sets a Headline with a given grade at a given line.
     * @param headlineGrade number of the grade
     * @param line line it should be inserted
     * @param currentTextEditor optional. the TextEditor to work with
     * @returns false if error, otherwise nothing.
     */
    setHeadlineAtLine(headlineGrade, line, currentTextEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (headlineGrade < 1) {
                vscode.window.showErrorMessage(this._language.get("headlineNumberTooSmall"));
                return false;
            }
            if (headlineGrade > 6) {
                vscode.window.showErrorMessage(this._language.get("headlineNumberTooBig"));
                return false;
            }
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            var thisLine = yield currentTextEditor.document.lineAt(line).text;
            var headlineRegex = /^\#{1,6}\ /; //?|\#{1,6}$
            var result = thisLine.match(headlineRegex);
            var newHeadlineMarkerString = new Array(headlineGrade + 1).join("#") + " ";
            if (result !== null && result !== undefined) {
                var resultString = result[0];
                var startPosition = new vscode.Position(line, 0);
                var endPosition = new vscode.Position(line, resultString.length);
                var range = new vscode.Range(startPosition, endPosition);
                const workSpaceEdit = new vscode.WorkspaceEdit();
                workSpaceEdit.replace(currentTextEditor.document.uri, range, newHeadlineMarkerString);
                yield vscode.workspace.applyEdit(workSpaceEdit);
            }
            else {
                this._helper.insertStringAtStartOfLine(newHeadlineMarkerString);
            }
        });
    }
    /**
     * Looks at all the lines above and returns the next headline grade as a usable string.
     * It will return one with first grade if there is no h1 above or in the current page. Otherwise it will return the above used headline grade.
     * @param selection optional. The selection to work with.
     * @param currentTextEditor optional. The Editor to work with.
     */
    getNextHeadlineString(selection, currentTextEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentTextEditor === undefined) {
                currentTextEditor = yield this._helper.getCurrentTextEditor();
            }
            if (selection === undefined) {
                selection = this._helper.getWordsSelection(currentTextEditor);
            }
            var startLineNumber = selection.start.line;
            for (var i = startLineNumber; i >= 0; i--) { //Go upwards from the current line
                var currentLineText = yield currentTextEditor.document.lineAt(i).text;
                var headlineRegex = /^\#{1,6}\ /;
                var result = currentLineText.match(headlineRegex);
                if (result !== null && result !== undefined && result.length > 0) {
                    var resultText = result[0];
                    var headlineGrade = (resultText.match(/\#/g) || []).length;
                    if (headlineGrade === 1) {
                        return "## ";
                    }
                    else {
                        return resultText;
                    }
                }
                var newPageIdentifier = this._insertHelper.getNewPageIdentifier();
                if (currentLineText.startsWith(newPageIdentifier)) {
                    //console.log("new Page found");
                    return "## ";
                }
            }
            //console.log("not Found");
            return "# ";
        });
    }
}
exports.default = HeadlineHelper;
//# sourceMappingURL=headlineHelper.js.map