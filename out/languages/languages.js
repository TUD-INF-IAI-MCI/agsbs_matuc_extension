"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Language {
    constructor() {
        var language = this._getVscodeLanguage();
        this._language = language;
    }
    getLanguage() {
        if (this._language == undefined || this._language == null) {
            return this._getVscodeLanguage();
        }
        else {
            return this._language;
        }
    }
    _getVscodeLanguage() {
        return vscode.env.language;
    }
    _loadLanguageFile() {
        var json;
        return json;
    }
}
exports.default = Language;
//# sourceMappingURL=languages.js.map