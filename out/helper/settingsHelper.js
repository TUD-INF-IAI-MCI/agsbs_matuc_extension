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
const helper_1 = require("./helper");
const languages_1 = require("../languages");
const os = require("os");
const path = require("path");
class SettingsHelper {
    constructor() {
        this._helper = new helper_1.default;
        this._language = new languages_1.default;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            var gitLocalPath = yield this.get("gitLocalPath");
            if (gitLocalPath === "") {
                this.setAutoGitLocalPath();
            }
            // console.log(await this.get("gitLocalPath"));
            //var folders = await vscode.workspace.workspaceFolders;
            //console.log(folders);
            //agsbs.update(settingsIdentifier,value,true);
        });
    }
    get(settingIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield vscode.workspace.getConfiguration('agsbs').get(settingIdentifier);
            return (result);
        });
    }
    update(settingsIdentifier, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var agsbs = yield vscode.workspace.getConfiguration('agsbs');
            agsbs.update(settingsIdentifier, value, true);
        });
    }
    setAutoGitLocalPath() {
        return __awaiter(this, void 0, void 0, function* () {
            var homedir = os.homedir();
            var gitLocalPathIdentifier = "gitLocalPath";
            var agsbsFolderName = "AGSBS_Git";
            var agsbsFolderPath = homedir;
            var homeDocumentsEnglish = homedir + path.sep + "Documents";
            var homeDocumentsEnglishExists = yield this._helper.folderExists(homeDocumentsEnglish);
            if (homeDocumentsEnglishExists === true) {
                agsbsFolderPath = homeDocumentsEnglish + path.sep + agsbsFolderName;
                if ((yield this._helper.folderExists(agsbsFolderPath)) === false) {
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier, agsbsFolderPath);
                return;
            }
            var homeDocumentsGermanFolder = homedir + path.sep + "Dokumente";
            var homeDocumentsGermanFolderExists = yield this._helper.folderExists(homeDocumentsGermanFolder);
            if (homeDocumentsGermanFolderExists === true) {
                agsbsFolderPath = homeDocumentsGermanFolder + path.sep + agsbsFolderName;
                if ((yield this._helper.folderExists(agsbsFolderPath)) === false) {
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier, agsbsFolderPath);
                return;
            }
            var homeDocumentsLanguageFolder = homedir + path.sep + this._language.get("osDocumentsFolderName");
            var homeDocumentsLanguageFolderExists = yield this._helper.folderExists(homeDocumentsLanguageFolder);
            if (homeDocumentsLanguageFolderExists === true) {
                agsbsFolderPath = homeDocumentsLanguageFolder + path.sep + agsbsFolderName;
                if ((yield this._helper.folderExists(agsbsFolderPath)) === false) {
                    this._helper.mkDir(agsbsFolderPath);
                }
                this.update(gitLocalPathIdentifier, agsbsFolderPath);
                return;
            }
            var homeFolder = homedir + path.sep;
            agsbsFolderPath = homeFolder + path.sep + agsbsFolderName;
            if ((yield this._helper.folderExists(agsbsFolderPath)) === false) {
                this._helper.mkDir(agsbsFolderPath);
            }
            this.update(gitLocalPathIdentifier, agsbsFolderPath);
            return;
        });
    }
}
exports.default = SettingsHelper;
//# sourceMappingURL=settingsHelper.js.map