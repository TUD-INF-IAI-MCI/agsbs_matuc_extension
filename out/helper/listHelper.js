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
const helper_1 = require("./helper");
class ListHelper {
    constructor() {
        this._helper = new helper_1.default;
    }
    getLineListNumber(line) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("LINE");
            var prevLineContent = yield this._helper.getLineContent(line);
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
            }
            else {
                return lastNumber;
            }
            //console.log("parts:",matchParts);
        });
    }
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
                console.log(lastNumber);
            }
        });
    }
}
exports.default = ListHelper;
//# sourceMappingURL=listHelper.js.map