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
const vscode = require("vscode");
const helper_1 = require("./helper");
const languages_1 = require("../languages");
const os = require("os");
const path = require("path");
/**
 * A Helper to get and set the Settings of this Extension.
 * It contains wrapper to get and set, as well as a setup to
 * set default parameters at first startup, like the git Path.
 */
class SettingsHelper {
    constructor() {
        this._helper = new helper_1.default;
        this._language = new languages_1.default;
    }
    /**
     * This setup will be executed at every launch of the extension. It just checks if the default parameters are set,
     * and if there are not set, sets them.
     */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            var gitLocalPath = yield this.get("gitLocalPath");
            if (gitLocalPath === "") {
                this.setAutoGitLocalPath();
            }
        });
    }
    /**
     * Get a Settings Value
     * @param settingIdentifier The settings Identifier. This is only the last part of the identifier, after the point. So for "agsbs.gitLocalPath" it is just "gitLocalPath".
     * @returns value of the Setting.
     */
    get(settingIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield vscode.workspace.getConfiguration('agsbs').get(settingIdentifier);
            return (result);
        });
    }
    /**
     * Updates a Value of the Settings. It will automatically set the global (User)-Setting, not the workspace setting.
     * If you don't know the difference of these both than you dont have to care about it, thats why there is a wrapper.
     * @param settingsIdentifier  The settings Identifier. This is only the last part of the identifier, after the point. So for "agsbs.gitLocalPath" it is just "gitLocalPath".
     * @param value new value of the Setting
     */
    update(settingsIdentifier, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var agsbs = yield vscode.workspace.getConfiguration('agsbs');
            agsbs.update(settingsIdentifier, value, true);
        });
    }
    /**
     * If it is not set, make a folder for the agsbs git module to push repos into and update the settings to the path.
     * This Function is sp long because it checks different possibilities as it tries to make a agsbs folder in the Documents
     * folder of the user. If it fails, it will just create a folder in the home directory.
     */
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