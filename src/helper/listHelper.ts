/**
 * @author  Lucas Vogel
 */

import * as vscode from 'vscode';
import Helper from './helper';

/**
 * Helper for the list-functions
 */
export default class ListHelper {
    private _helper: Helper;
    constructor() {
        this._helper = new Helper;
    }

    /**
     * If the current line is a numbered list, return the number of the list item.
     * @param line line to check.
     * @returns 0 if nothing is found, or the number of the line
     */
    public async getLineListNumber(line: number) {
        var lineContent = await this._helper.getLineContent(line);
        if (lineContent === null) {
            return 0;
        }
        var numberRegex = /^[\ \t]*([0-9]+)./;
        var matchParts = lineContent.match(numberRegex);
        if (matchParts === null || matchParts === undefined || matchParts.length < 2) {
            return 0;
        }
        var number = Number(matchParts[1]);
        if (number === NaN || number === null || number === undefined) {
            return 0;
        } else {
            return number;
        }
    }

    public async getListBullet(line: number) {
        var bullet;
        var bulletRegex = /^[*-]/; // looks for * and -
        var lineContent = await this._helper.getLineContent(line);
        var result = lineContent.match(bulletRegex);
        return result;
    }

    public async unorderedList() {
        var currentTextEditor = await this._helper.getCurrentTextEditor();
        var selection = this._helper.getWordsSelection(currentTextEditor);
        var currentLineNumber = await this.getLineListNumber(selection.start.line);
        if (currentLineNumber !== 0) {
           await this._helper.toggleCharactersAtBeginningOfLine("1. ");
        }
        this._helper.toggleCharactersAtBeginningOfLine("- ");
    }

    /**
     * Checks what List item has to be inserted into the current line, and inserts it.
     * It automatically counts up if the previous line has a ordered List marker on it.
     * @param line optional. Line to check
     */
    public async orderedList(line?: number) {
        if (line === undefined) {
            var currentTextEditor = await this._helper.getCurrentTextEditor();
            var selection = this._helper.getWordsSelection(currentTextEditor);
            line = selection.start.line;
        }
        var nextNumberString = "";
        var currentLineNumber = await this.getLineListNumber(line);
        if (currentLineNumber !== 0) {
            this._helper.toggleCharactersAtBeginningOfLine("1. ");
        } else {
            var lastNumber: number = await this.getLineListNumber(line - 1);
            // case if unnumbered list is formatted to numbered one
            if (lastNumber == 0) {
                await this._helper.toggleCharactersAtBeginningOfLine(await this.getListBullet(line))
            }
            this._helper.insertStringAtStartOfForEachLineOfSelection(lastNumber);
            //Inserts it into the document
        }
    }

}