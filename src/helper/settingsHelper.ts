/**
 * @author  Lucas Vogel
 */

import * as vscode from 'vscode';
import Helper from './helper';
import Language from '../languages';
import * as os from 'os';
import * as path from 'path';

/**
 * A Helper to get and set the Settings of this Extension.
 * It contains wrapper to get and set, as well as a setup to
 * set default parameters at first startup, like the git Path.
 */
export default class SettingsHelper {
    private _helper: Helper;
    private _language: Language;

    constructor() {
        this._helper = new Helper;
        this._language = new Language;

    }

    /**
     * This setup will be executed at every launch of the extension. It just checks if the default parameters are set,
     * and if there are not set, sets them.
     */
    public async setup() {
        var gitLocalPath = await this.get("gitLocalPath");
        if (gitLocalPath === "") {
            this.setAutoGitLocalPath();
        }
    }

    /**
     * Get a Settings Value
     * @param settingIdentifier The settings Identifier. This is only the last part of the identifier, after the point. So for "agsbs.gitLocalPath" it is just "gitLocalPath".
     * @returns value of the Setting.
     */
    public async get(settingIdentifier: string) {
        var result = await vscode.workspace.getConfiguration('agsbs').get(settingIdentifier);
        return (result);
    }

    /**
     * Updates a Value of the Settings. It will automatically set the global (User)-Setting, not the workspace setting.
     * If you don't know the difference of these both than you dont have to care about it, thats why there is a wrapper.
     * @param settingsIdentifier  The settings Identifier. This is only the last part of the identifier, after the point. So for "agsbs.gitLocalPath" it is just "gitLocalPath".
     * @param value new value of the Setting
     */
    public async update(settingsIdentifier: string, value: any) {
        var agsbs = await vscode.workspace.getConfiguration('agsbs');
        agsbs.update(settingsIdentifier, value, true);
    }

    /**
     * If it is not set, make a folder for the agsbs git module to push repos into and update the settings to the path.
     * This Function is sp long because it checks different possibilities as it tries to make a agsbs folder in the Documents
     * folder of the user. If it fails, it will just create a folder in the home directory.
     */
    public async setAutoGitLocalPath() {
        var homedir: string = os.homedir();
        var gitLocalPathIdentifier = "gitLocalPath";
        var agsbsFolderName = "AGSBS_Git";
        var agsbsFolderPath: string = homedir;
        var homeDocumentsEnglish = homedir + path.sep + "Documents";
        var homeDocumentsEnglishExists = await this._helper.folderExists(homeDocumentsEnglish);
        if (homeDocumentsEnglishExists === true) {
            agsbsFolderPath = homeDocumentsEnglish + path.sep + agsbsFolderName;
            if (await this._helper.folderExists(agsbsFolderPath) === false) {
                this._helper.mkDir(agsbsFolderPath);
            }
            this.update(gitLocalPathIdentifier, agsbsFolderPath);
            return;
        }
        var homeDocumentsGermanFolder = homedir + path.sep + "Dokumente";
        var homeDocumentsGermanFolderExists = await this._helper.folderExists(homeDocumentsGermanFolder);
        if (homeDocumentsGermanFolderExists === true) {
            agsbsFolderPath = homeDocumentsGermanFolder + path.sep + agsbsFolderName;
            if (await this._helper.folderExists(agsbsFolderPath) === false) {
                this._helper.mkDir(agsbsFolderPath);
            }
            this.update(gitLocalPathIdentifier, agsbsFolderPath);
            return;
        }
        var homeDocumentsLanguageFolder = homedir + path.sep + this._language.get("osDocumentsFolderName");
        var homeDocumentsLanguageFolderExists = await this._helper.folderExists(homeDocumentsLanguageFolder);
        if (homeDocumentsLanguageFolderExists === true) {
            agsbsFolderPath = homeDocumentsLanguageFolder + path.sep + agsbsFolderName;
            if (await this._helper.folderExists(agsbsFolderPath) === false) {
                this._helper.mkDir(agsbsFolderPath);
            }
            this.update(gitLocalPathIdentifier, agsbsFolderPath);
            return;
        }
        var homeFolder = homedir + path.sep;

        agsbsFolderPath = homeFolder + path.sep + agsbsFolderName;
        if (await this._helper.folderExists(agsbsFolderPath) === false) {
            this._helper.mkDir(agsbsFolderPath);
        }
        this.update(gitLocalPathIdentifier, agsbsFolderPath);
        return;


    }

}
