/**
 * @author  Lucas Vogel
 */

import * as vscode from "vscode";
import Helper from "./helper";

/**
 * Helper for the list-functions
 */
export default class ListHelper {
    private _helper: Helper;
    constructor() {
        this._helper = new Helper();
    }

    /**
     * If the current line is a numbered list, return the number of the list item.
     * @param line line to check.
     * @returns 0 if nothing is found, or the number of the line
     */
    public async getLineListNumber(line: number) {
        const lineContent = await this._helper.getLineContent(line);
        if (lineContent === null) {
            return 0;
        }
        const numberRegex = /^[\ \t]*([0-9]+)./;
        const matchParts = lineContent.match(numberRegex);
        if (matchParts === null || matchParts === undefined || matchParts.length < 2) {
            return 0;
        }
        const number = Number(matchParts[1]);
        if (Number.isNaN(number) || number === null || number === undefined) {
            return 0;
        } else {
            return number;
        }
    }

    public async getListBullet(line: number) {
        const bulletRegex = /^[*-]/; // looks for * and -
        const lineContent = await this._helper.getLineContent(line);
        const result = lineContent.match(bulletRegex);
        if (result) {
            return result[0];
        } else {
            return null;
        }
    }

    public async unorderedList() {
        const currentTextEditor = await this._helper.getCurrentTextEditor();
        const selection = this._helper.getWordsSelection(currentTextEditor);
        const currentLineNumber = await this.getLineListNumber(selection.start.line);
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
            const currentTextEditor = await this._helper.getCurrentTextEditor();
            const selection = this._helper.getWordsSelection(currentTextEditor);
            line = selection.start.line;
        }
        const currentLineNumber = await this.getLineListNumber(line);
        if (currentLineNumber !== 0) {
            this._helper.toggleCharactersAtBeginningOfLine("1. ");
        } else {
            const lastNumber: number = await this.getLineListNumber(line - 1);
            // case if unnumbered list is formatted to numbered one
            if (lastNumber === 0) {
                await this._helper.toggleCharactersAtBeginningOfLine(await this.getListBullet(line));
            }
            this._helper.insertStringAtStartOfForEachLineOfSelection(lastNumber);
            //Inserts it into the document
        }
    }
}
