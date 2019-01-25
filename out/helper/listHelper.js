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
const helper_1 = require("./helper");
/**
 * Helper for the list-functions
 */
class ListHelper {
    constructor() {
        this._helper = new helper_1.default;
    }
    /**
     * If the current line is a numbered list, return the number of the list item.
     * @param line line to check.
     * @returns 0 if nothing is found, or the number of the line
     */
    getLineListNumber(line) {
        return __awaiter(this, void 0, void 0, function* () {
            var lineContent = yield this._helper.getLineContent(line);
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
            }
            else {
                return number;
            }
        });
    }
    /**
     * Checks what List item has to be inserted into the current line, and inserts it.
     * It automatically counts up if the prevoius line has a ordered List marker on it.
     * @param line optional. Line to check
     */
    orderedList(line) {
        return __awaiter(this, void 0, void 0, function* () {
            if (line === undefined) {
                var currentTextEditor = yield this._helper.getCurrentTextEditor();
                var selection = this._helper.getWordsSelection(currentTextEditor);
                line = selection.start.line;
            }
            var nextNumberString = "";
            var currentLineNumber = yield this.getLineListNumber(line);
            if (currentLineNumber !== 0) {
                nextNumberString = " " + (currentLineNumber + 1) + ".";
                this._helper.insertStringAtStartOfLineOrLinebreak(nextNumberString);
            }
            else {
                var lastNumber = yield this.getLineListNumber(line - 1);
                nextNumberString = " " + (lastNumber + 1) + ".";
                this._helper.insertStringAtStartOfLineOrLinebreak(nextNumberString);
                //Inserts it into the document
            }
        });
    }
}
exports.default = ListHelper;
//# sourceMappingURL=listHelper.js.map