import * as vscode from 'vscode';
import Helper from './helper';


export default class ListHelper {
    private _helper: Helper;
    constructor() {
        this._helper = new Helper;
    }
    public async getLineListNumber(line: number) {
        //console.log("LINE");
        var prevLineContent = await this._helper.getLineContent(line);
        if (prevLineContent === null) {
            return 0;
        }
        //console.log("Text",prevLineContent);
        var numberRegex = /^[\ \t]*([0-9]+)./;
        var matchParts = prevLineContent.match(numberRegex);
        console.log("Matcparts", matchParts);
        if (matchParts === null || matchParts === undefined || matchParts.length < 2) {
            return 0;
        }
        var lastNumber = Number(matchParts[1]);
        console.log("LN", lastNumber);
        if (lastNumber === NaN || lastNumber === null || lastNumber === undefined) {
            return 0;
        } else {
            return lastNumber;
        }
        //console.log("parts:",matchParts);
    }

    public async orderedList(line?: number) {

        if (line === undefined) {
            var currentTextEditor = await this._helper.getCurrentTextEditor();
            var selection = this._helper.getWordsSelection(currentTextEditor);
            line = selection.start.line;
        }
        var nextNumberString = "";
        var currentLineNumber = await this.getLineListNumber(line);
        if(currentLineNumber !==0){
            nextNumberString = " " + (currentLineNumber + 1) + ".";
            this._helper.insertStringAtStartOfLineOrLinebreak(nextNumberString);
        } else {
        var lastNumber: number = await this.getLineListNumber(line-1);
        nextNumberString = " " + (lastNumber + 1) + ".";
        this._helper.insertStringAtStartOfLineOrLinebreak(nextNumberString);
        console.log(lastNumber);
        }
    }

}