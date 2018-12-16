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
const en_1 = require("./languages/en");
class Language {
    constructor() {
        this._loadLanguageFile = (language) => __awaiter(this, void 0, void 0, function* () {
            console.log("Language: " + language);
            switch (language) {
                case "en":
                    this.languageClass = new en_1.default();
                    break;
                default:
                    this.languageClass = new en_1.default();
                    break;
            }
        });
        this.get = (name) => {
            return this.languageClass.get(name);
        };
        this.language = this.getVscodeLanguage();
        this._loadLanguageFile(this.language);
    }
    getVscodeLanguage() {
        return vscode.env.language;
    }
}
exports.default = Language;
//# sourceMappingURL=languages.js.map